/**
 * Khalid Imran Portfolio · script.js
 * Clean, production-quality vanilla JavaScript — zero dependencies
 */

'use strict';

/* ══════════════════════════════════════════════
   1. PAGE LOADER
══════════════════════════════════════════════ */
const loader = document.getElementById('loader');

window.addEventListener('load', () => {
  document.body.style.overflow = '';
  setTimeout(() => loader.classList.add('out'), 1300);
});

document.body.style.overflow = 'hidden';

/* ══════════════════════════════════════════════
   2. CUSTOM CURSOR
══════════════════════════════════════════════ */
(function initCursor() {
  const dot  = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring || 'ontouchstart' in window) {
    dot && dot.remove(); ring && ring.remove(); return;
  }

  let rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    dot.style.left = e.clientX + 'px';
    dot.style.top  = e.clientY + 'px';
    rx += (e.clientX - rx) * 0.14;
    ry += (e.clientY - ry) * 0.14;
  });

  (function lerpRing() {
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(lerpRing);
  })();

  const TARGETS = 'a, button, .skill-card, .proj-card, .stat-item, .filter-btn';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(TARGETS)) {
      dot.style.transform  = 'translate(-50%,-50%) scale(2.5)';
      dot.style.opacity    = '0.4';
      ring.style.transform = 'translate(-50%,-50%) scale(1.6)';
      ring.style.borderColor = 'rgba(45,244,192,0.8)';
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(TARGETS)) {
      dot.style.transform  = 'translate(-50%,-50%) scale(1)';
      dot.style.opacity    = '1';
      ring.style.transform = 'translate(-50%,-50%) scale(1)';
      ring.style.borderColor = 'rgba(45,244,192,0.5)';
    }
  });
})();

/* ══════════════════════════════════════════════
   3. BACKGROUND CANVAS — subtle particle field
══════════════════════════════════════════════ */
(function initCanvas() {
  const cv = document.getElementById('bg-canvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  let W, H;

  function resize() { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const DOTS = Array.from({ length: 60 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * 1.4 + 0.3,
    vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2,
    a: Math.random() * 0.22 + 0.04,
  }));

  (function draw() {
    ctx.clearRect(0, 0, W, H);
    DOTS.forEach(d => {
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
      if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(45,244,192,${d.a})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  })();
})();

/* ══════════════════════════════════════════════
   4. NAVBAR — scroll state + mobile menu + active
══════════════════════════════════════════════ */
(function initNavbar() {
  const nav    = document.getElementById('navbar');
  const ham    = document.getElementById('hamburger');
  const menu   = document.getElementById('nav-links');
  const links  = document.querySelectorAll('.nav-link');
  const sects  = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);

    // Active link
    let cur = '';
    sects.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + cur));
  }, { passive: true });

  ham && ham.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    ham.classList.toggle('open', open);
    ham.setAttribute('aria-expanded', open);
  });

  menu && menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      ham.classList.remove('open');
    });
  });
})();

/* ══════════════════════════════════════════════
   5. SCROLL PROGRESS BAR
══════════════════════════════════════════════ */
(function initProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    bar.style.width = (pct * 100) + '%';
  }, { passive: true });
})();

/* ══════════════════════════════════════════════
   6. TYPING ANIMATION
══════════════════════════════════════════════ */
(function initTyping() {
  const el = document.getElementById('typed');
  if (!el) return;

  const WORDS = [
    'Flutter apps.',
    'beautiful mobile UIs.',
    'Firebase backends.',
    'REST API clients.',
    'cross-platform apps.',
    'clean, readable code.',
  ];

  let wi = 0, ci = 0, deleting = false, pause = 0;

  function tick() {
    if (pause-- > 0) { setTimeout(tick, 80); return; }
    const word = WORDS[wi];
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; pause = 28; }
      setTimeout(tick, 80);
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % WORDS.length; pause = 10; }
      setTimeout(tick, 40);
    }
  }

  setTimeout(tick, 1600);
})();

/* ══════════════════════════════════════════════
   7. SECTION HEADER REVEAL
══════════════════════════════════════════════ */
(function initSecHeaders() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.sec-eyebrow, .sec-title').forEach(el => io.observe(el));
})();

/* ══════════════════════════════════════════════
   8. GENERAL SCROLL REVEAL
══════════════════════════════════════════════ */
(function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const delay = parseInt(e.target.dataset.delay) || 0;
      setTimeout(() => e.target.classList.add('in'), delay);
      io.unobserve(e.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
})();

/* ══════════════════════════════════════════════
   9. ANIMATED STAT COUNTERS
══════════════════════════════════════════════ */
(function initCounters() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = parseInt(el.dataset.count);
      const dur = 1600;
      const step = 16;
      const inc = end / (dur / step);
      let val = 0;
      const timer = setInterval(() => {
        val += inc;
        if (val >= end) {
          el.textContent = end + (end === 100 ? '%' : '+');
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(val);
        }
      }, step);
      io.unobserve(el);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.stat-n[data-count]').forEach(el => io.observe(el));
})();

/* ══════════════════════════════════════════════
   10. SKILL BAR ANIMATION
══════════════════════════════════════════════ */
(function initSkillBars() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const bar = e.target;
      const delay = parseInt(bar.closest('[data-delay]')?.dataset.delay) || 0;
      setTimeout(() => { bar.style.width = bar.dataset.w + '%'; }, delay + 200);
      io.unobserve(bar);
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.sk-bar[data-w]').forEach(b => io.observe(b));
})();

/* ══════════════════════════════════════════════
   11. PROJECT FILTER
══════════════════════════════════════════════ */
(function initFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.proj-card[data-cat]');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const cats = card.dataset.cat || '';
        const show = filter === 'all' || cats.includes(filter);
        card.style.transition = 'opacity 0.3s, transform 0.3s';
        if (show) {
          card.style.display = '';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = '';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });
})();

/* ══════════════════════════════════════════════
   12. CARD TILT on hover
══════════════════════════════════════════════ */
(function initTilt() {
  if ('ontouchstart' in window) return;

  document.querySelectorAll('.proj-card, .skill-card, .edu-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const rx = ((e.clientY - cy) / (r.height / 2)) * 2.5;
      const ry = ((e.clientX - cx) / (r.width  / 2)) * -2.5;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px) translateZ(8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ══════════════════════════════════════════════
   13. SMOOTH SCROLL
══════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = target.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});

/* ══════════════════════════════════════════════
   14. CONTACT FORM — simulated send
══════════════════════════════════════════════ */
(function initForm() {
  const form  = document.getElementById('contact-form');
  const btn   = document.getElementById('send-btn');
  const label = document.getElementById('send-label');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    btn.disabled = true;
    label.textContent = 'Sending…';

    // ── Replace this delay with your real API / EmailJS / Formspree call ──
    await new Promise(r => setTimeout(r, 1400));
    // ────────────────────────────────────────────────────────────────────

    label.textContent = '✓ Sent!';
    btn.style.background = '#0f9488';
    btn.style.boxShadow  = 'none';

    setTimeout(() => {
      form.reset();
      label.textContent = 'Send Message';
      btn.style.background = '';
      btn.style.boxShadow  = '';
      btn.disabled = false;
    }, 3500);
  });
})();