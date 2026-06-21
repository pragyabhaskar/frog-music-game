// ======================================
// FROG MUSIC GAME
// ======================================

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

const homeScreen =
document.getElementById("homeScreen");

const playBtn =
document.getElementById("playBtn");

const GROUND_Y =
canvas.height - 80;

// =========================
// UTIL
// =========================

function hit(a, b) {
return (
a.x < b.x + b.width &&
a.x + a.width > b.x &&
a.y < b.y + b.height &&
a.y + a.height > b.y
);
}

// =========================
// FROG
// =========================

class Frog {

constructor() {

this.width = 50;
this.height = 50;

this.x =
canvas.width - 260;

this.y =
GROUND_Y - this.height;

this.ground =
this.y;

this.vy = 0;

this.gravity = 1.2;

this.jumpForce = -18;

this.jumping = false;

}

jump() {

if (this.jumping)
return;

this.vy =
this.jumpForce;

this.jumping =
true;

}

update() {

this.y += this.vy;

if (this.jumping) {

this.vy +=
this.gravity;

}

if (
this.y >=
this.ground
) {

this.y =
this.ground;

this.vy =
0;

this.jumping =
false;

}

}

draw() {

ctx.strokeStyle =
"white";

ctx.lineWidth = 2;

// larger touch area
ctx.strokeRect(
this.x - 10,
this.y - 30,
this.width + 20,
this.height + 40
);

ctx.font =
"42px Arial";

ctx.textBaseline =
"top";

ctx.fillText(
"🐸",
this.x,
this.y
);

}

bounds() {

return {

x:
this.x,

y:
this.y,

width:
this.width,

height:
this.height

};

}

touchBox() {

return {

x:
this.x - 20,

y:
this.y - 40,

width:
this.width + 40,

height:
this.height + 60

};

}

}

// =========================
// SNAKE
// =========================

class Snake {

constructor() {

this.width = 55;

this.height = 50;

this.x =
canvas.width - 120;

this.y =
GROUND_Y - this.height;

}

draw() {

ctx.strokeStyle =
"white";

ctx.strokeRect(
this.x,
this.y,
this.width,
this.height
);

ctx.font =
"42px Arial";

ctx.textBaseline =
"top";

ctx.fillText(
"🐍",
this.x,
this.y
);

}

bounds() {

return {

x:this.x,
y:this.y,
width:this.width,
height:this.height

};

}

}

// =========================
// LOTUS
// =========================

class Lotus {

constructor() {

this.width = 40;

this.height = 40;

this.x =
-50;

this.y =
GROUND_Y -
this.height;

this.speed =
5;

}

update() {

this.x +=
this.speed;

}

draw() {

ctx.strokeStyle =
"white";

ctx.strokeRect(
this.x,
this.y,
this.width,
this.height
);

ctx.font =
"36px Arial";

ctx.textBaseline =
"top";

ctx.fillText(
"🪷",
this.x,
this.y
);

}

bounds() {

return {

x:this.x,
y:this.y,
width:this.width,
height:this.height

};

}

}

// =========================
// STATE
// =========================

const state = {

running:false,

score:0,

spawn:0,

spawnRate:90,

frog:null,

snake:null,

lotus:null

};

// =========================
// INPUT
// =========================

function jump() {

if (
state.running
) {

state.frog.jump();

}

}

document.addEventListener(
"keydown",
e=>{

if(
e.code==="Space"||
e.key==="ArrowUp"||
e.key==="w"
){

e.preventDefault();

jump();

}

}
);

canvas.addEventListener(
"click",
e=>{

const r =
canvas.getBoundingClientRect();

const x =
e.clientX-r.left;

const y =
e.clientY-r.top;

if(
hit(
{
x,
y,
width:1,
height:1
},
state.frog.touchBox()
)
){

jump();

}

}
);

canvas.addEventListener(
"touchstart",
e=>{

e.preventDefault();

jump();

},
{
passive:false
}
);

// =========================
// GAME
// =========================

function spawnLotus(){

state.lotus =
new Lotus();

}

function update(){

state.frog.update();

state.spawn++;

if(
!state.lotus &&
state.spawn >
state.spawnRate
){

spawnLotus();

state.spawn=0;

}

if(
state.lotus
){

state.lotus.update();

if(
hit(
state.frog.bounds(),
state.lotus.bounds()
)
){

state.running =
false;

setTimeout(
()=>{

alert(
`Game Over\nScore ${state.score}`
);

homeScreen.style.display =
"flex";

canvas.style.display =
"none";

},
50
);

}

if(
state.lotus &&
hit(
state.snake.bounds(),
state.lotus.bounds()
)
){

state.score += 10;

state.lotus =
null;

}

if(
state.lotus &&
state.lotus.x >
canvas.width
){

state.score += 5;

state.lotus =
null;

}

}

}

function draw(){

ctx.fillStyle =
"#E8F4F8";

ctx.fillRect(
0,
0,
canvas.width,
canvas.height
);

ctx.fillStyle =
"#666";

ctx.fillRect(
0,
GROUND_Y,
canvas.width,
3
);

state.frog.draw();

state.snake.draw();

if(
state.lotus
){

state.lotus.draw();

}

ctx.fillStyle =
"black";

ctx.font =
"bold 24px Arial";

ctx.fillText(
`Score: ${state.score}`,
20,
30
);

ctx.fillText(
"Difficulty: 1.0x",
canvas.width-220,
30
);

ctx.font =
"16px Arial";

ctx.fillText(
"Tap frog / Space to jump",
20,
canvas.height-20
);

}

function loop(){

if(
!state.running
)
return;

update();

draw();

requestAnimationFrame(
loop
);

}

function start(){

state.running =
true;

state.score =
0;

state.spawn =
0;

state.frog =
new Frog();

state.snake =
new Snake();

state.lotus =
null;

loop();

}

playBtn.addEventListener(
"click",
()=>{

homeScreen.style.display =
"none";

canvas.style.display =
"block";

start();

}
);
