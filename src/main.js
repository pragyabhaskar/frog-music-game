/**
 * FROG-SNAKE-LOTUS GAME - Main Entry Point
 * Game initialization and main loop
 */

// ============================================
// 1. CANVAS & DOM SETUP
// ============================================

let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

let homeScreen = document.getElementById("homeScreen");
let playBtn = document.getElementById("playBtn");
let gameOverScreen = document.getElementById("gameOverScreen") || createGameOverScreen();

// ============================================
// 2. GAME STATE
// ============================================

let gameState = {
    running: false,
    score: 0,
    frog: null,
    snake: null,
    lotus: null,
    lastSpawnTime: 0,
    spawnInterval: 60,
    difficulty: 1,
};

let inputHandler = null;
let scoreManager = new ScoreManager();
let collisionDetector = new CollisionDetector();

// ============================================
// 3. HELPER FUNCTIONS
// ============================================

function createGameOverScreen() {
    const screen = document.createElement("div");
    screen.id = "gameOverScreen";
    screen.innerHTML = `
        <h2>Game Over!</h2>
        <p>Score: <span id="finalScore">0</span></p>
        <p>High Score: <span id="highScore">0</span></p>
        <p>Successful Dodges: <span id="dodgeCount">0</span></p>
        <button id="restartBtn">🔄 Play Again</button>
    `;
    document.body.appendChild(screen);
    
    document.getElementById("restartBtn").addEventListener("click", () => {
        gameOverScreen.style.display = "none";
        initGame();
    });
    
    return screen;
}

// ============================================
// 4. GAME INITIALIZATION
// ============================================

function initGame() {
    gameState.running = true;
    scoreManager.reset();
    gameState.score = 0;
    gameState.lastSpawnTime = 0;
    gameState.difficulty = 1;
    
    // Frog on right side, middle height
    gameState.frog = new Frog(canvas.width - 100, canvas.height - 60);
    
    // Snake on left side, middle height
    gameState.snake = new Snake(30, canvas.height - 55);
    
    // No lotus initially
    gameState.lotus = null;
    
    gameLoop();
}

// ============================================
// 5. GAME LOGIC
// ============================================

function spawnLotus() {
    // Spawn lotus from left side, random height
    const spawnY = Math.random() * (canvas.height - 80) + 40;
    const speed = 2 + gameState.difficulty * 0.5; // Speed increases with difficulty
    gameState.lotus = new Lotus(-30, spawnY, speed);
}

function updateDifficulty() {
    // Increase difficulty every 50 points
    gameState.difficulty = 1 + Math.floor(gameState.score / 50);
    
    // Cap spawn interval at minimum
    gameState.spawnInterval = Math.max(40, 60 - gameState.score / 20);
}

function update() {
    if (!gameState.running) return;

    // Update frog
    if (inputHandler.getJumpInput()) {
        gameState.frog.jump();
    }
    gameState.frog.update();

    // Spawn lotus if needed
    gameState.lastSpawnTime++;
    if (!gameState.lotus && gameState.lastSpawnTime > gameState.spawnInterval) {
        spawnLotus();
        gameState.lastSpawnTime = 0;
    }

    // Update lotus
    if (gameState.lotus) {
        gameState.lotus.update();

        // Check collision: Frog + Lotus (GAME OVER)
        if (collisionDetector.frogTouchesLotus(gameState.frog, gameState.lotus)) {
            endGame();
            return;
        }

        // Check collision: Snake + Lotus (SUCCESS)
        if (collisionDetector.snakeCatchesLotus(gameState.snake, gameState.lotus)) {
            scoreManager.lotusSuccessfullyDodged();
            gameState.score = scoreManager.score;
            gameState.lotus = null;
            gameState.lastSpawnTime = 0;
            updateDifficulty();
        }

        // Lotus left screen
        if (collisionDetector.isOffScreen(gameState.lotus, canvas.width)) {
            scoreManager.lotusOffScreen();
            gameState.score = scoreManager.score;
            gameState.lotus = null;
            gameState.lastSpawnTime = 0;
            updateDifficulty();
        }
    }
}

function endGame() {
    gameState.running = false;
    
    const stats = scoreManager.getStats();
    document.getElementById("finalScore").textContent = stats.currentScore;
    document.getElementById("highScore").textContent = stats.highScore;
    document.getElementById("dodgeCount").textContent = stats.dodges;
    
    gameOverScreen.style.display = "block";
}

// ============================================
// 6. RENDERING
// ============================================

function draw() {
    // Clear canvas with gradient effect
    ctx.fillStyle = "#E8F4F8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw entities
    gameState.frog.draw(ctx);
    gameState.snake.draw(ctx);
    
    if (gameState.lotus) {
        gameState.lotus.draw(ctx);
    }

    // Draw score
    ctx.fillStyle = "#000";
    ctx.font = "bold 20px Arial";
    ctx.fillText(`Score: ${gameState.score}`, 20, 30);
    ctx.fillText(`High: ${scoreManager.highScore}`, 20, 55);
    ctx.fillText(`Difficulty: ${gameState.difficulty.toFixed(1)}x`, canvas.width - 200, 30);

    // Draw instructions
    ctx.font = "14px Arial";
    ctx.fillStyle = "#666";
    ctx.fillText("Press SPACE / UP / W or CLICK to jump", 20, canvas.height - 10);
}

// ============================================
// 7. GAME LOOP
// ============================================

function gameLoop() {
    update();
    draw();
    
    if (gameState.running) {
        requestAnimationFrame(gameLoop);
    }
}

// ============================================
// 8. UI EVENT LISTENERS
// ============================================

playBtn.addEventListener("click", () => {
    homeScreen.style.display = "none";
    canvas.style.display = "block";
    gameOverScreen.style.display = "none";
    inputHandler = new InputHandler(canvas);
    initGame();
});

// Initialize input handler (ready for play)
window.addEventListener("load", () => {
    console.log("🎮 Frog Music Game loaded and ready to play!");
});