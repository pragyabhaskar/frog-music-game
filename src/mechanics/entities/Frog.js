/**
 * Frog Entity
 * Handles frog behavior: jumping, position tracking
 */

class Frog {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 30;
        this.jumping = false;
        this.jumpVelocity = 0;
        this.gravity = 0.4;
        this.jumpPower = 10;
        this.groundLevel = y;
    }

    jump() {
        if (!this.jumping) {
            this.jumping = true;
            this.jumpVelocity = -this.jumpPower;
        }
    }

    update() {
        if (this.jumping) {
            this.jumpVelocity += this.gravity;
            this.y += this.jumpVelocity;

            // Land when reaching ground level
            if (this.y >= this.groundLevel) {
                this.y = this.groundLevel;
                this.jumping = false;
                this.jumpVelocity = 0;
            }
        }
    }

    draw(ctx) {
        ctx.fillStyle = "#00AA00";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "#000";
        ctx.font = "20px Arial";
        ctx.fillText("🐸", this.x + 8, this.y + 22);
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