let player, enemies = [];
let score = 0, highScore = 0, gameOver = false;

// Load high score from localStorage
if (localStorage.getItem("highScore")) {
    highScore = parseInt(localStorage.getItem("highScore"));
}

function setup() {
    createCanvas(800, 600);
    player = new Player();
    for (let i = 0; i < 3; i++) {
        enemies.push(new Enemy());
    }
}

function draw() {
    background(0);
    
    drawScore();

    if (gameOver) {
        drawGameOver();
    } else {
        player.update();
        player.show();

        for (let enemy of enemies) {
            enemy.update();
            enemy.show();
            if (enemy.hits(player)) {
                gameOver = true;
                if (score > highScore) {
                    highScore = score;
                    localStorage.setItem("highScore", highScore); // Save high score
                }
            }
        }
    }
}

function mousePressed() {
    if (gameOver) {
        resetGame();
    } else {
        player.flipDirection();
    }
}

// === PLAYER CLASS ===
class Player {
    constructor() {
        this.x = 300;
        this.y = 500;
        this.size = 50;
        this.speed = 10;
        this.direction = -1;
    }

    update() {
        this.x += this.speed * this.direction;
        this.x = constrain(this.x, 0, width - this.size);
    }

    flipDirection() {
        this.direction *= -1;
    }

    show() {
        fill(0, 0, 255);
        rect(this.x, this.y, this.size, this.size);
    }
}

// === ENEMY CLASS ===
class Enemy {
    constructor() {
        this.x = random(width - 50);
        this.y = random(-500, -50);
        this.size = 50;
        this.speed = 15;
    }

    update() {
        this.y += this.speed;
        if (this.y > height) {
            this.y = -50;
            this.x = random(width - this.size);
            score++;
        }
    }

    hits(player) {
        return (player.x < this.x + this.size &&
                player.x + player.size > this.x &&
                player.y < this.y + this.size &&
                player.y + player.size > this.y);
    }

    show() {
        fill(255, 0, 0);
        rect(this.x, this.y, this.size, this.size);
    }
}

// === SCORE & GAME OVER ===
function drawScore() {
    fill(255);
    textSize(96);
    textAlign(CENTER, CENTER);
    text(score, width / 2, 240); // Score in center

    textSize(24);
    textAlign(LEFT, TOP);
    text(`High Score: ${highScore}`, 10, 10); // High score at top-left
}

function drawGameOver() {
    fill(255, 0, 0);
    textSize(48);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width / 2, height / 2);
    textSize(24);
    text("Click to Restart", width / 2, height / 2 + 50);
}

function resetGame() {
    score = 0;
    gameOver = false;
    player = new Player();
    enemies = [];
    for (let i = 0; i < 3; i++) {
        enemies.push(new Enemy());
    }
}
