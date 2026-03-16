// ===========================================
//  PORTFOLIO — Riantsoa RAMANAMPAMONJY
//  main.js — 2026
// ===========================================

// ── Particle Canvas ──────────────────────────────────────────────
(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : (Math.random() > 0.5 ? 0 : H);
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.r  = Math.random() * 1.8 + 0.4;
      this.a  = Math.random() * 0.45 + 0.08;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56,189,248,${this.a})`;
      ctx.fill();
    }
  }

  function drawLines() {
    const D = 130;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.hypot(dx, dy);
        if (d < D) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(56,189,248,${0.07 * (1 - d / D)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function init() {
    resize();
    // Réduire le nombre de particules sur mobile pour les performances
    const count = window.innerWidth < 768 ? 30 : 80;
    particles = Array.from({ length: count }, () => new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); particles.forEach(p => p.reset(true)); });
  init();
  loop();
})();

// ── Typed Text ───────────────────────────────────────────────────
(function () {
  const el = document.getElementById('typedText');
  if (!el) return;

  const lines = [
    'Développeur Full-Stack motivé',
    'Backend & Frontend efficace',
    'API REST & intégration',
    'TypeScript appliqué',
    'Agile / Scrum en pratique',
    'Ouvert aux nouvelles opportunités',
  ];

  let li = 0, ci = 0, del = false;
  const SPEED = 60, DEL = 35, PAUSE = 2400;

  function tick() {
    const cur = lines[li];
    if (!del) {
      el.textContent = cur.slice(0, ++ci);
      if (ci === cur.length) { del = true; setTimeout(tick, PAUSE); return; }
    } else {
      el.textContent = cur.slice(0, --ci);
      if (ci === 0) { del = false; li = (li + 1) % lines.length; }
    }
    setTimeout(tick, del ? DEL : SPEED);
  }
  setTimeout(tick, 900);
})();

// ── Navigation ───────────────────────────────────────────────────
const nav       = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

// { passive: true } évite l'avertissement de performance navigateur
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
  updateActiveNav();
}, { passive: true });

hamburger?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('open');
});

navLinks?.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  })
);

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav__link');
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 130) current = s.id; });
  links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${current}`));
}

// ── Scroll Reveal ────────────────────────────────────────────────
const observer = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── Project Filters ──────────────────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('filter-btn--active'));
    btn.classList.add('filter-btn--active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      card.classList.toggle('hidden', f !== 'all' && card.dataset.category !== f);
    });
  });
});

// ── Contact Form (Formspree) ──────────────────────────────────────
//
// CONFIGURATION :
//   1. Créez un compte gratuit sur https://formspree.io
//   2. Cliquez "New Form", entrez votre email de destination
//   3. Copiez l'ID du formulaire (ex: "xabcde12") et remplacez YOUR_FORM_ID ci-dessous
//
const FORMSPREE_ID = 'mjgaayoy';

function showFormStatus(type, msg) {
  const el = document.getElementById('formStatus');
  if (!el) return;
  el.className = `form-status form-status--${type}`;
  el.textContent = msg;
  el.style.display = 'block';
}

function clearFormStatus() {
  const el = document.getElementById('formStatus');
  if (!el) return;
  el.style.display = 'none';
  el.textContent = '';
  el.className = 'form-status';
}

document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const btn  = form.querySelector('button[type="submit"]');

  // Validation côté client
  const name    = form.name.value.trim();
  const email   = form.email.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !message) {
    showFormStatus('error', 'Veuillez remplir tous les champs obligatoires (Nom, Email, Message).');
    return;
  }
  if (message.length < 10) {
    showFormStatus('error', 'Votre message doit contenir au moins 10 caractères.');
    return;
  }

  const orig = btn.innerHTML;
  btn.innerHTML = '⏳ Envoi en cours…';
  btn.disabled = true;
  clearFormStatus();

  // Formulaire non configuré → message d'erreur explicite
  if (FORMSPREE_ID === 'YOUR_FORM_ID') {
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.disabled = false;
      showFormStatus('error',
        'Le formulaire n\'est pas encore configuré. Contactez-moi directement : lahatrariantsoaa@gmail.com');
    }, 500);
    return;
  }

  try {
    const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name:    form.name.value,
        email:   form.email.value,
        subject: form.subject?.value || '(sans sujet)',
        message: form.message.value,
      }),
    });

    if (response.ok) {
      btn.innerHTML = '✓ Message envoyé !';
      // Utiliser la valeur hex directe (les variables CSS ne fonctionnent pas en style inline JS)
      btn.style.background = '#34d399';
      btn.style.color = '#070b14';
      showFormStatus('success',
        'Merci ! Votre message a bien été envoyé. Je vous répondrai dans les plus brefs délais.');
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.background = '';
        btn.style.color = '';
        btn.disabled = false;
        form.reset();
        clearFormStatus();
      }, 5000);
    } else {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || 'Réponse serveur invalide');
    }
  } catch (err) {
    btn.innerHTML = orig;
    btn.disabled = false;
    showFormStatus('error',
      'Une erreur est survenue. Réessayez ou contactez-moi directement : lahatrariantsoaa@gmail.com');
  }
});

// ── Hero scroll arrow ────────────────────────────────────────────
document.querySelector('.hero__scroll')?.addEventListener('click', () =>
  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
);
