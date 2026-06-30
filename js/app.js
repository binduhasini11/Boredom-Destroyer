/**
 * app.js — Main application controller
 * Handles navigation, game logic, event wiring, accessibility
 */

'use strict';

// ─── DOM REFERENCES ──────────────────────────────────────────────────────────
const $ = (id) => document.getElementById(id);
const $$ = (sel) => document.querySelectorAll(sel);

const landingScreen    = $('landingScreen');
const dashboardScreen  = $('dashboardScreen');
const lyricsScreen     = $('lyricsScreen');
const roastScreen      = $('roastScreen');
const discoScreen      = $('discoScreen');
const vibeScreen       = $('vibeScreen');
const pageOverlay      = $('pageOverlay');
const sparkleZone      = $('sparkleZone');

const yesButton        = $('yesButton');
const noButton         = $('noButton');
const moodBoosterBtn   = $('moodBoosterButton');

// Lyrics
const lyricSnippet     = $('lyricSnippet');
const lyricsAnswer     = $('lyricsAnswer');
const lyricsSubmit     = $('lyricsSubmit');
const lyricsSkip       = $('lyricsSkip');
const lyricsRestart    = $('lyricsRestart');
const lyricsFeedback   = $('lyricsFeedback');
const lyricsScoreEl    = $('lyricsScore');
const lyricsProgress   = $('lyricsProgress');
const lyricsProgressBar = $('lyricsProgressBar');

// Roast
const roastText        = $('roastText');
const generateRoast    = $('generateRoast');
const copyRoast        = $('copyRoast');

// Disco
const discoArena       = $('discoArena');
const emojiCloud       = $('emojiCloud');
const visualizer       = $('visualizer');
const discoToggle      = $('discoMusicToggle');

// Quiz
const quizQuestion     = $('quizQuestion');
const quizOptionsEl    = $('quizOptions');
const quizNext         = $('quizNext');
const vibeProgress     = $('vibeProgress');
const vibeProgressBar  = $('vibeProgressBar');
const vibeResultCard   = $('vibeResultCard');
const vibeResultName   = $('vibeResultName');
const vibeResultEmoji  = $('vibeResultEmoji');
const vibeResultDesc   = $('vibeResultDescription');
const vibeResultColor  = $('vibeResultColor');
const quizRestart      = $('quizRestart');

// ─── STATE ───────────────────────────────────────────────────────────────────
let currentLyricsIndex = 0;
let lyricsScoreValue   = 0;
let usedLyricsIndices  = [];
let shuffledLyrics     = [];

let currentQuizIndex   = 0;
let selectedAnswer     = null;
let quizAnswers        = [];

let lastMoodIndex      = -1;
let lastRoastIndex     = -1;
let currentRoastText   = '';

let noButtonPos        = { x: 0, y: 0 };
let discoAudioCtx      = null;
let discoOscillators   = [];
let discoMusicOn       = false;
let visualizerInterval = null;

// ─── SCREEN ROUTER ───────────────────────────────────────────────────────────
function switchScreen(targetId) {
  const target = $(targetId);
  if (!target) return;
  $$('.screen').forEach(s => {
    s.classList.remove('active');
    s.setAttribute('aria-hidden', 'true');
  });
  target.classList.add('active');
  target.setAttribute('aria-hidden', 'false');
  target.scrollTop = 0;
}

function navigateTo(targetId, initFn) {
  showWebTransition(() => {
    switchScreen(targetId);
    if (typeof initFn === 'function') initFn();
  });
}

// ─── LANDING PAGE — NO BUTTON ESCAPE ─────────────────────────────────────────
function initNoButton() {
  // Track current position — start as null (in normal flow)
  let isFixed = false;

  function makeFixed() {
    if (isFixed) return;
    // Grab current rendered position before switching to fixed
    const rect = noButton.getBoundingClientRect();
    noButton.style.position = 'fixed';
    noButton.style.left     = `${rect.left}px`;
    noButton.style.top      = `${rect.top}px`;
    noButton.style.margin   = '0';
    noButtonPos = { x: rect.left, y: rect.top };
    isFixed = true;
  }

  function placeNoButton(x, y) {
    const bw  = noButton.offsetWidth  || 160;
    const bh  = noButton.offsetHeight || 54;
    const pad = 16;
    const nx  = Math.max(pad, Math.min(window.innerWidth  - bw - pad, x));
    const ny  = Math.max(pad, Math.min(window.innerHeight - bh - pad, y));
    noButtonPos = { x: nx, y: ny };
    noButton.style.left = `${nx}px`;
    noButton.style.top  = `${ny}px`;
  }

  function tryEscape(clientX, clientY) {
    if (!landingScreen.classList.contains('active')) return;

    // Use current position — fixed or from getBoundingClientRect
    const rect = isFixed
      ? { left: noButtonPos.x, top: noButtonPos.y,
          width: noButton.offsetWidth, height: noButton.offsetHeight }
      : noButton.getBoundingClientRect();

    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = clientX - cx;
    const dy   = clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 150) {
      makeFixed(); // snap to fixed only when escape is needed
      const away = 210;
      const newX = (noButtonPos.x) - (dx / (dist || 1)) * away + (Math.random() - 0.5) * 100;
      const newY = (noButtonPos.y) - (dy / (dist || 1)) * away + (Math.random() - 0.5) * 100;
      placeNoButton(newX, newY);
      const msgs = ['Nice try 😏', 'You ARE bored.', 'Stop lying 😂', 'Almost had it!', 'Come on… 👀'];
      showToast(msgs[Math.floor(Math.random() * msgs.length)]);
    }
  }

  // Block actual clicks on the NO button — it should never do anything
  noButton.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); });
  noButton.addEventListener('pointerdown', (e) => {
    tryEscape(e.clientX, e.clientY);
    e.preventDefault();
  });

  document.addEventListener('pointermove', (e) => tryEscape(e.clientX, e.clientY), { passive: true });

  // Reset to normal flow when leaving landing
  function resetNoBtn() {
    isFixed = false;
    noButton.style.position = '';
    noButton.style.left     = '';
    noButton.style.top      = '';
    noButton.style.margin   = '';
  }

  yesButton.addEventListener('click', resetNoBtn);
}

// ─── LYRICS GAME ─────────────────────────────────────────────────────────────
function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function startLyricsGame() {
  shuffledLyrics     = shuffleArray(lyricsQuestions);
  currentLyricsIndex = 0;
  lyricsScoreValue   = 0;
  lyricsScoreEl.textContent = '0';
  lyricsFeedback.textContent = '';
  lyricsFeedback.className   = 'game-feedback';
  lyricsAnswer.value = '';
  lyricsSubmit.disabled = false;
  lyricsSkip.disabled   = false;
  renderLyricQuestion();
}

function renderLyricQuestion() {
  const total    = shuffledLyrics.length;
  const question = shuffledLyrics[currentLyricsIndex];

  // Animate text change
  lyricSnippet.classList.add('fade-out');
  setTimeout(() => {
    lyricSnippet.textContent = question.hint;
    lyricSnippet.classList.remove('fade-out');
  }, 180);

  lyricsProgress.textContent     = `${currentLyricsIndex + 1} / ${total}`;
  lyricsProgressBar.style.width  = `${((currentLyricsIndex + 1) / total) * 100}%`;
  lyricsAnswer.value             = '';
  lyricsFeedback.textContent     = '';
  lyricsFeedback.className       = 'game-feedback';
  lyricsAnswer.focus();
}

function finishLyricsGame() {
  const total = shuffledLyrics.length;
  lyricSnippet.textContent = `Game Over! You scored ${lyricsScoreValue} / ${total} 🎉`;
  lyricsAnswer.disabled    = true;
  lyricsSubmit.disabled    = true;
  lyricsSkip.disabled      = true;
  lyricsProgressBar.style.width = '100%';
  lyricsProgress.textContent = `${total} / ${total}`;
  if (lyricsScoreValue === total) {
    launchConfetti();
    showToast('PERFECT SCORE! Legendary fan energy! 💜', 'success');
  } else {
    showToast(`${lyricsScoreValue}/${total} — Not bad, purple warrior!`, 'info');
  }
}

function submitLyricAnswer() {
  const guess   = lyricsAnswer.value.trim().toLowerCase();
  const correct = shuffledLyrics[currentLyricsIndex].answer.toLowerCase();
  if (!guess) {
    setFeedback('Type your dreamy guess before submitting.', 'neutral');
    return;
  }
  if (guess === correct || guess.includes(correct) || correct.includes(guess)) {
    lyricsScoreValue++;
    lyricsScoreEl.textContent = `${lyricsScoreValue}`;
    setFeedback('✓ Correct! Purple confetti explosion! 🎉', 'correct');
    burstSparkles(16, '#c86cff');
    lyricsSubmit.disabled = true;
    lyricsSkip.disabled   = true;
    setTimeout(() => {
      lyricsSubmit.disabled = false;
      lyricsSkip.disabled   = false;
      currentLyricsIndex++;
      if (currentLyricsIndex >= shuffledLyrics.length) {
        finishLyricsGame();
      } else {
        renderLyricQuestion();
      }
    }, 1000);
  } else {
    setFeedback(['Try again, purple warrior. 💪', 'Not quite! The answer is hiding…', 'Feels like a remix miss.'][Math.floor(Math.random() * 3)], 'wrong');
    lyricsAnswer.select();
  }
}

function skipLyricQuestion() {
  const correct = shuffledLyrics[currentLyricsIndex].answer;
  setFeedback(`Skipped — the answer was: "${correct}"`, 'neutral');
  lyricsSkip.disabled   = true;
  lyricsSubmit.disabled = true;
  setTimeout(() => {
    lyricsSubmit.disabled = false;
    lyricsSkip.disabled   = false;
    currentLyricsIndex++;
    if (currentLyricsIndex >= shuffledLyrics.length) {
      finishLyricsGame();
    } else {
      renderLyricQuestion();
    }
  }, 1200);
}

function setFeedback(msg, type) {
  lyricsFeedback.textContent = msg;
  lyricsFeedback.className   = `game-feedback feedback--${type}`;
}

// ─── ROAST GENERATOR ─────────────────────────────────────────────────────────
function loadRoast() {
  const pool = roastLines.filter((_, i) => i !== lastRoastIndex);
  const idx  = Math.floor(Math.random() * pool.length);
  const roast = pool[idx];
  lastRoastIndex = roastLines.indexOf(roast);
  currentRoastText = roast;

  // Animated text reveal
  roastText.classList.add('roast-reveal');
  roastText.textContent = '';
  setTimeout(() => {
    roastText.textContent = roast;
    roastText.classList.remove('roast-reveal');
    roastText.classList.add('roast-visible');
    setTimeout(() => roastText.classList.remove('roast-visible'), 600);
  }, 180);

  burstSparkles(10, '#ff7094');
  showToast('Roast delivered! 🔥', 'success');
}

function copyCurrentRoast() {
  if (!currentRoastText) {
    showToast('Generate a roast first!');
    return;
  }
  if (navigator.clipboard) {
    navigator.clipboard.writeText(currentRoastText)
      .then(() => showToast('Roast copied to clipboard! 📋', 'success'))
      .catch(() => fallbackCopy(currentRoastText));
  } else {
    fallbackCopy(currentRoastText);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;opacity:0;';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    showToast('Roast copied! 📋', 'success');
  } catch {
    showToast('Could not copy — try manually.', 'error');
  }
  document.body.removeChild(ta);
}

// ─── MOOD BOOSTER ────────────────────────────────────────────────────────────
function showMoodBoost() {
  const pool  = moodBoostMessages.filter((_, i) => i !== lastMoodIndex);
  const idx   = Math.floor(Math.random() * pool.length);
  const msg   = pool[idx];
  lastMoodIndex = moodBoostMessages.indexOf(msg);
  showToast(msg, 'mood');
  burstSparkles(8, '#b86bff');
}

// ─── DISCO ROOM ──────────────────────────────────────────────────────────────
function initDiscoRoom() {
  discoArena.innerHTML  = '';
  emojiCloud.innerHTML  = '';
  visualizer.innerHTML  = '';

  // Visualizer bars
  for (let i = 0; i < 10; i++) {
    const bar = document.createElement('span');
    bar.style.animationDelay = `${(i * 0.09).toFixed(2)}s`;
    visualizer.appendChild(bar);
  }

  // Floating sparks
  for (let i = 0; i < 12; i++) {
    const spark = document.createElement('div');
    spark.className = 'disco-spark';
    spark.style.cssText = `
      left:${5 + i * 8}%;
      top:${20 + Math.sin(i) * 30}%;
      animation-delay:${(i * 0.15).toFixed(2)}s;
      background:hsl(${(i * 30) % 360},90%,70%);
    `;
    discoArena.appendChild(spark);
  }

  // Neon grid lines
  for (let i = 0; i < 5; i++) {
    const line = document.createElement('div');
    line.className = 'disco-grid-line';
    line.style.cssText = `top:${20 + i * 15}%;animation-delay:${i * 0.2}s;`;
    discoArena.appendChild(line);
  }

  // Start visualizer animation
  clearInterval(visualizerInterval);
  visualizerInterval = setInterval(() => {
    visualizer.querySelectorAll('span').forEach(bar => {
      bar.style.height = `${40 + Math.random() * 90}px`;
      bar.style.opacity = `${0.5 + Math.random() * 0.5}`;
    });
  }, 200);
}

function stopDiscoRoom() {
  clearInterval(visualizerInterval);
  stopDiscoMusic();
}

// Simple Web Audio disco music
function startDiscoMusic() {
  if (!window.AudioContext && !window.webkitAudioContext) return;
  if (discoAudioCtx) stopDiscoMusic();
  discoAudioCtx = new (window.AudioContext || window.webkitAudioContext)();

  const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]; // C major scale
  let step = 0;

  function playNote() {
    if (!discoMusicOn) return;
    const osc    = discoAudioCtx.createOscillator();
    const gain   = discoAudioCtx.createGain();
    osc.type     = 'square';
    osc.frequency.setValueAtTime(notes[step % notes.length], discoAudioCtx.currentTime);
    gain.gain.setValueAtTime(0.04, discoAudioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, discoAudioCtx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(discoAudioCtx.destination);
    osc.start();
    osc.stop(discoAudioCtx.currentTime + 0.25);
    step++;
    if (discoMusicOn) setTimeout(playNote, 220);
  }

  discoMusicOn = true;
  playNote();
}

function stopDiscoMusic() {
  discoMusicOn = false;
  if (discoAudioCtx) {
    discoAudioCtx.close().catch(() => {});
    discoAudioCtx = null;
  }
}

function toggleDiscoMusic() {
  if (discoMusicOn) {
    stopDiscoMusic();
    discoToggle.textContent = '🎵 Music Off';
    discoToggle.classList.remove('active');
    showToast('Music stopped 🔇');
  } else {
    startDiscoMusic();
    discoToggle.textContent = '🎵 Music On';
    discoToggle.classList.add('active');
    showToast('Disco music on! 🎶', 'success');
  }
}

// ─── BTS VIBE QUIZ ───────────────────────────────────────────────────────────
function startVibeQuiz() {
  currentQuizIndex = 0;
  selectedAnswer   = null;
  quizAnswers      = [];
  vibeResultCard.classList.add('hidden');
  quizQuestion.parentElement.classList.remove('hidden');
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const total    = quizQuestions.length;
  const question = quizQuestions[currentQuizIndex];

  quizQuestion.textContent           = question.prompt;
  vibeProgress.textContent           = `${currentQuizIndex + 1} / ${total}`;
  vibeProgressBar.style.width        = `${((currentQuizIndex + 1) / total) * 100}%`;

  quizOptionsEl.innerHTML = '';
  selectedAnswer          = null;
  quizNext.disabled       = true;

  question.choices.forEach((choice, i) => {
    const btn = document.createElement('button');
    btn.type      = 'button';
    btn.className = 'quiz-option';
    btn.textContent = choice;
    btn.setAttribute('aria-label', `Option ${i + 1}: ${choice}`);
    btn.addEventListener('click', () => selectQuizOption(btn, i));
    quizOptionsEl.appendChild(btn);
  });
}

function selectQuizOption(btn, index) {
  $$('.quiz-option').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-pressed', 'false');
  });
  btn.classList.add('active');
  btn.setAttribute('aria-pressed', 'true');
  selectedAnswer = index;
  quizNext.disabled = false;
}

function advanceQuiz() {
  if (selectedAnswer === null) return;
  quizAnswers.push(selectedAnswer);
  currentQuizIndex++;
  if (currentQuizIndex >= quizQuestions.length) {
    showQuizResult();
  } else {
    renderQuizQuestion();
  }
}

function showQuizResult() {
  // Tally scores
  const scores = { RM: 0, Jin: 0, SUGA: 0, jhope: 0, Jimin: 0, V: 0, Jungkook: 0 };
  quizAnswers.forEach((answerIdx, qIdx) => {
    const member = quizQuestions[qIdx].match[answerIdx];
    if (member && scores.hasOwnProperty(member)) scores[member]++;
  });
  const winner  = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  const profile = vibeProfiles[winner];

  vibeResultEmoji.textContent       = profile.emoji;
  vibeResultName.textContent        = profile.name;
  vibeResultDesc.textContent        = profile.description;
  vibeResultColor.style.background  = profile.color;

  // Hide question card, show result
  quizQuestion.parentElement.classList.add('hidden');
  vibeResultCard.classList.remove('hidden');
  vibeProgressBar.style.width = '100%';
  vibeProgress.textContent    = `${quizQuestions.length} / ${quizQuestions.length}`;

  launchConfetti();
  showToast(`Your vibe is ${profile.name}! 💜`, 'success');
}

// ─── EVENT LISTENERS ─────────────────────────────────────────────────────────
function initEventListeners() {
  // Landing: YES
  yesButton.addEventListener('click', () => {
    navigateTo('dashboardScreen');
  });

  // Dashboard cards
  $$('.dashboard-grid .glass-card').forEach(card => {
    card.addEventListener('click', () => {
      const target = card.dataset.target;
      if (!target) return;
      const inits = {
        lyricsScreen: startLyricsGame,
        roastScreen:  loadRoast,
        discoScreen:  initDiscoRoom,
        vibeScreen:   startVibeQuiz
      };
      navigateTo(target, inits[target]);
    });
    // Keyboard support
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
    });
  });

  // Mood Booster
  moodBoosterBtn.addEventListener('click', showMoodBoost);
  attachRipple(moodBoosterBtn);

  // Back buttons
  $$('.back-button').forEach(btn => {
    btn.addEventListener('click', () => {
      if (discoScreen.classList.contains('active')) stopDiscoRoom();
      navigateTo('dashboardScreen');
    });
    attachRipple(btn);
  });

  // Lyrics
  lyricsSubmit.addEventListener('click', submitLyricAnswer);
  lyricsSkip.addEventListener('click', skipLyricQuestion);
  lyricsRestart.addEventListener('click', startLyricsGame);
  lyricsAnswer.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitLyricAnswer();
  });
  [lyricsSubmit, lyricsSkip, lyricsRestart].forEach(attachRipple);

  // Roast
  generateRoast.addEventListener('click', loadRoast);
  copyRoast.addEventListener('click', copyCurrentRoast);
  [generateRoast, copyRoast].forEach(attachRipple);

  // Disco
  discoArena.addEventListener('click', (e) => {
    triggerDiscoBurst(e.clientX, e.clientY);
  });
  discoArena.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    triggerDiscoBurst(touch.clientX, touch.clientY);
  }, { passive: false });
  discoToggle.addEventListener('click', toggleDiscoMusic);
  attachRipple(discoToggle);

  // Quiz
  quizNext.addEventListener('click', advanceQuiz);
  quizRestart.addEventListener('click', startVibeQuiz);
  [quizNext, quizRestart].forEach(attachRipple);
}

// ─── BOOT ────────────────────────────────────────────────────────────────────
function initApp() {
  // Set initial aria states
  $$('.screen').forEach(s => s.setAttribute('aria-hidden', 'true'));
  landingScreen.setAttribute('aria-hidden', 'false');
  landingScreen.classList.add('active');

  initNoButton();
  initEventListeners();
  createFloatingParticles(sparkleZone, 28, '#b86bff');
}

initApp();
