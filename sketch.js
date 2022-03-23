const ROWS = 20;
const COLS = ROWS;
let LENGTH;
const board = new Array(ROWS);
let MINE_COUNT = 60;
let gameOver = false;
let infoDiv;
let flagMode = false;
let flag;
let gameStatus;
let mineIndex = new Set();
let flagIndex = new Set();
let slider;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function setup() {
    createCanvas(
        min(window.innerHeight * 0.9, 900),
        min(window.innerHeight * 0.9, 900)
    );
    LENGTH = min(window.innerHeight * 0.9, 900) / ROWS
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
        mineIndex.add(i.toString() + "-" + j.toString());
        board[i][j].isMine = true;
    }
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            board[i][j].countNeighbours();
        }
    }
    let i = floor(random(0, ROWS));
    let j = floor(random(0, COLS));
    while (board[i][j].isMine || board[i][j].neighbourCount !== 0) {
        i = floor(random(0, ROWS));
        j = floor(random(0, COLS));
    }
    board[i][j].reveal();
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
    mineIndex.clear();
    for (let index = 0; index < MINE_COUNT; index++) {
        let i = floor(random(0, ROWS));
        let j = floor(random(0, COLS));
        while (board[i][j].isMine) {
            i = floor(random(0, ROWS));
            j = floor(random(0, COLS));
        }
        mineIndex.add(i.toString() + "-" + j.toString());
        board[i][j].isMine = true;
    }
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            board[i][j].countNeighbours();
        }
    }
    let i = floor(random(0, ROWS));
    let j = floor(random(0, COLS));
    while (board[i][j].isMine || board[i][j].neighbourCount !== 0) {
        i = floor(random(0, ROWS));
        j = floor(random(0, COLS));
    }
    board[i][j].reveal();
};

function toggleFlag() {
    flagMode = !flagMode;
    flag.elt.classList.toggle("flagged");
}

const checkIsGameOver = () => {
    flagIndex.clear();
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (board[i][j].flagged) {
                flagIndex.add(i.toString() + "-" + j.toString());
            }
        }
    }
    if (flagIndex.size === MINE_COUNT) {
        let intersect = new Set([...mineIndex].filter((i) => flagIndex.has(i)));
        if (intersect.size === MINE_COUNT) {
            gameOverScreen("You Win!");
            return;
        }
    }
};

function keyPressed() {
    if (keyCode === 70) {
        toggleFlag();
    }
}

function gameOverScreen(stat) {
    gameStatus.elt.setAttribute("id", "gameStatus");
    gameStatus.elt.classList.remove("hide");
    gameStatus.elt.innerText = stat;
    let gameOverButton = document.createElement("button");
    gameOverButton.setAttribute("id", "gameOverButton");
    gameOverButton.innerText = "Restart";
    gameStatus.elt.appendChild(gameOverButton);
    gameOverButton.onclick = (e) => {
        gameOver = false;
        gameStatus.elt.classList.add("hide");
        restart();
    };
    gameOver = true;
}

function mousePressed() {
    if (gameOver) return;
    let i = floor(map(mouseY, 0, height, 0, ROWS));
    let j = floor(map(mouseX, 0, width, 0, COLS));
    if (i < 0 || i >= ROWS || j < 0 || j >= COLS) return;
    if (board[i][j].isRevealed) return;
    if (flagMode) {
        board[i][j].flag();
    } else {
        let response = true;
        if (board[i][j].flagged) {
            response = confirm(
                "You flagged this tile, are you sure you want to reveal it?"
            );
        }
        if (!response) return;
        board[i][j].flagged = false;
        board[i][j].reveal();
    }
    checkIsGameOver();
}

function draw() {
    background(255);
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            board[i][j].show();
        }
    }
}