const languageSelector = document.getElementById('language-selector');
const storyLibrary = document.getElementById('story-library');
const readerContainer = document.getElementById('reader-container');
const quizContainer = document.getElementById('quiz-container');
const storyListElement = document.getElementById('story-list');
const chapterTitleElement = document.getElementById('story-title-reader');
const chapterTextElement = document.getElementById('story-text');
const playPauseBtn = document.getElementById('play-pause-btn');
const stopBtn = document.getElementById('stop-btn');
const backToListBtn = document.getElementById('back-to-list-btn');
const backToLangBtn = document.getElementById('back-to-lang-btn');
const langButtons = document.querySelectorAll('.lang-btn');
const assistantBox = document.getElementById('assistant-message');
const assistantText = document.getElementById('assistant-text');
const streakDisplay = document.getElementById('streak-display');
const categoryFilters = document.getElementById('category-filters');
const quizQuestion = document.getElementById('quiz-question');
const quizOptions = document.getElementById('quiz-options');
const quizFeedback = document.getElementById('quiz-feedback');

let currentLang = '';
let currentStory = null;
let currentUtterance = null;
let isPlaying = false;
let streak = 0;
let completedStories = [];

function showView(viewName) {
    ['language-selector', 'story-library', 'reader-container', 'quiz-container'].forEach(id => {
        const element = document.getElementById(id);
        if (element) element.classList.add('hidden');
    });
    const viewToShow = document.getElementById(viewName);
    if (viewToShow) viewToShow.classList.remove('hidden');
}

function showAssistantMessage(message) {
    assistantText.textContent = message;
    assistantBox.classList.add('show');
    setTimeout(() => assistantBox.classList.remove('show'), 5000);
}

function loadProgress() {
    streak = parseInt(localStorage.getItem('storyStreak') || '0');
    completedStories = JSON.parse(localStorage.getItem('completedStories') || '[]');
    streakDisplay.textContent = `🔥 Streak: ${streak}`;
}

function saveProgress() {
    localStorage.setItem('storyStreak', streak);
    localStorage.setItem('completedStories', JSON.stringify(completedStories));
}

function populateStoryList(lang, filter = 'All') {
    currentLang = lang;
    storyListElement.innerHTML = '';
    const storyPool = stories[lang];
    const filteredStories = filter === 'All' ? storyPool : storyPool.filter(s => s.category === filter);

    filteredStories.forEach(story => {
        const button = document.createElement('button');
        button.classList.add('story-btn');
        if (completedStories.includes(story.id)) button.classList.add('completed');
        button.innerHTML = `${story.title} <span class="author">${story.author}</span>`;
        button.addEventListener('click', () => openReader(story));
        storyListElement.appendChild(button);
    });
}

function populateFilters(lang) {
    categoryFilters.innerHTML = '';
    const categories = ['All', ...new Set(stories[lang].map(s => s.category))];
    categories.forEach(cat => {
        const button = document.createElement('button');
        button.classList.add('filter-btn');
        if (cat === 'All') button.classList.add('active');
        button.textContent = cat;
        button.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            populateStoryList(lang, cat);
        });
        categoryFilters.appendChild(button);
    });
}

function openReader(story) {
    currentStory = story;
    showView('reader-container');
    chapterTitleElement.textContent = story.title;
    chapterTextElement.innerHTML = `<p>${story.text.replace(/\n/g, '</p><p>')}</p>`;
    chapterTextElement.scrollTop = 0;
    showAssistantMessage("Press play to listen, or stop when you're ready for the quiz.");
}

function playSpeech() {
    if (speechSynthesis.speaking) {
        speechSynthesis.resume();
    } else {
        currentUtterance = new SpeechSynthesisUtterance(currentStory.text);
        currentUtterance.lang = currentLang;
        currentUtterance.rate = 0.9;
        currentUtterance.onend = () => {
            isPlaying = false;
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            showAssistantMessage("Story finished! Let's try the quiz.");
            setTimeout(startQuiz, 1000);
        };
        speechSynthesis.speak(currentUtterance);
    }
    isPlaying = true;
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
}

function pauseSpeech() {
    speechSynthesis.pause();
    isPlaying = false;
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
}

function stopSpeechAndQuiz() {
    speechSynthesis.cancel();
    isPlaying = false;
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    startQuiz();
}

function startQuiz() {
    showView('quiz-container');
    quizFeedback.textContent = '';
    const questionData = currentStory.quiz[0];
    quizQuestion.textContent = questionData.question;
    quizOptions.innerHTML = '';
    questionData.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.classList.add('option-btn');
        button.textContent = option;
        button.addEventListener('click', () => checkAnswer(index, questionData.answer));
        quizOptions.appendChild(button);
    });
}

function checkAnswer(selectedIndex, correctIndex) {
    const buttons = quizOptions.querySelectorAll('.option-btn');
    buttons.forEach(btn => btn.disabled = true);
    if (selectedIndex === correctIndex) {
        buttons[selectedIndex].classList.add('correct');
        quizFeedback.textContent = "Correct! Well done!";
        quizFeedback.style.color = '#22c55e';
        if (!completedStories.includes(currentStory.id)) {
            streak++;
            completedStories.push(currentStory.id);
            saveProgress();
            streakDisplay.textContent = `🔥 Streak: ${streak}`;
        }
    } else {
        buttons[selectedIndex].classList.add('incorrect');
        buttons[correctIndex].classList.add('correct');
        quizFeedback.textContent = "Not quite, but good try!";
        quizFeedback.style.color = '#ef4444';
        streak = 0;
        saveProgress();
        streakDisplay.textContent = `🔥 Streak: ${streak}`;
    }
    setTimeout(() => {
        showView('story-library');
        populateStoryList(currentLang);
    }, 2500);
}

langButtons.forEach(button => {
    button.addEventListener('click', () => {
        const lang = button.dataset.lang;
        showView('story-library');
        populateFilters(lang);
        populateStoryList(lang);
    });
});

playPauseBtn.addEventListener('click', () => {
    if (isPlaying) pauseSpeech();
    else playSpeech();
});

stopBtn.addEventListener('click', stopSpeechAndQuiz);
backToListBtn.addEventListener('click', () => {
    speechSynthesis.cancel();
    showView('story-library');
});
backToLangBtn.addEventListener('click', () => showView('language-selector'));

loadProgress();
showView('language-selector');
showAssistantMessage("Welcome to the Story Corner. Please select a language to begin.");