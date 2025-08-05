const statusBar = document.getElementById('status-bar');
const highScoreDisplay = document.getElementById('high-score-display');
const gamePads = document.querySelectorAll('.pad');
const startBtn = document.getElementById('start-btn');
const assistantBox = document.getElementById('assistant-message');
const assistantText = document.getElementById('assistant-text');

let sequence = [];
let playerSequence = [];
let level = 0;
let highScore = 0;
let isPlayerTurn = false;
let gameInProgress = false;
let messageTimer;
let audioContext;

const padFrequencies = [261.63, 329.63, 392.00, 440.00];
const STORAGE_KEY = 'patternGameHighScore';

function loadHighScore() {
    const storedScore = localStorage.getItem(STORAGE_KEY);
    highScore = storedScore ? parseInt(storedScore, 10) : 0;
    highScoreDisplay.textContent = `Best: ${highScore}`;
}

function saveHighScore() {
    if (level > highScore) {
        highScore = level;
        localStorage.setItem(STORAGE_KEY, highScore);
        highScoreDisplay.textContent = `Best: ${highScore}`;
        showAssistantMessage(`New best score: Level ${highScore}! Fantastic!`, 'highscore');
    }
}

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playTone(frequency, duration) {
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration / 1000);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration / 1000);
}

function showAssistantMessage(message, type = 'info') {
    clearTimeout(messageTimer);
    assistantText.textContent = message;
    assistantBox.className = 'assistant-box';
    assistantBox.classList.add(type);
    assistantBox.classList.add('show');
    messageTimer = setTimeout(() => {
        assistantBox.classList.remove('show');
    }, 4000);
}

function lightUpPad(padIndex) {
    const pad = document.querySelector(`[data-pad='${padIndex}']`);
    pad.classList.add('active');
    playTone(padFrequencies[padIndex], 300);
    setTimeout(() => {
        pad.classList.remove('active');
    }, 300);
}

async function playSequence() {
    isPlayerTurn = false;
    startBtn.disabled = true;
    showAssistantMessage("Watch carefully...", 'info');
    await new Promise(resolve => setTimeout(resolve, 1500));
    for (const padIndex of sequence) {
        await new Promise(resolve => setTimeout(resolve, 500));
        lightUpPad(padIndex);
    }
    isPlayerTurn = true;
    playerSequence = [];
    showAssistantMessage("Your turn!", 'success');
}

function nextRound() {
    level++;
    statusBar.textContent = `Level: ${level}`;
    const nextPad = Math.floor(Math.random() * 4);
    sequence.push(nextPad);
    playSequence();
}

function handlePlayerInput(e) {
    if (!isPlayerTurn || !gameInProgress) return;
    const padIndex = parseInt(e.target.dataset.pad);
    lightUpPad(padIndex);
    playerSequence.push(padIndex);
    const currentStep = playerSequence.length - 1;
    if (playerSequence[currentStep] !== sequence[currentStep]) {
        gameOver();
        return;
    }
    if (playerSequence.length === sequence.length) {
        isPlayerTurn = false;
        showAssistantMessage("Great job!", 'success');
        setTimeout(nextRound, 1000);
    }
}

function gameOver() {
    saveHighScore();
    showAssistantMessage(`Nice try! You reached level ${level - 1}.`, 'failure');
    gameInProgress = false;
    startBtn.textContent = 'Play Again';
    startBtn.disabled = false;
}

function startGame() {
    initAudio();
    level = 0;
    sequence = [];
    playerSequence = [];
    gameInProgress = true;
    startBtn.textContent = 'Game in Progress';
    nextRound();
}

startBtn.addEventListener('click', startGame);
gamePads.forEach(pad => pad.addEventListener('click', handlePlayerInput));

loadHighScore();
statusBar.textContent = `Level: 0`;
showAssistantMessage("Ready to test your memory? Press Start!");
