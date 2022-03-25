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
let msAI = new AI()

function setup() {

  boardLength =
    min(window.innerHeight * 0.9, 900)

  if (window.innerWidth < 500) {
    boardLength = window.innerWidth * 0.95
  }

  createCanvas(
    boardLength, boardLength
  );
  LENGTH = boardLength / ROWS;
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
  msAI.add_knowledge([i, j], board[i][j].neighbourCount)
  flag = document.createElement('button')
  flag.innerText = "Flag"
  wrapperDiv = document.createElement('div')
  infoDiv = createDiv()
  infoDiv = infoDiv.elt

  msAIBtn = document.createElement('button')
  msAIBtn.innerText = 'AI Move'
  wrapperDiv.appendChild(msAIBtn)
  wrapperDiv.appendChild(flag)
  flag.onclick = toggleFlag;
  infoDiv.classList.add('infoDiv')
  infoDiv.appendChild(wrapperDiv)
  wrapperDiv.classList.add('wrapperDiv')
  msAIBtn.onclick = msAIMove;
  desc1 = document.createElement('p')
  desc1.innerText = 'Click on a square to reveal it. If you click on a mine, you lose. The number on the square represents the number of mines surrounding it. You can press "F" to toggle flag mode'
  desc2 = document.createElement('p')

  desc2.innerText = `You can press on the AI button to have the AI make a move for you. The AI will automatically flag all the mines. You can press "A" to use the AI too.`
  const credit = document.createElement('p')
  credit.innerHTML = 'Source code: <a target="_blank" href="https://github.com/elliott-chong/minesweeper-ai">Elliott Chong</a>'
  // document.body.appendChild(credit)
  credit.classList.add('credit')


  infoDiv.appendChild(desc1)
  infoDiv.appendChild(desc2)
  infoDiv.appendChild(credit)
  gameStatus = createDiv();
}

const msAIMove = async () => {
  if (gameOver) return
  let move = msAI.make_safe_move()
  if (move) {
    let [y, x] = move
    console.log('msAI making safe move')
    board[y][x].reveal();
  }
  else {
    console.log('msAI making random move')
    move = msAI.make_random_move()
    if (!move) {
      console.log("No moves left to make")
      return
    }
    let [y, x] = move
    board[y][x].reveal();
  }
  for (let mines of msAI.mines) {
    let [y, x] = mines
    board[y][x].flag()
    await sleep(3)
  }
  checkIsGameOver()
  // let [y, x] = move
  // msAI.add_knowledge(move, board[y][x].neighbourCount)
};

const restart = () => {
  msAI = new AI()
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
  msAI.add_knowledge([i, j], board[i][j].neighbourCount)
};

function toggleFlag() {
  flagMode = !flagMode;
  flag.classList.toggle("flagged");
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
  if (keyCode === 65) {
    msAIMove()
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
    msAI.add_knowledge([i, j], board[i][j].neighbourCount)
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
