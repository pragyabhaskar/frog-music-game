/**
 * Input Handler
 * Manages keyboard and mouse/touch input
 */

class InputHandler {
    constructor(canvas) {
        this.canvas = canvas;
        this.jumpPressed = false;
        this.restartRequested = false;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Keyboard input
        document.addEventListener("keydown", (e) => {
            if (e.key === " " || e.key === "ArrowUp" || e.key.toLowerCase() === "w") {
                e.preventDefault();
                this.jumpPressed = true;
            }
        });

        document.addEventListener("keyup", (e) => {
            if (e.key === " " || e.key === "ArrowUp" || e.key.toLowerCase() === "w") {
                this.jumpPressed = false;
            }
        });

        // Mouse/Touch input
        this.canvas.addEventListener("click", () => {
            this.jumpPressed = true;
            setTimeout(() => { this.jumpPressed = false; }, 50);
        });

        // Touch input for mobile
        this.canvas.addEventListener("touchstart", () => {
            this.jumpPressed = true;
        });

        this.canvas.addEventListener("touchend", () => {
            this.jumpPressed = false;
        });
    }

    getJumpInput() {
        if (this.jumpPressed) {
            this.jumpPressed = false;
            return true;
        }
        return false;
    }

    setRestartListener(callback) {
        document.addEventListener("keydown", (e) => {
            if (e.key === "r" || e.key === "R") {
                callback();
            }
        });
    }
}