const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const restartBtn = document.getElementById("restartBtn");

const box = 20; 
let score = 0;
let gameRunning = true;

const NORMAL_SPEED = 150;
const SLOW_SPEED = 220;
const FAST_SPEED = 80;
let gameSpeed = NORMAL_SPEED;
let powerUpEffectTimer = 0;
let despawnTimer = 0;

let vine = [];
vine[0] = { x: 9 * box, y: 10 * box };

let spore = { x: Math.floor(Math.random() * 19 + 1) * box, y: Math.floor(Math.random() * 19 + 1) * box };
let bush = { x: Math.floor(Math.random() * 19 + 1) * box, y: Math.floor(Math.random() * 19 + 1) * box };

let powerUp = { x: -box, y: -box, type: null };
let extraChili = { x: -box, y: -box, type: null };

let d; 

document.addEventListener("keydown", direction);

function direction(event) {
    let key = event.keyCode;
    if (key == 37 && d != "RIGHT") d = "LEFT";
    else if (key == 38 && d != "DOWN") d = "UP";
    else if (key == 39 && d != "LEFT") d = "RIGHT";
    else if (key == 40 && d != "UP") d = "DOWN";
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) return true;
    }
    return false;
}

function spawnPowerUp() {
    if (powerUp.type !== null) return;

    let rand = Math.random();
    if (rand < 0.1) { powerUp.type = 'super'; } 
    else if (rand < 0.25) { powerUp.type = Math.random() > 0.5 ? 'slow' : 'fast'; } 
    else { return; }

    powerUp.x = Math.floor(Math.random() * 19 + 1) * box;
    powerUp.y = Math.floor(Math.random() * 19 + 1) * box;

    clearTimeout(despawnTimer);
    despawnTimer = setTimeout(() => {
        powerUp.type = null;
        powerUp.x = -box;
        extraChili.type = null;
        extraChili.x = -box;
    }, 10000); 
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < vine.length; i++) {
        const isHead = i === 0;
        const isTail = i === vine.length - 1;
        ctx.fillStyle = isHead ? "#2ecc71" : "#1b4d3e";
        
        if (isTail && vine.length > 1) {
            ctx.beginPath();
            ctx.moveTo(vine[i].x + box/2, vine[i].y);
            ctx.quadraticCurveTo(vine[i].x + box, vine[i].y + box/2, vine[i].x + box/2, vine[i].y + box);
            ctx.quadraticCurveTo(vine[i].x, vine[i].y + box/2, vine[i].x + box/2, vine[i].y);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(vine[i].x + box/2, vine[i].y + box/2, box/1.8, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    ctx.font = `${box}px Inter`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    ctx.fillText("🥗", spore.x + box/2, spore.y + box/2);
    ctx.fillText("🪵", bush.x + box/2, bush.y + box/2);

    if (powerUp.type === 'slow') ctx.fillText("🫐", powerUp.x + box/2, powerUp.y + box/2);
    if (powerUp.type === 'fast') ctx.fillText("🌶️", powerUp.x + box/2, powerUp.y + box/2);
    if (powerUp.type === 'super') ctx.fillText("🍄", powerUp.x + box/2, powerUp.y + box/2);
    if (extraChili.type === 'fast') ctx.fillText("🌶️", extraChili.x + box/2, extraChili.y + box/2);

    let vineX = vine[0].x;
    let vineY = vine[0].y;

    if (d == "LEFT") vineX -= box;
    if (d == "UP") vineY -= box;
    if (d == "RIGHT") vineX += box;
    if (d == "DOWN") vineY += box;

    if (vineX == spore.x && vineY == spore.y) {
        score++;
        scoreElement.innerHTML = score;
        spore = { x: Math.floor(Math.random() * 19 + 1) * box, y: Math.floor(Math.random() * 19 + 1) * box };
        bush = { x: Math.floor(Math.random() * 19 + 1) * box, y: Math.floor(Math.random() * 19 + 1) * box };
        spawnPowerUp();
    } 
    else if (vineX == powerUp.x && vineY == powerUp.y) {
        if (powerUp.type === 'super') {
            score += 5;
            scoreElement.innerHTML = score;
            powerUp.type = 'fast'; 
            powerUp.x = (vineX + box < canvas.width) ? vineX + box : vineX - box;
            extraChili.type = 'fast';
            extraChili.x = (vineX - box > 0) ? vineX - box : vineX + box;
            extraChili.y = vineY;
        } else {
            gameSpeed = (powerUp.type === 'slow') ? SLOW_SPEED : FAST_SPEED;
            powerUp.type = null;
            powerUp.x = -box;
            clearTimeout(powerUpEffectTimer);
            powerUpEffectTimer = setTimeout(() => { gameSpeed = NORMAL_SPEED; }, 20000); 
        }
    }
    else if (vineX == extraChili.x && vineY == extraChili.y) {
        gameSpeed = FAST_SPEED;
        extraChili.type = null;
        extraChili.x = -box;
        clearTimeout(powerUpEffectTimer);
        powerUpEffectTimer = setTimeout(() => { gameSpeed = NORMAL_SPEED; }, 20000); 
    }
    else {
        vine.pop(); 
    }

    let newHead = { x: vineX, y: vineY };

    if (vineX < 0 || vineX >= canvas.width || 
        vineY < 0 || vineY >= canvas.height || 
        collision(newHead, vine) || 
        (vineX == bush.x && vineY == bush.y)) {
        gameRunning = false;
        gameOver();
        return; 
    }

    vine.unshift(newHead);

    if (gameRunning) {
        setTimeout(draw, gameSpeed);
    }
}

function gameOver() {
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#2ecc71";
    ctx.font = "bold 30px Inter";
    ctx.textAlign = "center";
    ctx.fillText("VINE WITHERED", canvas.width / 2, canvas.height / 2);
    restartBtn.style.display = "block";
}

function resetGame() { location.reload(); }

draw();