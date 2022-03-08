class Grid {
    constructor(i, j) {
        this.i = i;
        this.j = j;
        this.isRevealed = false;
        this.isMine = false;
        this.neighbourCount = 0;
        this.flagged = false;
    }

    show() {
        if (this.gameOver) return;
        strokeWeight(3);
        stroke(0);
        if (this.isRevealed) {
            fill(200);
            rect(this.j * LENGTH, this.i * LENGTH, LENGTH, LENGTH);
            if (this.isMine) {
                ellipseMode(CENTER);
                fill(255, 0, 0);
                ellipse(
                    this.j * LENGTH + LENGTH / 2 + 1,
                    this.i * LENGTH + LENGTH / 2 + 1,
                    (LENGTH * 3) / 5
                );
            } else if (this.neighbourCount !== 0) {
                textAlign(CENTER, CENTER);
                textSize(32);
                fill(0);
                text(
                    this.neighbourCount.toString(),
                    this.j * LENGTH,
                    this.i * LENGTH,
                    LENGTH,
                    LENGTH
                );
            }
        } else if (this.flagged) {
            fill(255);
            rect(this.j * LENGTH, this.i * LENGTH, LENGTH, LENGTH);
            fill(0, 255, 0);
            triangle(
                this.j * LENGTH + LENGTH / 4,
                this.i * LENGTH + LENGTH / 4,
                this.j * LENGTH + LENGTH / 4,
                this.i * LENGTH + LENGTH - LENGTH / 4,
                this.j * LENGTH + LENGTH - LENGTH / 4,
                this.i * LENGTH + LENGTH / 2
            );
        } else {
            fill(255);
            rect(this.j * LENGTH, this.i * LENGTH, LENGTH, LENGTH);
        }
    }
    reveal() {
        if (gameOver) return;
        if (this.isRevealed) return;
        this.isRevealed = true;
        if (this.isMine) {
            gameStatus.elt.setAttribute("id", "gameStatus");
            gameStatus.elt.classList.remove("hide");
            gameStatus.elt.innerText = "Game over";
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
            return;
        }
        if (this.neighbourCount === 0) {
            for (let dy = -1; dy < 2; dy++) {
                for (let dx = -1; dx < 2; dx++) {
                    let i = this.i + dy;
                    let j = this.j + dx;
                    if (i < 0 || i >= ROWS || j < 0 || j >= COLS) continue;
                    board[i][j].reveal();
                }
            }
        }
    }

    countNeighbours() {
        if (this.isMine) return;
        for (let dy = -1; dy < 2; dy++) {
            for (let dx = -1; dx < 2; dx++) {
                let i = this.i + dy;
                let j = this.j + dx;
                if (i < 0 || i >= ROWS || j < 0 || j >= COLS) continue;
                if (board[i][j].isMine) this.neighbourCount++;
            }
        }
    }

    flag() {
        this.flagged = true;
    }
}