// ── THEME TOGGLE ──
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

// ── HAMBURGER MENU ──
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 50;
  const style = getComputedStyle(html);
  navbar.style.background = scrolled
    ? style.getPropertyValue('--navbar-bg-scrolled').trim()
    : style.getPropertyValue('--navbar-bg').trim();
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + e.target.id
          ? 'var(--primary)' : '';
      });
    }
  });
}, { threshold: 0.35 });
sections.forEach(s => observer.observe(s));

// Animate elements on scroll
const reveal = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      reveal.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.skill-category, .project-card, .edu-card, .cert-card, .contact-card, .timeline-card, .stat-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  reveal.observe(el);
});

// Inject visible style
const style = document.createElement('style');
style.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(style);

// Staggered animation for grids
document.querySelectorAll('.skills-grid, .projects-grid, .edu-grid, .certs-grid').forEach(grid => {
  [...grid.children].forEach((child, i) => {
    child.style.transitionDelay = (i * 0.08) + 's';
  });
});

// Particles background
const canvas = document.createElement('canvas');
canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:0;opacity:0.35';
document.body.prepend(canvas);
const ctx = canvas.getContext('2d');
let W, H, particles = [];
function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);

for (let i = 0; i < 60; i++) {
  particles.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.5 + 0.3,
    dx: (Math.random() - 0.5) * 0.3,
    dy: (Math.random() - 0.5) * 0.3,
    o: Math.random() * 0.5 + 0.1
  });
}

function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(108,99,255,${p.o})`;
    ctx.fill();
    p.x += p.dx; p.y += p.dy;
    if (p.x < 0 || p.x > W) p.dx *= -1;
    if (p.y < 0 || p.y > H) p.dy *= -1;
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

// Typing effect for hero role
const roles = ['Data Analytics & AI', 'Machine Learning', 'Flutter Developer', 'Problem Solver'];
let rIdx = 0, cIdx = 0, deleting = false;
const roleEl = document.querySelector('.hero-role');
function typeRole() {
  const current = roles[rIdx];
  if (deleting) {
    cIdx--;
  } else {
    cIdx++;
  }
  roleEl.innerHTML = current.slice(0, cIdx) + '<span class="accent">&</span>'.slice(0, Math.max(0, cIdx - (current.indexOf('&') > -1 ? current.indexOf('&') : 9999)));
  roleEl.textContent = current.slice(0, cIdx);
  if (!deleting && cIdx === current.length) {
    setTimeout(() => deleting = true, 2000);
  } else if (deleting && cIdx === 0) {
    deleting = false;
    rIdx = (rIdx + 1) % roles.length;
  }
  setTimeout(typeRole, deleting ? 50 : 100);
}
// Only run typing if element exists
if (roleEl) setTimeout(typeRole, 1500);

// Counter animation for stats
function animateCounter(el, target, suffix = '') {
  let current = 0;
  const step = target / 60;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = (Number.isInteger(target) ? Math.floor(current) : current.toFixed(2)) + suffix;
  }, 16);
}
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.stat-number').forEach(el => {
        const val = el.textContent;
        if (val.includes('.')) animateCounter(el, parseFloat(val));
        else if (val.includes('+')) animateCounter(el, parseInt(val), '+');
        else animateCounter(el, parseInt(val));
      });
      statsObserver.disconnect();
    }
  });
});
const statsEl = document.querySelector('.hero-stats');
if (statsEl) statsObserver.observe(statsEl);
