/**
 * Collision Detection System
 * Handles all collision checks between entities
 */

class CollisionDetector {
    static checkAABB(rect1, rect2) {
        /**
         * Axis-Aligned Bounding Box collision
         * Returns true if two rectangles overlap
         */
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    }

    static frogTouchesLotus(frog, lotus) {
        return this.checkAABB(frog.getBounds(), lotus.getBounds());
    }

    static snakeCatchesLotus(snake, lotus) {
        return this.checkAABB(snake.getBounds(), lotus.getBounds());
    }

    static isOffScreen(entity, canvasWidth) {
        return entity.x > canvasWidth;
    }
}