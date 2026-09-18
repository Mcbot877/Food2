import confetti from 'canvas-confetti';

export function triggerCartParticleBurst(x?: number, y?: number) {
  const originX = x ? x / window.innerWidth : 0.85;
  const originY = y ? y / window.innerHeight : 0.15;

  confetti({
    particleCount: 35,
    spread: 55,
    origin: { x: originX, y: originY },
    colors: ['#F59E0B', '#FBBF24', '#10B981', '#FFFFFF', '#FB923C'],
    ticks: 150,
    gravity: 1.2,
    scalar: 0.8,
    shapes: ['circle', 'square'],
  });
}

export function triggerCelebrationConfetti() {
  confetti({
    particleCount: 90,
    spread: 80,
    origin: { x: 0.5, y: 0.5 },
    colors: ['#F59E0B', '#E11D48', '#10B981', '#38BDF8', '#FBBF24'],
  });
}
