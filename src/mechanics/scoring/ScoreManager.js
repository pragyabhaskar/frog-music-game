/**
 * Score Manager
 * Handles scoring and game state tracking
 */

class ScoreManager {
    constructor() {
        this.score = 0;
        this.highScore = localStorage.getItem("frogGameHighScore") || 0;
        this.dodgesSuccessful = 0;
    }

    addScore(points) {
        this.score += points;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem("frogGameHighScore", this.highScore);
        }
    }

    lotusSuccessfullyDodged() {
        this.addScore(10);
        this.dodgesSuccessful++;
    }

    lotusOffScreen() {
        this.addScore(5);
    }

    reset() {
        this.score = 0;
        this.dodgesSuccessful = 0;
    }

    getStats() {
        return {
            currentScore: this.score,
            highScore: this.highScore,
            dodges: this.dodgesSuccessful
        };
    }
}