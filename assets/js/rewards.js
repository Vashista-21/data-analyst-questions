/* Scoring, levels, badges and the on-screen celebration effects. */
window.DAQ = window.DAQ || {};

DAQ.rewards = (function () {
  const BASE_POINTS = { easy: 10, medium: 20, hard: 30 };
  const PARTIAL_SHARE = 0.4;
  const STREAK_BONUS_PER = 2;
  const STREAK_BONUS_CAP = 20;
  const POINTS_PER_LEVEL = 150;

  const BADGES = [
    { id: 'first-solve', emoji: '\uD83C\uDFAF', name: 'First Answer', desc: 'Answer one question correctly' },
    { id: 'streak-5', emoji: '\uD83D\uDD25', name: 'On Fire', desc: '5 correct answers in a row' },
    { id: 'streak-10', emoji: '\u26A1', name: 'Unstoppable', desc: '10 correct answers in a row' },
    { id: 'hard-5', emoji: '\uD83E\uDDE0', name: 'Deep End', desc: 'Crack 5 hard questions' },
    { id: 'points-500', emoji: '\uD83D\uDC8E', name: '500 Club', desc: 'Earn 500 points' },
    { id: 'points-1500', emoji: '\uD83D\uDC51', name: 'Interview Ready', desc: 'Earn 1500 points' },
    { id: 'all-rounder', emoji: '\uD83C\uDF10', name: 'All Rounder', desc: 'Score in every topic' }
  ];

  function basePoints(difficulty, verdict) {
    const base = BASE_POINTS[difficulty] || 10;
    if (verdict === 'correct') return base;
    if (verdict === 'partial') return Math.round(base * PARTIAL_SHARE);
    return 0;
  }

  function streakBonus(streak, verdict) {
    if (verdict !== 'correct') return 0;
    return Math.min(streak * STREAK_BONUS_PER, STREAK_BONUS_CAP);
  }

  function levelInfo(points) {
    const level = Math.floor(points / POINTS_PER_LEVEL) + 1;
    const into = points % POINTS_PER_LEVEL;
    return { level: level, into: into, need: POINTS_PER_LEVEL, percent: (into / POINTS_PER_LEVEL) * 100 };
  }

  function badgeMeta(id) {
    const known = BADGES.find((badge) => badge.id === id);
    if (known) return known;
    return { id: id, emoji: '\uD83C\uDFC5', name: id, desc: '' };
  }

  function catalogue(topics) {
    const dynamic = (topics || []).map((topic) => ({
      id: 'topic-' + topic.id,
      emoji: topic.icon || '\uD83C\uDFC5',
      name: topic.name + ' Cleared',
      desc: 'Answer all ' + (topic.questions ? topic.questions.length : 0) + ' ' + topic.name + ' questions correctly'
    }));
    return BADGES.concat(dynamic);
  }

  /* ---------------- effects ---------------- */

  function toast(message, tone) {
    const stack = document.getElementById('toast-stack');
    if (!stack) return;
    const node = document.createElement('div');
    node.className = 'toast' + (tone ? ' ' + tone : '');
    node.textContent = message;
    stack.appendChild(node);
    setTimeout(() => {
      node.classList.add('leaving');
      setTimeout(() => node.remove(), 320);
    }, 2600);
  }

  function pointsPop(amount, anchor) {
    const node = document.createElement('div');
    node.className = 'points-pop';
    node.textContent = '+' + amount;
    const rect = anchor && anchor.getBoundingClientRect ? anchor.getBoundingClientRect() : null;
    node.style.left = (rect ? rect.left + rect.width / 2 : window.innerWidth / 2) + 'px';
    node.style.top = (rect ? rect.top - 10 : window.innerHeight / 2) + 'px';
    document.body.appendChild(node);
    setTimeout(() => node.remove(), 1200);
  }

  const confetti = (function () {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    let particles = [];
    let running = false;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function frame() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter((p) => p.life > 0);
      particles.forEach((p) => {
        p.life -= 1;
        p.vy += 0.12;
        p.x += p.vx;
        p.y += p.vy;
        p.spin += p.spinSpeed;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.spin);
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 40));
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });
      if (particles.length) {
        requestAnimationFrame(frame);
      } else {
        running = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    function burst(count) {
      if (!ctx) return;
      resize();
      const colors = ['#6c8bff', '#35d39a', '#ffd166', '#ff6b81', '#a06bff', '#ffffff'];
      const originX = canvas.width / 2;
      const originY = canvas.height * 0.32;
      for (let i = 0; i < (count || 90); i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 7;
        particles.push({
          x: originX + (Math.random() - 0.5) * 120,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 3,
          size: 6 + Math.random() * 7,
          color: colors[Math.floor(Math.random() * colors.length)],
          spin: Math.random() * Math.PI,
          spinSpeed: (Math.random() - 0.5) * 0.3,
          life: 70 + Math.random() * 45
        });
      }
      if (!running) {
        running = true;
        requestAnimationFrame(frame);
      }
    }

    window.addEventListener('resize', resize);
    resize();
    return { burst };
  })();

  return {
    BASE_POINTS, basePoints, streakBonus, levelInfo, badgeMeta, catalogue,
    toast, pointsPop, confetti
  };
})();
