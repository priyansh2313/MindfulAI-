const playerHandElement = document.getElementById('player-hand');
const aiHandElement = document.getElementById('ai-hand');
const discardPileElement = document.getElementById('discard-pile');
const deckPileElement = document.getElementById('deck-pile');
const gameStatusElement = document.getElementById('game-status');
const unoButton = document.getElementById('uno-button');
const colorModal = document.getElementById('color-modal');
const colorOptions = document.querySelectorAll('.color-option');
const gameOverModal = document.getElementById('game-over-modal');
const winMessageElement = document.getElementById('win-message');
const playAgainBtn = document.getElementById('play-again-btn');

const COLORS = ['red', 'green', 'blue', 'yellow'];
const VALUES = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'skip', 'reverse', 'draw2'];
const WILD_VALUES = ['wild', 'wild_draw4'];

let deck = [];
let discardPile = [];
let playerHand = [];
let aiHand = [];
let isPlayerTurn = true;
let chosenColor = null;

function createDeck() {
    const newDeck = [];
    for (const color of COLORS) {
        for (const value of VALUES) {
            newDeck.push({ color, value });
            if (value !== '0') newDeck.push({ color, value });
        }
    }
    for (let i = 0; i < 4; i++) {
        newDeck.push({ color: 'black', value: 'wild' });
        newDeck.push({ color: 'black', value: 'wild_draw4' });
    }
    return newDeck;
}

function shuffleDeck(deckToShuffle) {
    for (let i = deckToShuffle.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deckToShuffle[i], deckToShuffle[j]] = [deckToShuffle[j], deckToShuffle[i]];
    }
}

function drawCards(hand, num) {
    for (let i = 0; i < num; i++) {
        if (deck.length === 0) {
            if (discardPile.length <= 1) break;
            const topCard = discardPile.pop();
            deck = [...discardPile];
            shuffleDeck(deck);
            discardPile = [topCard];
        }
        if (deck.length > 0) hand.push(deck.pop());
    }
}

function renderCard(card) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card', card.color);
    
    const value = card.value;
    let symbol = '';
    if (value === 'skip') symbol = '🚫';
    else if (value === 'reverse') symbol = '🔄';
    else if (value === 'draw2') symbol = '+2';
    else if (value === 'wild') symbol = '🎨';
    else if (value === 'wild_draw4') symbol = '+4';
    else symbol = value;

    cardDiv.innerHTML = `
        <span class="card-corner top-left">${symbol}</span>
        <div class="card-center-oval"></div>
        <span class="card-value">${symbol}</span>
        <span class="card-corner bottom-right">${symbol}</span>
    `;
    
    if (card.color === 'black') {
        cardDiv.querySelector('.card-center-oval').style.display = 'none';
        cardDiv.querySelector('.card-value').style.fontSize = '3.5rem';
    } else {
        cardDiv.querySelector('.card-value').style.color = card.color;
    }

    return cardDiv;
}

function renderHands() {
    playerHandElement.innerHTML = '';
    playerHand.forEach(card => {
        const cardDiv = renderCard(card);
        if (isPlayerTurn && isCardPlayable(card)) {
            cardDiv.classList.add('playable');
            cardDiv.addEventListener('click', () => playCard(card));
        }
        playerHandElement.appendChild(cardDiv);
    });

    aiHandElement.innerHTML = '';
    aiHand.forEach(() => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        cardDiv.innerHTML = `<div class="card-back"></div>`;
        aiHandElement.appendChild(cardDiv);
    });
}

function renderDiscardPile() {
    discardPileElement.innerHTML = '';
    const topCard = discardPile[discardPile.length - 1];
    if (topCard) {
        const cardDiv = renderCard(topCard);
        if (chosenColor && topCard.color === 'black') {
            cardDiv.style.background = `linear-gradient(45deg, ${chosenColor}, #666)`;
        }
        discardPileElement.appendChild(cardDiv);
    }
}

function isCardPlayable(card) {
    const topCard = discardPile[discardPile.length - 1];
    return (
        card.color === 'black' ||
        card.color === topCard.color ||
        card.value === topCard.value ||
        card.color === chosenColor
    );
}

function playCard(card) {
    if (!isPlayerTurn || !isCardPlayable(card)) return;

    playerHand = playerHand.filter(c => c !== card);
    discardPile.push(card);
    chosenColor = null;

    renderAll();

    if (card.color === 'black') {
        setTimeout(() => colorModal.classList.remove('hidden'), 100);
        return;
    }
    
    processCardEffect(card, 'player');
}

function processCardEffect(card, playerType) {
    const opponentHand = playerType === 'player' ? aiHand : playerHand;
    let skipTurn = false;

    switch(card.value) {
        case 'skip':
        case 'reverse':
            skipTurn = true;
            break;
        case 'draw2':
            drawCards(opponentHand, 2);
            skipTurn = true;
            break;
        case 'wild_draw4':
            drawCards(opponentHand, 4);
            skipTurn = true;
            break;
    }
    
    if (checkWin(playerType)) return;

    if (skipTurn) {
        if (playerType === 'ai') setTimeout(aiTurn, 1000);
    } else {
        endTurn();
    }
}

function endTurn() {
    isPlayerTurn = !isPlayerTurn;
    if (!isPlayerTurn) {
        gameStatusElement.textContent = "AI's Turn";
        setTimeout(aiTurn, 1500);
    } else {
        gameStatusElement.textContent = "Your Turn";
    }
    renderAll();
}

function aiTurn() {
    const playableCards = aiHand.filter(isCardPlayable);
    if (playableCards.length > 0) {
        const cardToPlay = playableCards[0];
        aiHand = aiHand.filter(c => c !== cardToPlay);
        discardPile.push(cardToPlay);
        
        if (cardToPlay.color === 'black') {
            chosenColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        } else {
            chosenColor = null;
        }
        
        renderAll();
        setTimeout(() => processCardEffect(cardToPlay, 'ai'), 500);
    } else {
        drawCards(aiHand, 1);
        renderAll();
        endTurn();
    }
}

function checkWin(playerType) {
    const hand = playerType === 'player' ? playerHand : aiHand;
    if (hand.length === 0) {
        gameOverModal.classList.remove('hidden');
        winMessageElement.textContent = playerType === 'player' ? "You Won!" : "AI Won!";
        return true;
    }
    return false;
}

function renderAll() {
    renderHands();
    renderDiscardPile();
}

function startGame() {
    deck = createDeck();
    shuffleDeck(deck);
    playerHand = [];
    aiHand = [];
    discardPile = [];
    isPlayerTurn = true;
    chosenColor = null;

    drawCards(playerHand, 7);
    drawCards(aiHand, 7);
    
    let firstCard;
    do {
        if (deck.length === 0) {
            deck = createDeck();
            shuffleDeck(deck);
        }
        firstCard = deck.pop();
    } while (firstCard.color === 'black');
    discardPile.push(firstCard);

    gameStatusElement.textContent = "Your Turn";
    gameOverModal.classList.add('hidden');
    renderAll();
}

deckPileElement.addEventListener('click', () => {
    if (isPlayerTurn) {
        drawCards(playerHand, 1);
        renderAll();
        setTimeout(endTurn, 200);
    }
});

colorOptions.forEach(option => {
    option.addEventListener('click', () => {
        chosenColor = option.dataset.color;
        colorModal.classList.add('hidden');
        const topCard = discardPile[discardPile.length - 1];
        renderAll();
        setTimeout(() => processCardEffect(topCard, 'player'), 500);
    });
});

playAgainBtn.addEventListener('click', startGame);

startGame();
