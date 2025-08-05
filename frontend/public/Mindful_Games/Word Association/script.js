const wordDisplay = document.getElementById('word-display');
const choicesContainer = document.getElementById('choices-container');
const streakDisplay = document.getElementById('streak-display');
const highScoreDisplay = document.getElementById('high-score-display');
const assistantBox = document.getElementById('assistant-message');
const assistantText = document.getElementById('assistant-text');

const STORAGE_KEY = 'wordAssociationHighScore';

const puzzles = [
    { word: "Doctor", choices: ["Stethoscope", "Chalk", "Telescope"], answer: "Stethoscope" },
    { word: "Mumbai", choices: ["Gateway of India", "Taj Mahal", "Victoria Memorial"], answer: "Gateway of India" },
    { word: "Rain", choices: ["Desert", "Pakora", "Sun"], answer: "Pakora" },
    { word: "Sitar", choices: ["Guitar", "Ravi Shankar", "Drums"], answer: "Ravi Shankar" },
    { word: "King", choices: ["President", "Palace", "Hut"], answer: "Palace" },
    { word: "Kolkata", choices: ["Biryani", "Howrah Bridge", "Vada Pav"], answer: "Howrah Bridge" },
    { word: "Writer", choices: ["Keyboard", "Spade", "Wrench"], answer: "Keyboard" },
    { word: "Diwali", choices: ["Christmas Tree", "Diya", "Pumpkin"], answer: "Diya" },
    { word: "Farmer", choices: ["Tractor", "Desk", "Scalpel"], answer: "Tractor" },
    { word: "Himalayas", choices: ["Beach", "Mount Everest", "Desert"], answer: "Mount Everest" },
    { word: "Pen", choices: ["Write", "Eat", "Drive"], answer: "Write" },
    { word: "Samosa", choices: ["Potato", "Rice", "Noodles"], answer: "Potato" },
    { word: "Ganga", choices: ["Ocean", "River", "Lake"], answer: "River" },
    { word: "Fire", choices: ["Cold", "Hot", "Wet"], answer: "Hot" },
    { word: "Library", choices: ["Books", "Movies", "Food"], answer: "Books" },
    { word: "Cricket", choices: ["Bat", "Racket", "Stick"], answer: "Bat" },
    { word: "Chef", choices: ["Hospital", "Kitchen", "Office"], answer: "Kitchen" },
    { word: "Jaipur", choices: ["Blue City", "Pink City", "White City"], answer: "Pink City" },
    { word: "Teacher", choices: ["Blackboard", "Computer", "Microscope"], answer: "Blackboard" },
    { word: "Car", choices: ["Engine", "Pedal", "Sail"], answer: "Engine" },
    { word: "Tree", choices: ["Roots", "Wheels", "Wings"], answer: "Roots" },
    { word: "Bird", choices: ["Nest", "Cave", "Kennel"], answer: "Nest" },
    { word: "Spider", choices: ["Web", "Honey", "Shell"], answer: "Web" },
    { word: "Sun", choices: ["Shine", "Glow", "Twinkle"], answer: "Shine" },
    { word: "Moon", choices: ["Stars", "Clouds", "Rainbow"], answer: "Stars" },
    { word: "Hospital", choices: ["Patients", "Students", "Customers"], answer: "Patients" },
    { word: "Key", choices: ["Unlock", "Write", "Sing"], answer: "Unlock" },
    { word: "Chair", choices: ["Sit", "Run", "Jump"], answer: "Sit" },
    { word: "India", choices: ["Peacock", "Lion", "Eagle"], answer: "Peacock" },
    { word: "Mango", choices: ["Winter", "Monsoon", "Summer"], answer: "Summer" }
];

let currentStreak = 0;
let highScore = 0;
let currentPuzzle = {};
let availablePuzzles = [];
let messageTimer;

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
    if (currentStreak > highScore) {
        highScore = currentStreak;
        localStorage.setItem(STORAGE_KEY, highScore);
        highScoreDisplay.textContent = `Best: ${highScore}`;
        showAssistantMessage(`New best streak: ${highScore}! You're on fire!`, 'highscore');
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function nextPuzzle() {
    if (availablePuzzles.length === 0) {
        availablePuzzles = [...puzzles];
    }
    
    wordDisplay.classList.add('flipping');

    setTimeout(() => {
        const puzzleIndex = Math.floor(Math.random() * availablePuzzles.length);
        currentPuzzle = availablePuzzles.splice(puzzleIndex, 1)[0];

        wordDisplay.textContent = currentPuzzle.word;
        choicesContainer.innerHTML = '';
        
        const shuffledChoices = [...currentPuzzle.choices];
        shuffleArray(shuffledChoices);

        shuffledChoices.forEach(choice => {
            const button = document.createElement('button');
            button.textContent = choice;
            button.classList.add('choice-btn');
            button.addEventListener('click', handleChoice);
            choicesContainer.appendChild(button);
        });
        
        wordDisplay.classList.remove('flipping');
    }, 500);
}

function handleChoice(e) {
    const selectedButton = e.target;
    const selectedAnswer = selectedButton.textContent;

    Array.from(choicesContainer.children).forEach(button => {
        button.disabled = true;
        if (button.textContent !== currentPuzzle.answer && button !== selectedButton) {
            button.classList.add('faded');
        }
    });

    if (selectedAnswer === currentPuzzle.answer) {
        selectedButton.classList.add('correct');
        currentStreak++;
        showAssistantMessage("That's a great connection!", 'success');
    } else {
        selectedButton.classList.add('incorrect');
        const correctButton = Array.from(choicesContainer.children).find(btn => btn.textContent === currentPuzzle.answer);
        correctButton.classList.add('correct');
        saveHighScore();
        currentStreak = 0;
        showAssistantMessage("Not quite, but good thinking!", 'failure');
    }

    streakDisplay.textContent = `Streak: ${currentStreak}`;
    setTimeout(nextPuzzle, 2000);
}

function setupGame() {
    loadHighScore();
    currentStreak = 0;
    streakDisplay.textContent = `Streak: ${currentStreak}`;
    nextPuzzle();
    showAssistantMessage("Let's see how well we can connect ideas. Good luck!");
}

setupGame();
