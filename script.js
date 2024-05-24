const playerCanvas = document.getElementById('player-screen');
const hiddenCanvas = document.getElementById('hidden-screen');
const setBoardButton = document.getElementById('setBoard');
const startButton = document.getElementById('startGame');
const endButton = document.getElementById('endGame');
const outputTurn = document.getElementById('output-turn');
const outputText = document.getElementById('output-text');
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
let searchArea = 1;
let gameActive = false;
let isplayerTurn = false;

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
        outputTurn.textContent = "Waiting for Player...";
        outputTurn.style.color = "yellow";
    }
    else{
        hiddenCanvas.classList.remove('highlight');
        if(gameActive == true ){
            outputTurn.textContent = "Waiting for Enemy...";
            outputTurn.style.color = "gray";
        }
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
            outputText.style.color = "red";
            outputText.textContent = `Player: Hit at ${inputX}, ${inputY}`;
            if(didShipSink(enemyArray, hitLetter)){
                Ships.forEach(ship =>{
                    if(ship.letter === hitLetter){
                        outputText.textContent = "You Sunk Their " + ship.name;
                        //window.alert("You Sunk Their " + ship.name);
                    }
                })
                if(didPlayerWin(enemyArray)){
                    endGame(1);
                }
            }
            
        }
        else{
            outputText.style.color = "white";
            outputText.textContent = `Player: Miss at ${inputX}, ${inputY}`;
            hiddenArray[inputY][inputX] = 'O';
        }
        isplayerTurn = false;
        drawGame();
}
function enemyTurn(){
    let enemyX = 0;
    let enemyY = 0;
    let coordsFound = false;
    const attackList = [];
    while(!coordsFound){
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
            coordsFound = true;
        } else {  // Target mode is active
            const attackCoords = oppenentTargetAI(target[0], target[1]);
            if (attackCoords === null) {
                // If no valid coordinates found, reset target mode and search area, try random attack
                coordsFound = false;
                continue;
            }
            else{
                coordsFound = true;
            }

            if(coordsFound === true){
                enemyX = attackCoords[0];
                enemyY = attackCoords[1];
            }
        }
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
        outputText.style.color = "red";
        outputText.textContent = `Enemy: Hit at ${enemyY}, ${enemyX}`;
        if (didShipSink(playerArray, hitLetter)) {
            Ships.forEach(ship => {
                if (ship.letter === hitLetter) {
                    outputText.textContent = "They Sunk Your " + ship.name;
                    targetMode = false;
                    searchArea = 1;
                }
            });
            if (didPlayerWin(playerArray)) {
                endGame(1);
            }
        }
    } else {
        outputText.style.color = "white";
        outputText.textContent = `Enemy: Miss at ${enemyY}, ${enemyX}`;
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
/*
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
*/
function oppenentTargetAI(x, y){
    let emptySpaces = [];
    let hitSpaces = [];
    let notLeft = 0;
    let notRight = 9;
    let notUp = 0;
    let notDown = 9;
//Look and log each item touching it, if empty spaces log each one, if R log coords.
for(let i = 1; i<= searchArea; i++){
    if(x - i >= 0){
        if(enemyHiddenArray[x- i][y] === ' '){
            emptySpaces.push([x-i,y]);
        }
        else if(enemyHiddenArray[x -searchArea][y] === 'X'){
            hitSpaces.push([x-i,y]);
        }
        else if(enemyHiddenArray[x - 1][y] === 'O'){
            notLeft = x;
        }
    }
    if(x + i <= 9){
        if(enemyHiddenArray[x + i][y] === ' '){
            emptySpaces.push([x+i,y]);
        }
        else if(enemyHiddenArray[x +i][y] === 'X'){
            hitSpaces.push([x+i,y]);
        }
        else if(enemyHiddenArray[x + 1][y] === 'O'){
            notRight = x;
        }
    }
    if(y -i >= 0){
        if(enemyHiddenArray[x][y -i ] === ' '){
            emptySpaces.push([x,y - i]);
        }
        else if(enemyHiddenArray[x][y -i] === 'X'){
            hitSpaces.push([x,y -i]);
        }
        else if(enemyHiddenArray[x][y - 1] === 'O'){
            notUp = y;
        }
    }
    if(y + i <= 9){
        if(enemyHiddenArray[x][y+i] === ' '){
            emptySpaces.push([x,y+i]);
        }
        else if(enemyHiddenArray[x][y+i] === 'X'){
            hitSpaces.push([x,y+i]);
        }
        else if(enemyHiddenArray[x][y + i] === 'O'){
            notDown = y;
        }
    }
}
    console.log(`Found ${emptySpaces.length} empty and ${hitSpaces.length} hits next to ${x}, ${y}`);

    if(emptySpaces.length === 0){
        searchArea = searchArea + 1;
        return null;
    }
    //if no R coors, random generate from list of spaces
    if(hitSpaces.length === 0){
        const randomCoords = emptySpaces[getRandomInt(0, emptySpaces.length-1)];
        searchArea = 1;
        return randomCoords; 
    }
    else{ //Use R coords to narrow search along an axis
        //copares the x and y coord of the first hitSpaces element with the list of the empty spaces, 
        console.log("There is another X");
        const hitX = hitSpaces[0][0];
        const hitY = hitSpaces[0][1];
        let filteredSpaces = [];
        emptySpaces.forEach(space =>{
            if(space[0] === hitX){
                if(notLeft <= space[0]){
                    console.log(`Not Left adding ${space}`);
                    filteredSpaces.push(space);
                }
                if(notRight >= space[0]){
                    console.log(`Not Right adding ${space}`);
                    filteredSpaces.push(space);
                }
            }
            else if(space[1] === hitY){
                if(notUp <= space[1]){
                    console.log(`Not Up adding ${space}`);
                    filteredSpaces.push(space);
                }
                if(notDown >= space[1]){
                    console.log(`Not down adding ${space}`);
                    filteredSpaces.push(space);
                }
            }
        });
        if(filteredSpaces.length === 0){
            searchArea = searchArea + 1;
            return null;
        }
        else{
            console.log(filteredSpaces);
            searchArea = 1;
            return filteredSpaces[0];
        }
    }
    //if element has no empty spaces on it (must be surrounded with at least 1 R and all O's) expand seach on axis
    //return next attack coords
}