const gameBoard = document.getElementById('game-board');
const movesCountSpan = document.getElementById('moves-count');
const bestScoreSpan = document.getElementById('best-score');
const restartBtn = document.getElementById('restart-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const winModal = document.getElementById('win-modal');
const winModalContent = document.getElementById('win-modal-content');
const finalMovesSpan = document.getElementById('final-moves');
const backgroundMusic = document.getElementById('background-music');
const assistantBox = document.getElementById('assistant-message');
const assistantText = document.getElementById('assistant-text');

let cards = [];
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let matchedPairs = 0;
let musicStarted = false;
let messageTimer;
let bestScore = 0;

const STORAGE_KEY = 'memoryGameBestScore';

const successMessages = ["Great match!", "You've got a sharp memory!", "Excellent work!", "That's it!", "Nicely done!"];
const failureMessages = ["No worries, try again!", "Almost! Keep going.", "That's okay, let's try another pair.", "Oops! Let's find its match."];

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

function loadBestScore() {
    const storedScore = localStorage.getItem(STORAGE_KEY);
    bestScore = storedScore ? parseInt(storedScore, 10) : 0;
    bestScoreSpan.textContent = bestScore > 0 ? bestScore : '--';
}

function checkAndSaveBestScore() {
    if (bestScore === 0 || moves < bestScore) {
        bestScore = moves;
        localStorage.setItem(STORAGE_KEY, bestScore);
        bestScoreSpan.textContent = bestScore;
        showAssistantMessage(`New best score: ${bestScore} moves! Incredible!`, 'highscore');
    }
}

function playMusic() {
    if (musicStarted) return;
    const playPromise = backgroundMusic.play();
    if (playPromise !== undefined) {
        playPromise.then(() => { musicStarted = true; }).catch(() => { console.log("Music autoplay blocked."); });
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createBoard() {
    const gameEmojis = ['🍎', '🍌', '🍇', '🍓', '🍒', '🍑', '🍍', '🥝', '🍉', '🍊'];
    const totalPairs = gameEmojis.length;
    const gameDeck = [...gameEmojis, ...gameEmojis];
    shuffle(gameDeck);
    
    gameBoard.innerHTML = '';
    moves = 0;
    matchedPairs = 0;
    movesCountSpan.textContent = moves;

    gameDeck.forEach(emoji => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.emoji = emoji;
        cardElement.innerHTML = `
            <div class="back-face"><svg class="card-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" /></svg></div>
            <div class="front-face"><span class="card-emoji">${emoji}</span></div>
        `;
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
    setTimeout(() => {
        showAssistantMessage("Let's begin! Find the matching pairs.");
    }, 500);
}

function flipCard() {
    if (!musicStarted) {
        playMusic();
        musicStarted = true;
    }
    if (lockBoard || this === firstCard) return;
    this.classList.add('flipped');
    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
    } else {
        secondCard = this;
        incrementMoves();
        checkForMatch();
    }
}

function checkForMatch() {
    const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
    if (isMatch) {
        const randomMessage = successMessages[Math.floor(Math.random() * successMessages.length)];
        showAssistantMessage(randomMessage, 'success');
        disableCards();
    } else {
        const randomMessage = failureMessages[Math.floor(Math.random() * failureMessages.length)];
        showAssistantMessage(randomMessage, 'failure');
        unflipCards();
    }
}

function incrementMoves() {
    moves++;
    movesCountSpan.textContent = moves;
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    matchedPairs++;
    resetBoardState();
    
    const totalPairs = document.querySelectorAll('.card').length / 2;
    if (matchedPairs === totalPairs) {
        showAssistantMessage("Wow, you did it! Amazing job!", 'success');
        checkAndSaveBestScore();
        setTimeout(showWinModal, 1200);
    }
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoardState();
    }, 1200);
}

function resetBoardState() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function showWinModal() {
    finalMovesSpan.textContent = moves;
    winModal.classList.remove('hidden');
    setTimeout(() => {
        winModalContent.style.transform = 'scale(1)';
        winModalContent.style.opacity = '1';
    }, 10);
}

function hideWinModal() {
    winModalContent.style.transform = 'scale(0.95)';
    winModalContent.style.opacity = '0';
    setTimeout(() => {
        winModal.classList.add('hidden');
    }, 300);
}

function restartGame() {
    hideWinModal();
    setTimeout(createBoard, 300);
}

restartBtn.addEventListener('click', restartGame);
playAgainBtn.addEventListener('click', restartGame);

loadBestScore();
createBoard();
playMusic();
