const playerCanvas = document.getElementById('player-canvas');
const ctxPlayer = playerCanvas.getContext('2d');
const targetCanvas = document.getElementById('player-canvas');
const ctxTarget = targetCanvas.getContext('2d');

function Ship(name, letter, length){
    this.name = name;
    this.letter = letter;
    this.length = length;
}

const Battleship = new Ship('Battleship', 'B', 4);
const AircraftCarrier = new Ship('Aircraft Carrier', 'A', 5);
const Cruiser = new Ship('Cruiser', 'C', 3);
const Submarine = new Ship('Submarine', 'S', 3);
const Destoryer = new Ship('Destroyer', 'D', 4);

const Ships = [Battleship, AircraftCarrier, Cruiser, Submarine, Destoryer];

let playerArray = createEmptyArray(10, 10);
let enemyArray = createEmptyArray(10, 10);
enemyArray = randomMapOutShips(enemyArray);
console.table(enemyArray);




function randomMapOutShips(array){
    Ships.forEach(ship =>{
        complete = false;
        while(!complete){
            const x = getRandomInt();
            const y = getRandomInt();
            const length = ship.length;
            let shipFits = false;
            if(array[x][y] === ' '){
                array[x][y] = ship.letter;   
                complete = true;
            }
        }
    });
    return array;
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