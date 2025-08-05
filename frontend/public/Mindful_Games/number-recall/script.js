const sequenceDisplay = document.getElementById('sequence-display');
const statusBar = document.getElementById('status-bar');
const highScoreDisplay = document.getElementById('high-score-display');
const inputArea = document.getElementById('input-area');
const userInput = document.getElementById('user-input');
const startBtn = document.getElementById('start-btn');
const checkBtn = document.getElementById('check-btn');
const assistantBox = document.getElementById('assistant-message');
const assistantText = document.getElementById('assistant-text');

let currentLevel = 3;
let currentSequence = '';
let canInput = false;
let messageTimer;
let highScore = 0;

const STORAGE_KEY = 'numberRecallHighScore';

const welcomeMessage = "Let's test your memory! I'll show you a number, and you dial it back.";
const successMessages = ["Perfect!", "You got it!", "Excellent memory!", "That's the one!"];
const failureMessages = ["Not quite, but great effort!", "Almost! Let's try another.", "That's okay, memory is a muscle."];

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

function loadHighScore() {
    const storedScore = localStorage.getItem(STORAGE_KEY);
    highScore = storedScore ? parseInt(storedScore, 10) : 0;
    highScoreDisplay.textContent = `Best: ${highScore}`;
}

function saveHighScore() {
    if (currentLevel > highScore) {
        highScore = currentLevel;
        localStorage.setItem(STORAGE_KEY, highScore);
        highScoreDisplay.textContent = `Best: ${highScore}`;
        showAssistantMessage(`New best score: ${highScore}! You're amazing!`, 'highscore');
    }
}

function generateSequence(length) {
    let sequence = '';
    for (let i = 0; i < length; i++) {
        sequence += Math.floor(Math.random() * 10);
    }
    return sequence;
}

async function startGame() {
    canInput = false;
    statusBar.textContent = `Level: ${currentLevel}`;
    startBtn.classList.add('hidden');
    inputArea.classList.add('hidden');
    checkBtn.classList.add('hidden');
    sequenceDisplay.classList.remove('hidden');
    sequenceDisplay.innerHTML = '';
    userInput.value = '';
    userInput.className = '';

    showAssistantMessage("Watch the number appear...");

    currentSequence = generateSequence(currentLevel);
    
    for (let i = 0; i < currentSequence.length; i++) {
        const digitSpan = document.createElement('span');
        digitSpan.textContent = currentSequence[i];
        digitSpan.className = 'digit';
        digitSpan.style.animationDelay = `${i * 0.3}s`;
        sequenceDisplay.appendChild(digitSpan);
        await new Promise(resolve => setTimeout(resolve, 300));
    }

    const displayTime = 1500;
    setTimeout(() => {
        sequenceDisplay.innerHTML = '';
        showInputArea();
    }, displayTime);
}

function showInputArea() {
    showAssistantMessage("Okay, what was the number?");
    inputArea.classList.remove('hidden');
    checkBtn.classList.remove('hidden');
    userInput.focus();
    canInput = true;
}

function checkAnswer() {
    if (!canInput) return;

    const isCorrect = userInput.value === currentSequence;
    userInput.classList.add(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
        const randomMessage = successMessages[Math.floor(Math.random() * successMessages.length)];
        showAssistantMessage(randomMessage, 'success');
        saveHighScore();
        currentLevel++;
        startBtn.textContent = 'Next Level';
    } else {
        const randomMessage = failureMessages[Math.floor(Math.random() * failureMessages.length)];
        showAssistantMessage(`${randomMessage} The number was ${currentSequence}.`, 'failure');
        currentLevel = Math.max(3, currentLevel - 1);
        startBtn.textContent = 'Try Again';
    }

    canInput = false;
    inputArea.classList.add('hidden');
    checkBtn.classList.add('hidden');
    startBtn.classList.remove('hidden');
}

startBtn.addEventListener('click', startGame);
checkBtn.addEventListener('click', checkAnswer);
userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && canInput) {
        checkAnswer();
    }
});

loadHighScore();
showAssistantMessage(welcomeMessage);
