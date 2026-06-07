function createFloatingParticles(container, amount, color) {
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < amount; i += 1) {
    const particle = document.createElement('div');
    particle.className = 'floating-particle';
    const size = Math.random() * 6 + 4;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.background = color;
    particle.style.opacity = `${Math.random() * 0.35 + 0.15}`;
    particle.style.animationDuration = `${Math.random() * 8 + 6}s`;
    container.appendChild(particle);
  }
}

function burstSparkles(amount = 10, color = '#c639ff') {
  for (let i = 0; i < amount; i += 1) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle-burst';
    sparkle.style.left = `${50 + (Math.random() - 0.5) * 120}%`;
    sparkle.style.top = `${50 + (Math.random() - 0.5) * 60}%`;
    sparkle.style.background = color;
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 800);
  }
}
