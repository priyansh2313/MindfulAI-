const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const movesDisplay = document.getElementById('moves');
const gameOverModal = document.getElementById('game-over-modal');
const finalScoreDisplay = document.getElementById('final-score');
const playAgainBtn = document.getElementById('play-again-btn');

const ROWS = 8;
const COLS = 8;
const SWEET_TYPES = 5;
// NEW VIBRANT COLORS
const SWEET_COLORS = ['#fbc531', '#e84118', '#4cd137', '#00a8ff', '#9c88ff'];
const SWEET_SHAPES = ['circle', 'square', 'triangle', 'diamond', 'star'];

let board = [];
let score = 0;
let movesLeft = 30;
let tileSize;
let selectedSweet = null;
let isAnimating = false;
let animationFrame;

function createSweet(row, col, type = -1) {
    return {
        row,
        col,
        type: type === -1 ? Math.floor(Math.random() * SWEET_TYPES) : type,
        x: col * tileSize,
        y: row * tileSize,
        scale: 1,
        alpha: 1
    };
}

function initBoard() {
    board = [];
    for (let r = 0; r < ROWS; r++) {
        board[r] = [];
        for (let c = 0; c < COLS; c++) {
            board[r][c] = createSweet(r, c);
        }
    }
    
    let matches;
    do {
        matches = findMatches();
        if (matches.length > 0) {
            matches.forEach(sweet => {
                board[sweet.row][sweet.col] = createSweet(sweet.row, sweet.col);
            });
        }
    } while (matches.length > 0);
}

function drawSweet(sweet) {
    if (!sweet || sweet.alpha === 0) return;
    ctx.save();
    ctx.globalAlpha = sweet.alpha;
    const centerX = sweet.x + tileSize / 2;
    const centerY = sweet.y + tileSize / 2;
    const radius = (tileSize / 2.8) * sweet.scale;

    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetY = 3;

    const grad = ctx.createRadialGradient(centerX - radius/2, centerY - radius/2, 0, centerX, centerY, radius * 1.5);
    grad.addColorStop(0, 'rgba(255,255,255,0.7)');
    grad.addColorStop(1, SWEET_COLORS[sweet.type]);
    ctx.fillStyle = grad;

    ctx.beginPath();
    switch (SWEET_SHAPES[sweet.type]) {
        case 'circle':
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            break;
        case 'square':
            ctx.rect(centerX - radius, centerY - radius, radius * 2, radius * 2);
            break;
        case 'triangle':
            ctx.moveTo(centerX, centerY - radius);
            ctx.lineTo(centerX + radius, centerY + radius);
            ctx.lineTo(centerX - radius, centerY + radius);
            ctx.closePath();
            break;
        case 'diamond':
            ctx.moveTo(centerX, centerY - radius);
            ctx.lineTo(centerX + radius, centerY);
            ctx.lineTo(centerX, centerY + radius);
            ctx.lineTo(centerX - radius, centerY);
            ctx.closePath();
            break;
        case 'star':
            ctx.moveTo(centerX, centerY - radius);
            for (let i = 1; i < 5; i++) {
                ctx.lineTo(centerX + radius * Math.cos((18 + i * 72) * Math.PI / 180), centerY - radius * Math.sin((18 + i * 72) * Math.PI / 180));
                ctx.lineTo(centerX + (radius/2) * Math.cos((54 + i * 72) * Math.PI / 180), centerY - (radius/2) * Math.sin((54 + i * 72) * Math.PI / 180));
            }
            ctx.closePath();
            break;
    }
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.restore();
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            drawSweet(board[r][c]);
        }
    }
    if (selectedSweet) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 4;
        ctx.strokeRect(selectedSweet.x, selectedSweet.y, tileSize, tileSize);
    }
}

function findMatches() {
    let matches = new Set();
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (!board[r][c]) continue;
            if (c > 1 && board[r][c].type === board[r][c - 1].type && board[r][c].type === board[r][c - 2].type) {
                matches.add(board[r][c]); matches.add(board[r][c-1]); matches.add(board[r][c-2]);
            }
            if (r > 1 && board[r][c].type === board[r - 1][c].type && board[r][c].type === board[r - 2][c].type) {
                matches.add(board[r][c]); matches.add(board[r-1][c]); matches.add(board[r-2][c]);
            }
        }
    }
    return Array.from(matches);
}

async function handleSwap(sweet1, sweet2) {
    if (isAnimating) return;
    isAnimating = true;
    movesLeft--;
    updateUI();

    await animateSwap(sweet1, sweet2);
    [board[sweet1.row][sweet1.col], board[sweet2.row][sweet2.col]] = [board[sweet2.row][sweet2.col], board[sweet1.row][sweet1.col]];
    [sweet1.row, sweet1.col, sweet2.row, sweet2.col] = [sweet2.row, sweet2.col, sweet1.row, sweet1.col];

    let matches = findMatches();
    if (matches.length > 0) {
        await processMatches(matches);
    } else {
        await animateSwap(sweet1, sweet2);
        [board[sweet1.row][sweet1.col], board[sweet2.row][sweet2.col]] = [board[sweet2.row][sweet2.col], board[sweet1.row][sweet1.col]];
        [sweet1.row, sweet1.col, sweet2.row, sweet2.col] = [sweet2.row, sweet2.col, sweet1.row, sweet1.col];
    }
    
    isAnimating = false;
    selectedSweet = null;
    checkGameOver();
}

async function processMatches(matches) {
    while (matches.length > 0) {
        score += matches.length * 10;
        updateUI();
        await animateRemoval(matches);
        
        matches.forEach(sweet => { board[sweet.row][sweet.col] = null; });
        
        await dropSweets();
        refillBoard();
        await animateRefill();
        
        matches = findMatches();
    }
}

async function dropSweets() {
    for (let c = 0; c < COLS; c++) {
        let emptyRow = ROWS - 1;
        for (let r = ROWS - 1; r >= 0; r--) {
            if (board[r][c]) {
                if (emptyRow !== r) {
                    board[emptyRow][c] = board[r][c];
                    board[emptyRow][c].row = emptyRow;
                    board[r][c] = null;
                }
                emptyRow--;
            }
        }
    }
}

function refillBoard() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (!board[r][c]) {
                board[r][c] = createSweet(r, c);
                board[r][c].y = -tileSize;
            }
        }
    }
}

function handleClick(event) {
    if (isAnimating) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const col = Math.floor(x / tileSize);
    const row = Math.floor(y / tileSize);

    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return;

    const clickedSweet = board[row][col];
    if (!selectedSweet) {
        selectedSweet = clickedSweet;
    } else {
        const dx = Math.abs(clickedSweet.col - selectedSweet.col);
        const dy = Math.abs(clickedSweet.row - selectedSweet.row);
        if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
            handleSwap(selectedSweet, clickedSweet);
        } else {
            selectedSweet = clickedSweet;
        }
    }
}

function updateUI() {
    scoreDisplay.textContent = score;
    movesDisplay.textContent = movesLeft;
}

function checkGameOver() {
    if (movesLeft <= 0) {
        gameOverModal.classList.remove('hidden');
        finalScoreDisplay.textContent = score;
        cancelAnimationFrame(animationFrame);
    }
}

function resetGame() {
    score = 0;
    movesLeft = 30;
    selectedSweet = null;
    isAnimating = false;
    updateUI();
    initBoard();
    gameOverModal.classList.add('hidden');
    if(animationFrame) cancelAnimationFrame(animationFrame);
    gameLoop();
}

function animate(duration, updateFn) {
    return new Promise(resolve => {
        const startTime = performance.now();
        const frame = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            updateFn(progress);
            if (progress < 1) requestAnimationFrame(frame);
            else resolve();
        };
        requestAnimationFrame(frame);
    });
}

function animateSwap(s1, s2) {
    return animate(200, p => {
        const s1TargetX = s2.col * tileSize;
        const s1TargetY = s2.row * tileSize;
        const s2TargetX = s1.col * tileSize;
        const s2TargetY = s1.row * tileSize;
        s1.x = s1.x + (s1TargetX - s1.x) * p;
        s1.y = s1.y + (s1TargetY - s1.y) * p;
        s2.x = s2.x + (s2TargetX - s2.x) * p;
        s2.y = s2.y + (s2TargetY - s2.y) * p;
    });
}

function animateRemoval(matches) {
    return animate(300, p => {
        matches.forEach(s => { s.scale = 1 - p; s.alpha = 1 - p; });
    });
}

function animateRefill() {
    return animate(300, p => {
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if(board[r][c]) {
                    const targetY = r * tileSize;
                    board[r][c].y += (targetY - board[r][c].y) * 0.2;
                }
            }
        }
    });
}

function gameLoop() {
    drawBoard();
    animationFrame = requestAnimationFrame(gameLoop);
}

function setup() {
    const container = canvas.parentElement;
    const size = Math.min(container.clientWidth, container.clientHeight);
    canvas.width = size;
    canvas.height = size;
    tileSize = canvas.width / COLS;
    resetGame();
}

window.addEventListener('load', setup);
window.addEventListener('resize', setup);
canvas.addEventListener('click', handleClick);
playAgainBtn.addEventListener('click', setup);
