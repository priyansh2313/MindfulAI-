const boardElement = document.getElementById('sudoku-board');
const paletteElement = document.getElementById('number-palette');
const difficultyButtons = document.querySelectorAll('.diff-btn');
const timerElement = document.getElementById('timer');
const bestTimeElement = document.getElementById('best-time');
const assistantBox = document.getElementById('assistant-message');
const assistantText = document.getElementById('assistant-text');
const winModal = document.getElementById('win-modal');
const finalTimeSpan = document.getElementById('final-time');
const playAgainBtn = document.getElementById('play-again-btn');

const puzzles = {
    easy: "53--7----6--195----98----6-8---6---3----8-3---17---2---6-6----28----419--5----8--79",
    medium: "-2-6-8---58---97--7---4----1-5-3---2--6----4-5-2---1-3---8----6--92---3-4-",
    hard: "4-----8-5-3----------7------2-6-7----5-9--4----1-8--2------5----4--8-3----"
};
const solutions = {
    easy: "534678912672195348198342567859761423426853791713924856961537284287419635345286179",
    medium: "123678945584239761769145328317562894692841573458397612231486257876953421945712386",
    hard: "417369825632158947958724316825437169791586432364912758289643571573291684146875293"
};

let currentDifficulty = 'easy';
let board = [];
let selectedCell = null;
let timer;
let seconds = 0;

function showAssistantMessage(message) {
    assistantText.textContent = message;
    assistantBox.classList.add('show');
    setTimeout(() => assistantBox.classList.remove('show'), 4000);
}

function formatTime(sec) {
    const minutes = Math.floor(sec / 60).toString().padStart(2, '0');
    const seconds = (sec % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
}

function startTimer() {
    clearInterval(timer);
    seconds = 0;
    timerElement.textContent = 'Time: 00:00';
    timer = setInterval(() => {
        seconds++;
        timerElement.textContent = `Time: ${formatTime(seconds)}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function loadBestTime() {
    const best = localStorage.getItem(`sudokuBestTime-${currentDifficulty}`) || 0;
    bestTimeElement.textContent = `Best: ${best > 0 ? formatTime(best) : '--:--'}`;
}

function saveBestTime() {
    const best = localStorage.getItem(`sudokuBestTime-${currentDifficulty}`) || 0;
    if (best === 0 || seconds < best) {
        localStorage.setItem(`sudokuBestTime-${currentDifficulty}`, seconds);
        loadBestTime();
        showAssistantMessage("A new best time! Fantastic work!");
    }
}

function generateBoard() {
    boardElement.innerHTML = '';
    const puzzleString = puzzles[currentDifficulty];
    board = puzzleString.split('').map((char, index) => {
        const value = char === '-' ? 0 : parseInt(char);
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = index;
        if (value !== 0) {
            cell.textContent = value;
            cell.classList.add('given');
        }
        cell.addEventListener('click', () => selectCell(cell));
        boardElement.appendChild(cell);
        return { value, given: value !== 0, element: cell };
    });
    startTimer();
    loadBestTime();
    showAssistantMessage(`A new ${currentDifficulty} puzzle has started. Good luck!`);
}

function selectCell(cell) {
    if (selectedCell) selectedCell.classList.remove('selected');
    selectedCell = cell;
    if (!board[cell.dataset.index].given) {
        selectedCell.classList.add('selected');
    } else {
        selectedCell = null;
    }
    highlightCells();
}

function highlightCells() {
    document.querySelectorAll('.cell').forEach(c => c.classList.remove('highlight'));
    if (!selectedCell) return;

    const index = parseInt(selectedCell.dataset.index);
    const row = Math.floor(index / 9);
    const col = index % 9;
    const boxRowStart = Math.floor(row / 3) * 3;
    const boxColStart = Math.floor(col / 3) * 3;

    for (let i = 0; i < 9; i++) {
        board[row * 9 + i].element.classList.add('highlight');
        board[i * 9 + col].element.classList.add('highlight');
    }
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            board[(boxRowStart + r) * 9 + (boxColStart + c)].element.classList.add('highlight');
        }
    }
}

function createPalette() {
    paletteElement.innerHTML = '';
    for (let i = 1; i <= 9; i++) {
        const btn = document.createElement('button');
        btn.classList.add('palette-btn');
        btn.textContent = i;
        btn.addEventListener('click', () => placeNumber(i));
        paletteElement.appendChild(btn);
    }
    const eraseBtn = document.createElement('button');
    eraseBtn.classList.add('palette-btn');
    eraseBtn.textContent = 'X';
    eraseBtn.addEventListener('click', () => placeNumber(0));
    paletteElement.appendChild(eraseBtn);
}

function placeNumber(num) {
    if (!selectedCell) {
        showAssistantMessage("Please select a cell first.");
        return;
    }
    const index = parseInt(selectedCell.dataset.index);
    if (board[index].given) return;

    board[index].value = num;
    selectedCell.textContent = num === 0 ? '' : num;
    selectedCell.classList.toggle('user-input', num !== 0);
    
    checkSolution();
}

function checkSolution() {
    let isComplete = true;
    let isCorrect = true;
    const solutionString = solutions[currentDifficulty];

    board.forEach((cell, index) => {
        cell.element.classList.remove('error');
        if (cell.value === 0) {
            isComplete = false;
        } else if (cell.value !== parseInt(solutionString[index])) {
            isCorrect = false;
            if (!cell.given) cell.element.classList.add('error');
        }
    });

    if (isComplete && isCorrect) {
        winGame();
    }
    return isCorrect;
}

function winGame() {
    stopTimer();
    saveBestTime();
    finalTimeSpan.textContent = formatTime(seconds);
    winModal.classList.remove('hidden');
}

difficultyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        difficultyButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentDifficulty = btn.dataset.difficulty;
        generateBoard();
    });
});

playAgainBtn.addEventListener('click', () => {
    winModal.classList.add('hidden');
    generateBoard();
});

createPalette();
generateBoard();
