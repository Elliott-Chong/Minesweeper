const ROWS = 20;
const COLS = ROWS;
const LENGTH = 45;
const board = new Array(ROWS);
const MINE_COUNT = 60;
let gameOver = false;
let flagMode = false;
let flag;
let gameStatus;
let mineIndex = [];

function setup() {
    createCanvas(ROWS * LENGTH + 2, COLS * LENGTH + 2);
    for (let i = 0; i < ROWS; i++) {
        let column = new Array(COLS);
        for (let j = 0; j < COLS; j++) {
            column[j] = new Grid(i, j);
        }
        board[i] = column;
    }
    for (let index = 0; index < MINE_COUNT; index++) {
        let i = floor(random(0, ROWS));
        let j = floor(random(0, COLS));
        while (board[i][j].isMine) {
            i = floor(random(0, ROWS));
            j = floor(random(0, COLS));
        }
        mineIndex.push([i, j]);
        board[i][j].isMine = true;
    }
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            board[i][j].countNeighbours();
        }
    }
    flag = createButton("Flag");
    flag.mouseClicked(toggleFlag);
    gameStatus = createDiv();
}

const restart = () => {
    for (let i = 0; i < ROWS; i++) {
        let column = new Array(COLS);
        for (let j = 0; j < COLS; j++) {
            column[j] = new Grid(i, j);
        }
        board[i] = column;
    }
    for (let index = 0; index < MINE_COUNT; index++) {
        let i = floor(random(0, ROWS));
        let j = floor(random(0, COLS));
        while (board[i][j].isMine) {
            i = floor(random(0, ROWS));
            j = floor(random(0, COLS));
        }
        board[i][j].isMine = true;
    }
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            board[i][j].countNeighbours();
        }
    }
};

function toggleFlag() {
    flagMode = !flagMode;
    flag.elt.classList.toggle("flagged");
}

const checkIsGameOver = () => {
    flagIndex = [];
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {}
    }
};

function mousePressed() {
    let i = floor(map(mouseY, 0, height, 0, ROWS));
    let j = floor(map(mouseX, 0, width, 0, COLS));
    if (i < 0 || i >= ROWS || j < 0 || j >= COLS) return;
    if (board[i][j].isRevealed) return;
    if (flagMode) {
        board[i][j].flag();
    } else {
        board[i][j].reveal();
    }
}

function draw() {
    background(255);
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            board[i][j].show();
        }
    }
}