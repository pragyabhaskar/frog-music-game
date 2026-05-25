// 1. SETUP
let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;


// 2. CLASSES

class Player {
    constructor() {
        this.x = 100;
        this.y = 300;
        this.velocity = 0;
    }

    jump() {
        this.velocity = -10;
    }

    update() {
        this.velocity += 0.5;
        this.y += this.velocity;

        if (this.y > 300) {
            this.y = 300;
            this.velocity = 0;
        }
    }

    draw() {
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y, 30, 30);
    }
}

class Snake {
    constructor() {
        this.x = 800;
        this.y = 300;
        this.speed = 5;
    }

    update() {
        this.x -= this.speed;

        if (this.x < -30) {
            this.x = 800;
        }
    }

    draw() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, 30, 30);
    }
}


// 3. GAME VARIABLES

let player = new Player();
let snake = new Snake();

let score = 0;
let gameOver = false;


// 4. INPUT

document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        player.jump();
    }
});


// 5. FUNCTIONS

function checkCollision() {
    if (
        snake.x < player.x + 30 &&
        snake.x + 30 > player.x &&
        player.y < snake.y + 30 &&
        player.y + 30 > snake.y
    ) {
        gameOver = true;
    }
}


// 6. GAME LOOP

function gameLoop() {
    if (gameOver) {
        alert("Game Over");
        return;
    }

    score++;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.update();
    snake.update();

    checkCollision();

    player.draw();
    snake.draw();

    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);

    requestAnimationFrame(gameLoop);
}


// 7. START GAME
gameLoop();
