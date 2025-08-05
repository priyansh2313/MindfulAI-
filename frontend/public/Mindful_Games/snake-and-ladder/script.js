const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const diceElement = document.getElementById('dice');
const rollBtn = document.getElementById('roll-btn');
const playerTurnDisplay = document.getElementById('player-turn');
const assistantBox = document.getElementById('assistant-message');
const assistantText = document.getElementById('assistant-text');
const winModal = document.getElementById('win-modal');
const winMessage = document.getElementById('win-message');
const playAgainBtn = document.getElementById('play-again-btn');

const BOARD_SIZE = 10;
let tileSize;
let playerPosition = 1;
let aiPosition = 1;
let isPlayerTurn = true;

const snakes = { 17: 7, 54: 34, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 99: 78 };
const ladders = { 4: 14, 9: 31, 20: 38, 28: 84, 40: 59, 51: 67, 63: 81, 71: 91 };
const playerColor = '#e84118';
const aiColor = '#fbc531';

const diceTransforms = {
    1: 'rotateX(0deg) rotateY(0deg)',
    2: 'rotateX(0deg) rotateY(180deg)',
    3: 'rotateX(0deg) rotateY(-90deg)',
    4: 'rotateX(0deg) rotateY(90deg)',
    5: 'rotateX(90deg) rotateY(0deg)',
    6: 'rotateX(-90deg) rotateY(0deg)'
};

function getCoords(square) {
    const row = Math.floor((square - 1) / BOARD_SIZE);
    let col = (square - 1) % BOARD_SIZE;
    if (row % 2 !== 0) {
        col = BOARD_SIZE - 1 - col;
    }
    const x = col * tileSize + tileSize / 2;
    const y = (BOARD_SIZE - 1 - row) * tileSize + tileSize / 2;
    return { x, y };
}

function drawBoard() {
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const square = (BOARD_SIZE - 1 - row) * BOARD_SIZE + (row % 2 === 0 ? col + 1 : BOARD_SIZE - col);
            ctx.fillStyle = (row + col) % 2 === 0 ? '#e0e7ff' : '#c7d2fe';
            ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
            ctx.font = `bold ${tileSize / 4}px 'Nunito', sans-serif`;
            ctx.fillStyle = '#4338ca';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(square, col * tileSize + tileSize / 2, row * tileSize + tileSize / 2);
        }
    }
}

function drawSnakesAndLadders() {
    Object.entries(snakes).forEach(([start, end]) => drawCurve(start, end, '#ef4444'));
    Object.entries(ladders).forEach(([start, end]) => drawLine(start, end, '#22c55e'));
}

function drawLine(start, end, color) {
    const startCoords = getCoords(start);
    const endCoords = getCoords(end);
    ctx.beginPath();
    ctx.moveTo(startCoords.x, startCoords.y);
    ctx.lineTo(endCoords.x, endCoords.y);
    ctx.lineWidth = tileSize / 10;
    ctx.strokeStyle = color;
    ctx.stroke();
}

function drawCurve(start, end, color) {
    const startCoords = getCoords(start);
    const endCoords = getCoords(end);
    ctx.beginPath();
    ctx.moveTo(startCoords.x, startCoords.y);
    const cp1x = startCoords.x + (endCoords.x - startCoords.x) / 2 + tileSize;
    const cp1y = startCoords.y - (startCoords.y - endCoords.y) / 4;
    const cp2x = startCoords.x + (endCoords.x - startCoords.x) / 2 - tileSize;
    const cp2y = startCoords.y - 3 * (startCoords.y - endCoords.y) / 4;
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endCoords.x, endCoords.y);
    ctx.lineWidth = tileSize / 10;
    ctx.strokeStyle = color;
    ctx.stroke();
}

function drawPlayer(position, color, offset = 0) {
    const { x, y } = getCoords(position);
    ctx.beginPath();
    ctx.arc(x + offset, y + offset, tileSize / 3.5, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function fullRedraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawSnakesAndLadders();
    drawPlayer(aiPosition, aiColor, tileSize / 10);
    drawPlayer(playerPosition, playerColor, -tileSize / 10);
}

function showAssistantMessage(message, type = 'info') {
    assistantText.textContent = message;
    assistantBox.className = 'assistant-box';
    assistantBox.classList.add(type);
    assistantBox.classList.add('show');
    setTimeout(() => assistantBox.classList.remove('show'), 4000);
}

async function handleTurn(isPlayer) {
    const roll = Math.floor(Math.random() * 6) + 1;
    
    diceElement.classList.add('rolling');
    await new Promise(resolve => setTimeout(resolve, 1000));
    diceElement.classList.remove('rolling');
    diceElement.style.transform = diceTransforms[roll];

    const playerName = isPlayer ? "You" : "AI";
    showAssistantMessage(`${playerName} rolled a ${roll}!`);
    
    let currentPosition = isPlayer ? playerPosition : aiPosition;
    currentPosition = await movePlayer(currentPosition, roll, isPlayer);

    if (isPlayer) playerPosition = currentPosition;
    else aiPosition = currentPosition;
    
    const specialSquare = snakes[currentPosition] || ladders[currentPosition];
    if (specialSquare) {
        const type = snakes[currentPosition] ? 'snake' : 'ladder';
        showAssistantMessage(`${playerName} landed on a ${type}!`, type === 'snake' ? 'failure' : 'success');
        await new Promise(resolve => setTimeout(resolve, 1000));
        currentPosition = specialSquare;
        if (isPlayer) playerPosition = currentPosition;
        else aiPosition = currentPosition;
        fullRedraw();
    }
    
    if (currentPosition === 100) {
        winMessage.textContent = `${playerName} Won!`;
        winModal.classList.remove('hidden');
        showAssistantMessage(`Congratulations! ${playerName} won!`, 'success');
    } else {
        isPlayerTurn = !isPlayerTurn;
        updateTurnDisplay();
        if (!isPlayerTurn) {
            setTimeout(handleAITurn, 1500);
        }
    }
}

function handleAITurn() {
    rollBtn.disabled = true;
    handleTurn(false);
}

function handlePlayerTurn() {
    rollBtn.disabled = true;
    handleTurn(true);
}

function movePlayer(startPos, steps, isPlayer) {
    return new Promise(resolve => {
        let currentPos = startPos;
        let stepsMoved = 0;
        const interval = setInterval(() => {
            if (stepsMoved >= steps || currentPos >= 100) {
                clearInterval(interval);
                resolve(currentPos);
                return;
            }
            currentPos++;
            stepsMoved++;
            if(isPlayer) playerPosition = currentPos;
            else aiPosition = currentPos;
            fullRedraw();
        }, 200);
    });
}

function updateTurnDisplay() {
    if (isPlayerTurn) {
        playerTurnDisplay.textContent = "Your Turn";
        playerTurnDisplay.classList.remove('ai-turn');
        rollBtn.disabled = false;
    } else {
        playerTurnDisplay.textContent = "AI's Turn";
        playerTurnDisplay.classList.add('ai-turn');
        rollBtn.disabled = true;
    }
}

function resetGame() {
    playerPosition = 1;
    aiPosition = 1;
    isPlayerTurn = true;
    winModal.classList.add('hidden');
    updateTurnDisplay();
    fullRedraw();
    showAssistantMessage("Welcome! You are Red, AI is Yellow. Roll the dice to start.");
}

function setup() {
    const container = canvas.parentElement;
    const size = Math.min(container.clientWidth, container.clientHeight);
    canvas.width = size;
    canvas.height = size;
    tileSize = canvas.width / BOARD_SIZE;
    resetGame();
}

window.addEventListener('load', setup);
window.addEventListener('resize', setup);
rollBtn.addEventListener('click', handlePlayerTurn);
playAgainBtn.addEventListener('click', resetGame);
