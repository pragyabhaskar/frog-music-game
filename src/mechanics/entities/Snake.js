/**
 * Snake Entity
 * Handles snake behavior: stationary position, catching lotus
 */

class Snake {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 25;
    }

    draw(ctx) {
        ctx.fillStyle = "#FF6B6B";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "#000";
        ctx.font = "20px Arial";
        ctx.fillText("🐍", this.x + 12, this.y + 18);
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