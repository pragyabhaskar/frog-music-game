// 1. SETUP
let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

let homeScreen = document.getElementById("homeScreen");
let playBtn = document.getElementById("playBtn");

playBtn.addEventListener("click", () => {
    homeScreen.style.display = "none";   // hide home
    canvas.style.display = "block";     // show game

    gameLoop(); // start game
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("Game Started!", 250, 200);

    requestAnimationFrame(gameLoop);
}



 
        
    