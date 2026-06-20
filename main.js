// ============================================
// FROG-SNAKE-LOTUS GAME PROTOTYPE
// ============================================

// 1. SETUP
let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

let homeScreen = document.getElementById("homeScreen");
let playBtn = document.getElementById("playBtn");

// ============================================
// 2. ENTITY CLASSES
// ============================================

class Frog {
 constructor(x, y) {
    this.x = x; 
    this.width = 40;
    this.height = 30;

    this.groundLevel = canvas.height - this.height - 20;
    this.y = this.groundLevel;

    this.jumping = false;
    this.jumpVelocity = 0;
    this.gravity = 1.6;
    this.jumpPower = 12;
}

    jump() {
    if (!this.jumping) {
        this.jumping = true;

        // stronger upward launch
        this.jumpVelocity = -this.jumpPower;
    }
}
update() {
    if (!this.jumping) return;

    // Move
    this.y += this.jumpVelocity;

    // Gravity
    this.jumpVelocity += this.gravity;

    // Land
    if (this.y >= this.groundLevel) {
        this.y = this.groundLevel;
        this.jumpVelocity = 0;
        this.jumping = false;
    }
}
            
    draw(ctx) {

    // Debug hitbox
    ctx.strokeStyle = "#00AA00";
   ctx.lineWidth = 2;

ctx.strokeRect(
    this.x,
    this.y,
    this.width,
    this.height
);

    ctx.font = "40px Arial";
    ctx.textBaseline = "top";
    ctx.fillText(
        "🐸",
        this.x,
        this.y
    );
}

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

class Snake {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 25;
    }

    draw(ctx) {

    // Debug hitbox
    ctx.strokeStyle = "#FF6B6B";
    ctx.strokeRect(
        this.x,
        this.y,
        this.width,
        this.height
    );

    ctx.font = "30px Arial";
    ctx.fillText(
        "🐍",
        this.x,
        this.y + this.height
    );
}

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

class Lotus {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.speed = 2; // pixels per frame
    }

    update() {
        this.x += this.speed;
    }

   draw(ctx) {

    // Debug hitbox
    ctx.strokeStyle = "#FFD93D";
    ctx.strokeRect(
        this.x,
        this.y,
        this.width,
        this.height
    );

    ctx.font = "28px Arial";
    ctx.fillText(
        "🪷",
        this.x,
        this.y + this.height
    );
}

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

// ============================================
// 3. COLLISION DETECTION
// ============================================

function checkCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

// ============================================
// 4. GAME STATE & INITIALIZATION
// ============================================

let gameState = {
    running: false,
    paused: false,
    score: 0,
    frog: null,
    snake: null,
    lotus: null,
    lastSpawnTime: 0,
    spawnInterval: 60, // frames between spawns
};

let input = {
    jumpPressed: false,
};

// ============================================
// 5. INPUT HANDLING
// ============================================
function handleJump() {
    
    if (gameState.running) {
        gameState.frog.jump();
    }
}


// Keyboard
document.addEventListener("keydown", (e) => {
    if (
        e.code === "Space" ||
        e.key === "ArrowUp" ||
        e.key === "w"
    ) {
        e.preventDefault();
        handleJump();
    }
});

// Mouse
canvas.addEventListener("click", handleJump);

// Touch (MOST IMPORTANT)
canvas.addEventListener(
    "touchstart",
    (e) => {
        e.preventDefault();
        handleJump();
    },
    { passive: false }
);


// ============================================
// 6. GAME INITIALIZATION
// ============================================

function initGame() {
    gameState.running = true;
    gameState.score = 0;
    gameState.lastSpawnTime = 0;
    
    // Frog on right side, middle height
    gameState.frog = new Frog(canvas.width - 100, canvas.height - 60);
    
    // Snake on left side, middle height
    gameState.snake = new Snake(30, canvas.height - 55);
    
    // No lotus initially
    gameState.lotus = null;
    
    gameLoop();
}

// ============================================
// 7. GAME LOGIC
// ============================================

function spawnLotus() {

    // Random vertical position
    const spawnY =
        Math.random() *
        (canvas.height - 120) + 40;

    // Start from LEFT side
    gameState.lotus =
        new Lotus(
            -gameState.frog.width,
            spawnY
        );
}


function update() {
    if (!gameState.running) return;   
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

        // Check collision: Frog + Lotus
        if (checkCollision(gameState.frog.getBounds(), gameState.lotus.getBounds())) {
            // Game over
            gameState.running = false;
            alert(`Game Over! Final Score: ${gameState.score}`);
            homeScreen.style.display = "flex";
            canvas.style.display = "none";
            return;
        }

        // Check collision: Snake + Lotus (catch)
        if (checkCollision(gameState.snake.getBounds(), gameState.lotus.getBounds())) {
            gameState.lotus = null;
            gameState.score += 10; // Reward for successfully dodging
            gameState.lastSpawnTime = 0; // Reset spawn timer
        }
        
       // Lotus left screen (frog dodged, snake missed)
       if (gameState.lotus && gameState.lotus.x > canvas.width) {
           gameState.lotus = null;
           gameState.score += 5;
           gameState.lastSpawnTime = 0;
       }
    }
}

// ============================================
// 8. RENDERING
// ============================================

function draw() {
    // 1.Clear canvas
    ctx.fillStyle = "#E8F4F8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

//2.Ground
ctx.fillStyle = "#555";
ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

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

    // Draw instructions
    ctx.font = "14px Arial";
    ctx.fillStyle = "#666";
    ctx.fillText("Press SPACE / UP / W or CLICK to jump", 20, canvas.height - 10);
}

// ============================================
// 9. GAME LOOP
// ============================================

function gameLoop() {
    if (!gameState.running) return;

    update();
    draw();
    // Keep the loop running smoothly
    requestAnimationFrame(gameLoop);
}

// ============================================
// 10. UI EVENT LISTENERS
// ============================================

playBtn.addEventListener("click", () => {
    homeScreen.style.display = "none";
    canvas.style.display = "block";
    initGame();
});
