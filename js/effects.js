/**
 * effects.js — Visual effects and animations
 * Floating particles, sparkle bursts, confetti, ripple effects
 */

// ─── FLOATING PARTICLES ──────────────────────────────────────────────────────
function createFloatingParticles(container, amount, color) {
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < amount; i++) {
    const p = document.createElement('div');
    p.className = 'floating-particle';
    const size = Math.random() * 5 + 3;
    p.style.cssText = `
      width:${size}px;
      height:${size}px;
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      background:${color};
      opacity:${(Math.random() * 0.3 + 0.1).toFixed(2)};
      animation-duration:${(Math.random() * 9 + 7).toFixed(1)}s;
      animation-delay:${(Math.random() * 5).toFixed(1)}s;
    `;
    container.appendChild(p);
  }
}

// ─── SPARKLE BURST ───────────────────────────────────────────────────────────
function burstSparkles(amount = 12, color = '#c639ff', cx, cy) {
  const centerX = cx ?? window.innerWidth / 2;
  const centerY = cy ?? window.innerHeight / 2;
  for (let i = 0; i < amount; i++) {
    const s = document.createElement('div');
    s.className = 'sparkle-burst';
    const angle = (i / amount) * 360;
    const dist = 40 + Math.random() * 60;
    const rad = (angle * Math.PI) / 180;
    const x = centerX + Math.cos(rad) * dist;
    const y = centerY + Math.sin(rad) * dist;
    s.style.cssText = `left:${x}px;top:${y}px;background:${color};`;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 800);
  }
}

// ─── CONFETTI ────────────────────────────────────────────────────────────────
function launchConfetti(duration = 2200) {
  const colors = ['#c639ff', '#5de2ff', '#ff7094', '#b1d780', '#ffdd57', '#a78bfa'];
  const total = 80;
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:999;';
  document.body.appendChild(container);

  for (let i = 0; i < total; i++) {
    const piece = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 8 + 5;
    const isRect = Math.random() > 0.5;
    piece.style.cssText = `
      position:absolute;
      left:${Math.random() * 100}%;
      top:-${size * 2}px;
      width:${size}px;
      height:${isRect ? size * 0.4 : size}px;
      background:${color};
      border-radius:${isRect ? '2px' : '50%'};
      opacity:1;
      transform:rotate(${Math.random() * 360}deg);
      animation:confettiFall ${(Math.random() * 1.5 + 1.2).toFixed(2)}s ${(Math.random() * 0.8).toFixed(2)}s ease-in forwards;
    `;
    container.appendChild(piece);
  }

  // inject keyframes once
  if (!document.getElementById('confettiStyle')) {
    const style = document.createElement('style');
    style.id = 'confettiStyle';
    style.textContent = `
      @keyframes confettiFall {
        0%   { transform: translateY(0) rotate(0deg);   opacity: 1; }
        80%  { opacity: 1; }
        100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  setTimeout(() => container.remove(), duration + 500);
}

// ─── BUTTON RIPPLE ───────────────────────────────────────────────────────────
function attachRipple(button) {
  if (!button) return;
  button.addEventListener('pointerdown', (e) => {
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'btn-ripple';
    const size = Math.max(rect.width, rect.height) * 2;
    ripple.style.cssText = `
      width:${size}px;
      height:${size}px;
      left:${e.clientX - rect.left - size / 2}px;
      top:${e.clientY - rect.top - size / 2}px;
    `;
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
}

// ─── SCREEN TRANSITION ───────────────────────────────────────────────────────
function showWebTransition(callback) {
  const webShell = document.getElementById('webShell');
  const pageOverlay = document.getElementById('pageOverlay');
  webShell.innerHTML = '';
  const count = 8;
  for (let i = 0; i < count; i++) {
    const line = document.createElement('div');
    line.className = 'web-line';
    line.style.transform = `translate(-50%, -50%) rotate(${i * 22.5}deg)`;
    webShell.appendChild(line);
  }
  webShell.classList.add('active');
  pageOverlay.style.pointerEvents = 'all';
  setTimeout(() => {
    if (typeof callback === 'function') callback();
    webShell.classList.remove('active');
    setTimeout(() => { pageOverlay.style.pointerEvents = 'none'; }, 450);
  }, 550);
}

// ─── TOAST ───────────────────────────────────────────────────────────────────
let toastTimer = null;
function showToast(message, type = 'default') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast show toast--${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

// ─── DISCO BURST ─────────────────────────────────────────────────────────────
function triggerDiscoBurst(x, y) {
  const emojiCloud = document.getElementById('emojiCloud');
  const burst = document.createElement('div');
  burst.className = 'disco-burst';
  burst.style.left = `${x}px`;
  burst.style.top = `${y}px`;
  document.body.appendChild(burst);
  setTimeout(() => burst.remove(), 700);

  const emojis = ['💜', '✨', '🎉', '🌟', '🕺', '🪩', '🎵', '🔮', '⚡', '🌈'];
  for (let i = 0; i < 5; i++) {
    const em = document.createElement('div');
    em.className = 'emoji-pop';
    em.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    const offsetX = (Math.random() - 0.5) * 100;
    const offsetY = (Math.random() - 0.5) * 100;
    em.style.cssText = `left:${x + offsetX}px;top:${y + offsetY}px;`;
    if (emojiCloud) emojiCloud.appendChild(em);
    setTimeout(() => em.remove(), 1500);
  }

  // Randomize disco colors
  const hue = Math.floor(Math.random() * 360);
  document.querySelector('.disco-arena').style.setProperty('--flash-hue', hue);
}
