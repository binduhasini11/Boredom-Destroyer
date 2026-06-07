const screens = document.querySelectorAll('.screen');
const pageOverlay = document.getElementById('pageOverlay');
const webShell = document.getElementById('webShell');
const sparkleZone = document.getElementById('sparkleZone');
const landingScreen = document.getElementById('landingScreen');
const dashboardScreen = document.getElementById('dashboardScreen');
const noButton = document.getElementById('noButton');
const yesButton = document.getElementById('yesButton');
const toast = document.getElementById('toast');
const dashboardCards = document.querySelectorAll('.dashboard-grid .glass-card');
const moodBoosterButton = document.getElementById('moodBoosterButton');
const lyricsScreen = document.getElementById('lyricsScreen');
const roastScreen = document.getElementById('roastScreen');
const discoScreen = document.getElementById('discoScreen');
const vibeScreen = document.getElementById('vibeScreen');
const backButtons = document.querySelectorAll('.back-button');
const lyricSnippet = document.getElementById('lyricSnippet');
const lyricsAnswer = document.getElementById('lyricsAnswer');
const lyricsSubmit = document.getElementById('lyricsSubmit');
const lyricsSkip = document.getElementById('lyricsSkip');
const lyricsFeedback = document.getElementById('lyricsFeedback');
const lyricsScore = document.getElementById('lyricsScore');
const lyricsProgress = document.getElementById('lyricsProgress');
const roastText = document.getElementById('roastText');
const generateRoast = document.getElementById('generateRoast');
const copyRoast = document.getElementById('copyRoast');
const discoArena = document.getElementById('discoArena');
const emojiCloud = document.getElementById('emojiCloud');
const visualizer = document.getElementById('visualizer');
const quizQuestion = document.getElementById('quizQuestion');
const quizOptions = document.getElementById('quizOptions');
const quizNext = document.getElementById('quizNext');
const vibeProgress = document.getElementById('vibeProgress');
const vibeResultCard = document.getElementById('vibeResultCard');
const vibeResultName = document.getElementById('vibeResultName');
const vibeResultDescription = document.getElementById('vibeResultDescription');

let currentLyricsIndex = 0;
let lyricsScoreValue = 0;
let currentQuizIndex = 0;
let selectedAnswer = null;
let quizAnswers = [];
let currentRoast = '';

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove('show'), 2400);
}

function switchScreen(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;
  screens.forEach(screen => screen.classList.remove('active'));
  target.classList.add('active');
}

function showWebTransition(callback) {
  const lines = [];
  const count = 7;
  webShell.innerHTML = '';
  for (let i = 0; i < count; i += 1) {
    const line = document.createElement('div');
    line.className = 'web-line';
    line.style.transform = `translate(-50%, -50%) rotate(${i * 25}deg)`;
    webShell.appendChild(line);
    lines.push(line);
  }
  webShell.classList.add('active');
  setTimeout(() => {
    webShell.classList.remove('active');
    if (typeof callback === 'function') callback();
  }, 700);
}

function randomOffset(value) {
  return (Math.random() - 0.5) * value;
}

function moveNoButtonAway(event) {
  const rect = noButton.getBoundingClientRect();
  const dx = event.clientX - (rect.left + rect.width / 2);
  const dy = event.clientY - (rect.top + rect.height / 2);
  const distance = Math.sqrt(dx * dx + dy * dy);
  if (distance < 160) {
    const newX = Math.max(10, Math.min(window.innerWidth - rect.width - 10, rect.left + randomOffset(220)));
    const newY = Math.max(10, Math.min(window.innerHeight - rect.height - 10, rect.top + randomOffset(180)));
    noButton.style.transform = `translate(${newX - rect.left}px, ${newY - rect.top}px) rotate(${randomOffset(90)}deg)`;
    const messages = ['Nice try 😏', 'You ARE bored.', 'Stop lying 😂', 'Almost had it!', 'Come on, be honest.'];
    showToast(messages[Math.floor(Math.random() * messages.length)]);
  }
}

function resetNoButton() {
  noButton.style.transform = '';
}

function startLyricsGame() {
  currentLyricsIndex = 0;
  lyricsScoreValue = 0;
  lyricsScore.textContent = '0';
  lyricsFeedback.textContent = '';
  lyricsAnswer.value = '';
  lyricsProgress.textContent = `1 / ${lyricsQuestions.length}`;
  displayLyricQuestion();
}

function displayLyricQuestion() {
  const question = lyricsQuestions[currentLyricsIndex];
  lyricSnippet.textContent = question.snippet;
  lyricsProgress.textContent = `${currentLyricsIndex + 1} / ${lyricsQuestions.length}`;
}

function submitLyricAnswer() {
  const guess = lyricsAnswer.value.trim().toLowerCase();
  const correct = lyricsQuestions[currentLyricsIndex].answer.toLowerCase();
  if (!guess) {
    lyricsFeedback.textContent = 'Type your dreamy guess before submitting.';
    return;
  }
  if (guess === correct) {
    lyricsScoreValue += 1;
    lyricsScore.textContent = `${lyricsScoreValue}`;
    lyricsFeedback.textContent = 'Correct! Purple confetti explosion! 🎉';
    lyricsFeedback.style.color = '#b1d780';
    burstSparkles(18, '#c86cff');
    setTimeout(() => {
      currentLyricsIndex += 1;
      if (currentLyricsIndex >= lyricsQuestions.length) {
        lyricsFeedback.textContent = 'You crushed the lyrics challenge!';
        showToast('Legendary fan energy unlocked.');
      } else {
        lyricsAnswer.value = '';
        displayLyricQuestion();
      }
    }, 800);
  } else {
    lyricsFeedback.textContent = ['Try again, purple warrior.', 'Not quite yet!', 'Feels like a remix miss.'][Math.floor(Math.random() * 3)];
    lyricsFeedback.style.color = '#ff8fa0';
  }
}

function skipLyricQuestion() {
  currentLyricsIndex = Math.min(currentLyricsIndex + 1, lyricsQuestions.length - 1);
  lyricsAnswer.value = '';
  lyricsFeedback.textContent = 'Skipped. Keep the glow flowing.';
  displayLyricQuestion();
}

function loadRoast() {
  const roast = roastLines[Math.floor(Math.random() * roastLines.length)];
  currentRoast = roast;
  roastText.textContent = roast;
  showToast('Roast generated!');
}

function copyCurrentRoast() {
  if (!currentRoast) {
    showToast('Generate a roast first.');
    return;
  }
  navigator.clipboard.writeText(currentRoast).then(() => {
    showToast('Roast copied!');
  }).catch(() => {
    showToast('Clipboard not available.');
  });
}

function initDiscoRoom() {
  discoArena.innerHTML = '';
  visualizer.innerHTML = '';
  for (let i = 0; i < 8; i += 1) {
    const bar = document.createElement('span');
    visualizer.appendChild(bar);
  }
  for (let i = 0; i < 8; i += 1) {
    const spark = document.createElement('div');
    spark.className = 'disco-spark';
    spark.style.left = `${10 + i * 11}%`;
    spark.style.animationDelay = `${i * 0.12}s`;
    discoArena.appendChild(spark);
  }
}

function triggerDiscoBurst(x = window.innerWidth / 2, y = window.innerHeight / 2) {
  const burst = document.createElement('div');
  burst.className = 'disco-burst';
  burst.style.left = `${x}px`;
  burst.style.top = `${y}px`;
  document.body.appendChild(burst);
  setTimeout(() => burst.remove(), 650);
  for (let i = 0; i < 6; i += 1) {
    const emoji = document.createElement('div');
    emoji.className = 'emoji-pop';
    emoji.textContent = ['💜', '✨', '🎉', '🌟', '🕺', '🪩'][Math.floor(Math.random() * 6)];
    emoji.style.left = `${x + randomOffset(80)}px`;
    emoji.style.top = `${y + randomOffset(80)}px`;
    emojiCloud.appendChild(emoji);
    setTimeout(() => emoji.remove(), 1400);
  }
}

function showQuizQuestion() {
  const question = quizQuestions[currentQuizIndex];
  quizQuestion.textContent = question.prompt;
  quizOptions.innerHTML = '';
  selectedAnswer = null;
  quizNext.disabled = true;
  question.choices.forEach((choice, index) => {
    const option = document.createElement('button');
    option.type = 'button';
    option.className = 'quiz-option';
    option.textContent = choice;
    option.addEventListener('click', () => {
      selectedAnswer = index;
      Array.from(quizOptions.children).forEach(btn => btn.classList.remove('active'));
      option.classList.add('active');
      quizNext.disabled = false;
    });
    quizOptions.appendChild(option);
  });
  vibeProgress.textContent = `${currentQuizIndex + 1} / ${quizQuestions.length}`;
}

function completeQuiz() {
  const scores = { RM: 0, Jin: 0, SUGA: 0, jhope: 0, Jimin: 0, V: 0, Jungkook: 0 };
  quizAnswers.forEach((answerIndex, questionIndex) => {
    const mapping = quizQuestions[questionIndex].match[answerIndex];
    scores[mapping] += 1;
  });
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const winner = sorted[0][0];
  const profile = vibeProfiles[winner];
  vibeResultName.textContent = profile.name;
  vibeResultDescription.textContent = profile.description;
  vibeResultCard.classList.remove('hidden');
  showToast(`You match ${profile.name}!`);
}

function handleQuizNext() {
  if (selectedAnswer === null) return;
  quizAnswers.push(selectedAnswer);
  currentQuizIndex += 1;
  if (currentQuizIndex >= quizQuestions.length) {
    completeQuiz();
  } else {
    showQuizQuestion();
  }
}

function addEventListeners() {
  yesButton.addEventListener('click', () => {
    showWebTransition(() => switchScreen('dashboardScreen'));
  });
  noButton.addEventListener('mousemove', moveNoButtonAway);
  noButton.addEventListener('touchmove', event => moveNoButtonAway(event.touches[0] || event), { passive: true });
  noButton.addEventListener('click', event => {
    moveNoButtonAway(event);
    event.preventDefault();
  });
  noButton.addEventListener('touchstart', event => moveNoButtonAway(event.touches[0] || event));
  noButton.addEventListener('mouseleave', resetNoButton);

  dashboardCards.forEach(card => {
    card.addEventListener('click', () => {
      const target = card.dataset.target;
      if (target) {
        showWebTransition(() => {
          switchScreen(target);
          if (target === 'lyricsScreen') startLyricsGame();
          if (target === 'roastScreen') loadRoast();
          if (target === 'discoScreen') initDiscoRoom();
          if (target === 'vibeScreen') {
            currentQuizIndex = 0;
            quizAnswers = [];
            vibeResultCard.classList.add('hidden');
            showQuizQuestion();
          }
        });
      }
    });
  });

  moodBoosterButton.addEventListener('click', () => {
    const message = moodBoostMessages[Math.floor(Math.random() * moodBoostMessages.length)];
    showToast(message);
  });

  backButtons.forEach(button => {
    button.addEventListener('click', () => {
      showWebTransition(() => switchScreen('dashboardScreen'));
    });
  });

  lyricsSubmit.addEventListener('click', submitLyricAnswer);
  lyricsAnswer.addEventListener('keypress', event => {
    if (event.key === 'Enter') submitLyricAnswer();
  });
  lyricsSkip.addEventListener('click', skipLyricQuestion);

  generateRoast.addEventListener('click', loadRoast);
  copyRoast.addEventListener('click', copyCurrentRoast);

  discoArena.addEventListener('click', event => {
    triggerDiscoBurst(event.clientX, event.clientY);
  });

  quizNext.addEventListener('click', handleQuizNext);
}

function initVisualizer() {
  if (!visualizer) return;
  setInterval(() => {
    visualizer.querySelectorAll('span').forEach(bar => {
      bar.style.height = `${60 + Math.random() * 100}px`;
    });
  }, 300);
}

function initApp() {
  addEventListeners();
  initVisualizer();
  createFloatingParticles(sparkleZone, 24, '#b86bff');
}

initApp();
