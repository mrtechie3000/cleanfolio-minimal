/* ===========================
   TRON PORTFOLIO — script.js
=========================== */

// ---- GRID CANVAS ----
const canvas = document.getElementById('grid-canvas');
const ctx = canvas.getContext('2d');

let W, H;

function resizeCanvas() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Perspective grid (bottom-vanishing-point style)
function drawGrid() {
  ctx.clearRect(0, 0, W, H);

  const vx = W / 2;
  const vy = H * 0.55; // vanishing point
  const lineColor = 'rgba(0, 200, 255, 0.06)';
  const horizColor = 'rgba(0, 200, 255, 0.09)';

  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1;

  // Vertical perspective lines radiating from vanishing point
  const numLines = 22;
  for (let i = 0; i <= numLines; i++) {
    const x = (W / numLines) * i;
    ctx.beginPath();
    ctx.moveTo(vx, vy);
    ctx.lineTo(x, H);
    ctx.stroke();
  }

  // Horizontal lines (parallels below vanishing point)
  const numHoriz = 14;
  for (let i = 0; i <= numHoriz; i++) {
    const t = i / numHoriz;
    const y = vy + (H - vy) * (t * t); // quadratic spacing for perspective
    ctx.strokeStyle = horizColor;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  // Faint flat grid above vanishing point
  const gridSize = 80;
  ctx.strokeStyle = 'rgba(0, 200, 255, 0.025)';
  for (let x = 0; x < W; x += gridSize) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, vy); ctx.stroke();
  }
  for (let y = 0; y < vy; y += gridSize) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Glowing horizon line
  const grad = ctx.createLinearGradient(0, vy, W, vy);
  grad.addColorStop(0, 'transparent');
  grad.addColorStop(0.3, 'rgba(0, 240, 255, 0.25)');
  grad.addColorStop(0.5, 'rgba(0, 240, 255, 0.5)');
  grad.addColorStop(0.7, 'rgba(0, 240, 255, 0.25)');
  grad.addColorStop(1, 'transparent');
  ctx.strokeStyle = grad;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, vy);
  ctx.lineTo(W, vy);
  ctx.stroke();
}

// Particles (light cycles / data bits)
const particles = [];
const NUM_PARTICLES = 28;

for (let i = 0; i < NUM_PARTICLES; i++) {
  particles.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6,
    size: Math.random() * 2 + 0.5,
    alpha: Math.random() * 0.5 + 0.1,
    color: Math.random() > 0.85 ? '#ff6b00' : '#00f0ff',
    trail: [],
    maxTrail: Math.floor(Math.random() * 20 + 8),
  });
}

function drawParticles() {
  particles.forEach(p => {
    p.trail.push({ x: p.x, y: p.y });
    if (p.trail.length > p.maxTrail) p.trail.shift();

    // Draw trail
    for (let i = 0; i < p.trail.length - 1; i++) {
      const alpha = (i / p.trail.length) * p.alpha * 0.6;
      ctx.strokeStyle = p.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba').replace('#00f0ff', `rgba(0,240,255,${alpha})`).replace('#ff6b00', `rgba(255,107,0,${alpha})`);
      ctx.lineWidth = p.size * 0.5;
      ctx.beginPath();
      ctx.moveTo(p.trail[i].x, p.trail[i].y);
      ctx.lineTo(p.trail[i + 1].x, p.trail[i + 1].y);
      ctx.stroke();
    }

    // Draw head glow
    const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
    const col = p.color === '#ff6b00' ? '255,107,0' : '0,240,255';
    grd.addColorStop(0, `rgba(${col},${p.alpha})`);
    grd.addColorStop(1, `rgba(${col},0)`);
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
    ctx.fill();

    // Move
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0) p.x = W;
    if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H;
    if (p.y > H) p.y = 0;
  });
}

let frameCount = 0;
function animate() {
  frameCount++;
  ctx.clearRect(0, 0, W, H);
  drawGrid();
  drawParticles();
  requestAnimationFrame(animate);
}
animate();

// ---- HAMBURGER NAV ----
const hamburger = document.querySelector('.btn--hamburger');
const navList = document.querySelector('.nav__list');

if (hamburger && navList) {
  hamburger.addEventListener('click', () => {
    navList.classList.toggle('open');
    const icon = hamburger.querySelector('i');
    if (navList.classList.contains('open')) {
      icon.classList.replace('fa-bars', 'fa-times');
    } else {
      icon.classList.replace('fa-times', 'fa-bars');
    }
  });

  // Close nav on link click
  navList.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('open');
      const icon = hamburger.querySelector('i');
      icon.classList.replace('fa-times', 'fa-bars');
    });
  });
}

// ---- SCROLL TO TOP BUTTON ----
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    scrollTopBtn.style.display = 'flex';
  } else {
    scrollTopBtn.style.display = 'none';
  }
});

// ---- GLITCH EFFECT ON NAME ----
const nameEl = document.querySelector('.about__name');
if (nameEl) {
  setInterval(() => {
    if (Math.random() > 0.92) {
      nameEl.style.textShadow = `
        2px 0 #ff0066,
        -2px 0 #00f0ff,
        0 0 20px var(--cyan)
      `;
      nameEl.style.transform = `skewX(${(Math.random() - 0.5) * 3}deg)`;
      setTimeout(() => {
        nameEl.style.textShadow = '0 0 20px var(--cyan), 0 0 60px rgba(0, 240, 255, 0.3)';
        nameEl.style.transform = 'none';
      }, 80);
    }
  }, 2500);
}

// ---- SECTION REVEAL ON SCROLL ----
const sections = document.querySelectorAll('.section');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

sections.forEach(s => {
  s.style.opacity = '0';
  s.style.transform = 'translateY(30px)';
  s.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  revealObserver.observe(s);
});

// ---- TYPING EFFECT FOR ROLE ----
const roleEl = document.querySelector('.about__role');
if (roleEl) {
  const text = 'TYPICAL DEVELOPER';
  roleEl.textContent = '';
  let i = 0;
  const typeRole = () => {
    if (i < text.length) {
      roleEl.textContent += text[i++];
      setTimeout(typeRole, 80);
    }
  };
  setTimeout(typeRole, 1200);
}
