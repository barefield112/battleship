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
let gameActive = false;

console.log("Ready to play? Keep clicking 'Set Board' till you like your set up and press 'Start' to begin");

function beginGame(){
    gameActive = true;
    console.table(hiddenArray);
    console.table(playerArray);
    while(gameActive === true){
        const input = window.prompt("Coordinates(ex: x,y) - ");
        const inputY = input.charAt(0);
        const inputX = input.charAt(2);
        if(enemyArray[inputX][inputY]!= ' '){
            window.alert("Hit at " + inputY + ", " + inputX);
            hiddenArray[inputX][inputY] = 'H';
            enemyArray[inputX][inputY] = 'R';
        }
        else{
            window.alert("Miss at " + inputY + ", " + inputX);
            hiddenArray[inputX][inputY] = 'M';
        }
        console.table(hiddenArray);
        console.table(playerArray);
        window.alert("ENEMY TURN... Ready?");
        let enemyX = 0;
        let enemyY = 0;
        let isValid = false;
        while(isValid === false){
            enemyX = getRandomInt();
            enemyY = getRandomInt();

            if(enemyHiddenArray[enemyX][enemyY] === ' '){
                isValid = true;
            }
        }
        if(playerArray[enemyX][enemyY]!= ' '){
            window.alert("Hit at " + enemyX + ", " + enemyY);
            enemyHiddenArray[enemyX][enemyY] = 'H';
            playerArray[enemyX][enemyY] = 'R';
        }
        else{
            window.alert("Miss at " + enemyX + ", " + enemyY);
            enemyHiddenArray[enemyX][enemyY] = 'M';
        }


    }
}

function checkForWin(player){
    player.forEach(array =>{
        array.forEach(item =>{
            
        })
    })
}
function playerSetBoard(){
    playerArray = createEmptyArray(10, 10);
    playerArray = randomMapOutShips(playerArray);
    console.table(playerArray);
}
function randomMapOutShips(array){
    Ships.forEach(ship =>{
        complete = false;
        while(!complete){
            const x = getRandomInt();
            const y = getRandomInt();
            const length = ship.length;
            let count = 0;
            
            if(getRandomBool()){
                for (let i = 0; i < length; i++){
                    if(x+i < 9){
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
                    if(x+i < 9){
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
function getRandomInt(){
    min = Math.ceil(0);
    max = Math.floor(9);
    return Math.floor(Math.random() * (max-min + 1)) + min;
}
function getRandomBool(){
    return Math.random() < 0.5;
}