
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const homeScreen = document.getElementById("homeScreen");
const gameScreen = document.getElementById("gameScreen");
const gameOverScreen = document.getElementById("gameOverScreen");

const playBtn = document.getElementById("playBtn");
const restartBtn = document.getElementById("restartBtn");
const homeBtn = document.getElementById("homeBtn");
const scoreLabel = document.getElementById("score");
const finalScore = document.getElementById("finalScore");
const gameMessage = document.getElementById("gameMessage");

const W = canvas.width;
const H = canvas.height;
const GROUND = 370;

// Game state
let running = false;
let animationId = null;
let score = 0;
let frame = 0;
let obstacles = [];
let nextObstacle = 90;

let frog;
let snake;

// --------------------------------------------------
// START AND RESET
// --------------------------------------------------

function startGame() {
    if (animationId !== null) {
        cancelAnimationFrame(animationId);
    }

    score = 0;
    frame = 0;
    obstacles = [];
    nextObstacle = 90;

    frog = {
        x: 210,
        y: GROUND - 48,
        width: 48,
        height: 48,
        velocityY: 0,
        gravity: 0.75,
        jumpForce: -15,
        jumping: false
    };

    snake = {
        x: 55,
        y: GROUND - 43,
        width: 65,
        height: 43,
        speed: 0.32
    };

    running = true;

    homeScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    scoreLabel.textContent = "Score: 0";

    draw();
    animationId = requestAnimationFrame(loop);
}

// --------------------------------------------------
// FROG JUMP
// --------------------------------------------------

function jump() {
    if (!running || frog.jumping) return;

    frog.velocityY = frog.jumpForce;
    frog.jumping = true;
}

document.addEventListener("keydown", function (event) {
    if (
        event.code === "Space" ||
        event.code === "ArrowUp" ||
        event.key.toLowerCase() === "w"
    ) {
        if (running) {
            event.preventDefault();
            jump();
        }
    }
});

canvas.addEventListener("pointerdown", function (event) {
    if (!running) return;

    event.preventDefault();
    jump();
});

// --------------------------------------------------
// LOTUS OBSTACLES
// --------------------------------------------------

function spawnLotus() {
    obstacles.push({
        x: W + 20,
        y: GROUND - 43,
        width: 45,
        height: 43,
        counted: false
    });
}

// --------------------------------------------------
// COLLISION DETECTION
// --------------------------------------------------

function overlaps(a, b) {
    return (
        a.x + 8 < b.x + b.width - 7 &&
        a.x + a.width - 8 > b.x + 7 &&
        a.y + 6 < b.y + b.height &&
        a.y + a.height - 5 > b.y + 8
    );
}

// --------------------------------------------------
// UPDATE GAME
// --------------------------------------------------

function update() {
    frame++;

    // Apply gravity to the frog
    frog.y += frog.velocityY;
    frog.velocityY += frog.gravity;

    // Land back on the pond
    const floorY = GROUND - frog.height;

    if (frog.y >= floorY) {
        frog.y = floorY;
        frog.velocityY = 0;
        frog.jumping = false;
    }

    // Spawn lotus obstacles
    nextObstacle--;

    if (nextObstacle <= 0) {
        spawnLotus();

        // Gradually make the game more challenging
        nextObstacle = Math.max(
            65,
            105 - Math.floor(score / 30)
        );
    }

    // Move obstacles towards the frog
    const obstacleSpeed = Math.min(6, 3.5 + score / 100);

    for (const lotus of obstacles) {
        lotus.x -= obstacleSpeed;

        if (!lotus.counted && lotus.x + lotus.width < frog.x) {
            lotus.counted = true;
            score += 10;

            // Successfully dodging a lotus gives the frog
            // a little more distance from the snake.
            snake.x = Math.max(35, snake.x - 18);
        }

        if (overlaps(frog, lotus)) {
            endGame("A lotus got in your way!");
            return;
        }
    }

    // Remove obstacles that have left the screen
    obstacles = obstacles.filter(
        lotus => lotus.x + lotus.width > -10
    );

    // The snake slowly chases the frog
    snake.x += snake.speed + score / 2500;

    // The snake catches the frog
    if (snake.x + snake.width - 8 >= frog.x + 5) {
        endGame("The snake caught you!");
        return;
    }

    scoreLabel.textContent = "Score: " + score;
}

// --------------------------------------------------
// DRAW THE POND
// --------------------------------------------------

function drawBackground() {
    // Sky
    const sky = ctx.createLinearGradient(0, 0, 0, GROUND);
    sky.addColorStop(0, "#baf0d6");
    sky.addColorStop(1, "#66c9b1");

    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Distant bushes
    ctx.fillStyle = "#7cc99a";

    for (let i = 0; i < 8; i++) {
        const x = i * 135 - 20;

        ctx.beginPath();
        ctx.arc(x, 185 + (i % 2) * 15, 65, Math.PI, 0);
        ctx.fill();
    }

    // Pond water
    const water = ctx.createLinearGradient(0, GROUND, 0, H);
    water.addColorStop(0, "#55c7c1");
    water.addColorStop(1, "#258eaa");

    ctx.fillStyle = water;
    ctx.fillRect(0, GROUND, W, H - GROUND);

    // Water ripples
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 2;

    for (let i = 0; i < 9; i++) {
        const x = (i * 117 + frame * 0.6) % W;
        const y = GROUND + 35 + (i % 3) * 32;

        ctx.beginPath();
        ctx.ellipse(x, y, 24, 5, 0, 0, Math.PI * 2);
        ctx.stroke();
    }

    // Pond edge
    ctx.fillStyle = "#398e5c";
    ctx.fillRect(0, GROUND - 8, W, 12);

    ctx.fillStyle = "#a4df7b";
    ctx.fillRect(0, GROUND - 8, W, 5);

    // Decorative lily pads
    for (let i = 0; i < 6; i++) {
        const x = (i * 165 + 40) % W;
        const y = GROUND + 25 + (i % 2) * 65;

        ctx.fillStyle = "#278e68";
        ctx.beginPath();
        ctx.ellipse(x, y, 24, 10, 0, 0.3, Math.PI * 1.8);
        ctx.lineTo(x, y);
        ctx.fill();
    }

    // Sun
    ctx.fillStyle = "#fff0a0";
    ctx.beginPath();
    ctx.arc(815, 65, 34, 0, Math.PI * 2);
    ctx.fill();
}

// --------------------------------------------------
// DRAW CHARACTERS AND OBSTACLES
// --------------------------------------------------

function drawFrog() {
    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.beginPath();
    ctx.ellipse(
        frog.x + 24,
        GROUND - 3,
        frog.jumping ? 18 : 27,
        6,
        0,
        0,
        Math.PI * 2
    );
    ctx.fill();

    // Frog emoji
    ctx.font = "46px Arial";
    ctx.textBaseline = "top";
    ctx.fillText("🐸", frog.x, frog.y);
}

function drawSnake() {
    // Draw a curved green body
    ctx.strokeStyle = "#24783e";
    ctx.lineWidth = 24;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(snake.x + 8, snake.y + 34);
    ctx.quadraticCurveTo(
        snake.x + 28,
        snake.y + 5,
        snake.x + 48,
        snake.y + 30
    );
    ctx.stroke();

    // Snake head
    ctx.font = "38px Arial";
    ctx.textBaseline = "top";
    ctx.fillText("🐍", snake.x + 23, snake.y - 3);
}

function drawLotus(lotus) {
    // Shadow on water
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.beginPath();
    ctx.ellipse(
        lotus.x + 23,
        GROUND - 2,
        25,
        6,
        0,
        0,
        Math.PI * 2
    );
    ctx.fill();

    // Lotus flower
    ctx.font = "40px Arial";
    ctx.textBaseline = "top";
    ctx.fillText("🪷", lotus.x, lotus.y);
}

// --------------------------------------------------
// DRAW ENTIRE FRAME
// --------------------------------------------------

function draw() {
    drawBackground();

    for (const lotus of obstacles) {
        drawLotus(lotus);
    }

    drawSnake();
    drawFrog();

    // Score inside the game
    ctx.fillStyle = "#124d3b";
    ctx.font = "bold 23px Arial";
    ctx.textBaseline = "top";
    ctx.fillText("Score: " + score, 22, 20);

    // Controls hint
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "16px Arial";
    ctx.fillText("JUMP!", 22, 52);
}

// --------------------------------------------------
// GAME LOOP
// --------------------------------------------------

function loop() {
    if (!running) return;

    update();

    if (!running) return;

    draw();

    animationId = requestAnimationFrame(loop);
}

// --------------------------------------------------
// GAME OVER
// --------------------------------------------------

function endGame(message) {
    running = false;

    if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    finalScore.textContent = "Your score: " + score;
    gameMessage.textContent = message;

    gameScreen.classList.add("hidden");
    gameOverScreen.classList.remove("hidden");
}

// --------------------------------------------------
// BUTTONS
// --------------------------------------------------

playBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);

homeBtn.addEventListener("click", function () {
    running = false;

    if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    gameOverScreen.classList.add("hidden");
    gameScreen.classList.add("hidden");
    homeScreen.classList.remove("hidden");
});
