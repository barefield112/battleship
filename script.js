const playerCanvas = document.getElementById('player-screen');
const hiddenCanvas = document.getElementById('hidden-screen');
const setBoardButton = document.getElementById('setBoard');
const startButton = document.getElementById('startGame');
const endButton = document.getElementById('endGame');

function Ship(name, letter, length){
    this.name = name;
    this.letter = letter;
    this.length = length;
}
const Battleship = new Ship('Battleship', 'B', 4);
const AircraftCarrier = new Ship('Aircraft Carrier', 'A', 5);
const Cruiser = new Ship('Cruiser', 'C', 3);
const Submarine = new Ship('Submarine', 'S', 3);
const Destoryer = new Ship('Destroyer', 'D', 2);
const Ships = [Battleship, AircraftCarrier, Cruiser, Submarine, Destoryer];
let playerArray = createEmptyArray(10, 10);
let enemyArray = createEmptyArray(10, 10);
let hiddenArray = createEmptyArray(10,10);
let enemyHiddenArray = createEmptyArray(10,10);
enemyArray = randomMapOutShips(enemyArray);
let targetMode = false;
let target = [0,0];
let searchArea = 2;
let gameActive = false;
let isplayerTurn = false;

console.log("Ready to play? Keep clicking 'Set Board' till you like your set up and press 'Start' to begin");

hiddenCanvas.addEventListener('click', function(event){
    if(gameActive === true && isplayerTurn === true){
        const rect = hiddenCanvas.getBoundingClientRect();
        const x = event.x - rect.left;
        const y = event.y - rect.top;
        const gridWidth = rect.width / 10;
        const gridHeight = rect.height /10;
        const indexX = Math.floor(x / gridWidth);
        const indexY = Math.floor(y / gridHeight);
        playerTurn(indexX,indexY);
        setTimeout(enemyTurn, 4000);
    }
    
});
function beginGame(){
    gameActive = true;
    isplayerTurn = true;
    setBoardButton.style.display = "none";
    startButton.style.display = "none";
    endButton.style.display = "inline";
    drawGame();
}
function drawGame(){
    const playerCtx = playerCanvas.getContext('2d');
    const hiddenCtx = hiddenCanvas.getContext('2d');
    if(isplayerTurn === true && gameActive == true){
        hiddenCanvas.classList.add('highlight');
    }
    else{
        hiddenCanvas.classList.remove('highlight');
    }
    drawScreen(playerCanvas,playerCtx, playerArray);
    drawScreen(hiddenCanvas,hiddenCtx, hiddenArray);

    function drawScreen(canvas,ctx,array ){
        const width = canvas.width / 10;
        const height = canvas.height / 10;
        let colI = 0;
        array.forEach(row =>{
            let rowI = 0;
            row.forEach(item=>{
                ctx.beginPath();
                ctx.rect(0+ rowI, 0 + colI, width, height);
                ctx.strokeStyle = "white";
                ctx.stroke();
                switch(item){
                    case ' ':
                        ctx.fillStyle = "navy";
                        break;
                    case 'X':
                        ctx.fillStyle = "red";
                        break;
                    case 'O':
                        ctx.fillStyle ="white";
                        break;
                    case 'R':
                        ctx.fillStyle = 'red';
                        break;

                    default:
                        ctx.fillStyle = "gray";
                        break;

                }
                ctx.fill();
                ctx.font = '16px Arial';
                ctx.fillStyle = 'whitesmoke';   // Set the fill color for the text
                ctx.textAlign = 'center'; // Set the text alignment
                ctx.textBaseLine ="top";

                // Draw filled text
                ctx.fillText(item,  rowI + 14  , colI + 14);
                ctx.closePath();   
                rowI = rowI + width
            })
            colI = colI + height;
        })

    }
}
function playerTurn(inputX, inputY){    
        if(enemyArray[inputY][inputX]!= ' '){
            const hitLetter = enemyArray[inputY][inputX];
            enemyArray[inputY][inputX] = 'R';
            hiddenArray[inputY][inputX] = 'X';
            if(didShipSink(enemyArray, hitLetter)){
                Ships.forEach(ship =>{
                    if(ship.letter === hitLetter){
                        window.alert("You Sunk Their " + ship.name);
                    }
                })
                if(didPlayerWin(enemyArray)){
                    endGame(1);
                }
            }
            
        }
        else{
            hiddenArray[inputY][inputX] = 'O';
        }
        isplayerTurn = false;
        drawGame();
}
function enemyTurn(){
    let enemyX = 0;
    let enemyY = 0;
    const attackList = [];
        if (!targetMode) {
            for(let i = 0; i<enemyHiddenArray.length; i++){
                for(let j = 0; j<enemyHiddenArray.length; j++){
                    if(enemyHiddenArray[i][j] === ' '){
                        attackList.push([i,j]);
                    }
                }
            }
            const randomTarget = attackList[getRandomInt(0, attackList.length-1)];
            enemyX = randomTarget[0];
            enemyY = randomTarget[1];
        } else {  // Target mode is active
            const attackCoords = attackTarget(target[0], target[1]);
            if (attackCoords === null) {
                // If no valid coordinates found, reset target mode and search area, try random attack
                targetMode = false;
                searchArea = 2;  // Reset search area or adjust as needed
            }
            enemyX = attackCoords[0];
            enemyY = attackCoords[1];
        }
    
    processEnemyTurn(enemyX, enemyY);  // Processing the turn based on valid coordinates
}
function processEnemyTurn(enemyX, enemyY) {
    if (playerArray[enemyX][enemyY] !== ' ') {
        const hitLetter = playerArray[enemyX][enemyY];
        targetMode = true;
        target = [enemyX, enemyY];
        enemyHiddenArray[enemyX][enemyY] = 'X';
        playerArray[enemyX][enemyY] = 'R';
        if (didShipSink(playerArray, hitLetter)) {
            Ships.forEach(ship => {
                if (ship.letter === hitLetter) {
                    window.alert("They Sunk Your " + ship.name);
                    targetMode = false;
                    searchArea = 1;
                }
            });
            if (didPlayerWin(playerArray)) {
                endGame(1);
            }
        }
    } else {
        enemyHiddenArray[enemyX][enemyY] = 'O';
        playerArray[enemyX][enemyY] = 'O';
    }
    isplayerTurn = true;
    drawGame();
}
function endGame(num){
    if(num === 1){
        window.alert("You Win: Close Game")
    }
    else if(num === 112){
        window.alert("Game Exitied")
    }
    else{
        window.alert("You Lose: Close Game")
    }
    gameActive = false;
    drawGame();
    window.close();
}
function didPlayerWin(player){
    for (let i = 0; i < player.length; i++) {
        for (let j = 0; j < player[i].length; j++) {
            if (player[i][j] !== ' ' && player[i][j] !== 'R') {
                // If an item is found that is neither ' ' nor 'R', return false
                return false;
            }
        }
    }
    // If the loop completes without finding any non-' ' or 'R' items, return true
    return true;
}
function didShipSink(player, letter) {
    for (let i = 0; i < player.length; i++) {
        for (let j = 0; j < player[i].length; j++) {
            if (player[i][j] === letter) {
                return false;
            }
        }
    }
    return true; // Only returns true if no `letter` is found in the entire grid
}
function playerSetBoard(){
    playerArray = createEmptyArray(10, 10);
    playerArray = randomMapOutShips(playerArray);
    drawGame();
}
function randomMapOutShips(array){
    Ships.forEach(ship =>{
        complete = false;
        while(!complete){
            const x = getRandomInt(0,9);
            const y = getRandomInt(0,9);
            const length = ship.length;
            let count = 0;
            
            if(getRandomBool()){
                for (let i = 0; i < length; i++){
                    if(x+i < 10){
                        if(array[(x+i)][y] === ' '){
                            count += 1; 
                         }
                    }
                }
                if(count === length){
                    for (let i = 0; i < length; i++){
                    array[(x+i)][y] = ship.letter;
                    complete = true;
                    }
                }
            }
            else{
                for (let i = 0; i < length; i++){
                    if(x+i < 10){
                        if(array[(x)][y+i] === ' '){
                            count += 1; 
                         }
                    }
                }
                if(count === length){
                    for (let i = 0; i < length; i++){
                    array[(x)][y+i] = ship.letter;
                    complete = true;
                    }
                }
            }
        }
    });
    return array;

    function isVertical(){
        return Math.random() < 0.5;
    }
}
function createEmptyArray(row, col){
    let finalArray = [];
    for(let i = 0; i < col; i++){
        let rowArray = [];
        for(let j = 0; j < row; j++){
            rowArray.push(" ");
        }
        finalArray.push(rowArray);
    }
    return(finalArray);
}
function getRandomInt(small, large){
    min = Math.ceil(small);
    max = Math.floor(large);
    return Math.floor(Math.random() * (max-min + 1)) + min;
}
function getRandomBool(){
    return Math.random() < 0.5;
}
function attackTarget(x, y) {
    let listOfCoords = [];
    let horizontalHits = false;
    let verticalHits = false;

    // Determine if there are hits directly horizontal or vertical to the target
    if ((x > 0 && enemyHiddenArray[x - 1][y] === 'R') || (x < 9 && enemyHiddenArray[x + 1][y] === 'R')) {
        horizontalHits = true;
    }
    if ((y > 0 && enemyHiddenArray[x][y - 1] === 'R') || (y < 9 && enemyHiddenArray[x][y + 1] === 'R')) {
        verticalHits = true;
    }

    // Add coordinates based on detected hits
    for (let i = 1; i < searchArea; i++) {
        if (horizontalHits) {
            // Add only horizontal coordinates if horizontal hits are detected
            if (x - i >= 0 && enemyHiddenArray[x - i][y] === ' ') {
                listOfCoords.push([x - i, y]);
            }
            if (x + i <= 9 && enemyHiddenArray[x + i][y] === ' ') {
                listOfCoords.push([x + i, y]);
            }
        }
        if (verticalHits) {
            // Add only vertical coordinates if vertical hits are detected
            if (y - i >= 0 && enemyHiddenArray[x][y - i] === ' ') {
                listOfCoords.push([x, y - i]);
            }
            if (y + i <= 9 && enemyHiddenArray[x][y + i] === ' ') {
                listOfCoords.push([x, y + i]);
            }
        }

        // If no adjacent hits detected, consider all directions
        if (!horizontalHits && !verticalHits) {
            if (x - i >= 0 && enemyHiddenArray[x - i][y] === ' ') {
                listOfCoords.push([x - i, y]);
            }
            if (x + i <= 9 && enemyHiddenArray[x + i][y] === ' ') {
                listOfCoords.push([x + i, y]);
            }
            if (y - i >= 0 && enemyHiddenArray[x][y - i] === ' ') {
                listOfCoords.push([x, y - i]);
            }
            if (y + i <= 9 && enemyHiddenArray[x][y + i] === ' ') {
                listOfCoords.push([x, y + i]);
            }
        }
    }

    // Randomly select a valid coordinate from the list or adjust search area
    if (listOfCoords.length > 0) {
        const coords = listOfCoords[getRandomInt(0, listOfCoords.length - 1)];
        return coords;
    } else {
        searchArea++; // Consider resetting searchArea when it becomes too large
        return null;
    }
}