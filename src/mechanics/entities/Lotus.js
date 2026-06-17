/**
 * Lotus Entity
 * Handles lotus behavior: spawning, movement, collision detection
 */

class Lotus {
    constructor(x, y, speed = 2) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.speed = speed; // pixels per frame
    }

    update() {
        this.x += this.speed;
    }

    draw(ctx) {
        ctx.fillStyle = "#FFD93D";
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#000";
        ctx.font = "20px Arial";
        ctx.fillText("🪷", this.x + 3, this.y + 22);
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