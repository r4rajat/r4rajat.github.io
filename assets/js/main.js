(function () {
  'use strict';

  const docEl = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -----------------------------------------------------------------------
     Theme toggle
     -----------------------------------------------------------------------*/
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const setPressed = () => {
      themeToggle.setAttribute('aria-pressed', docEl.dataset.theme === 'light' ? 'true' : 'false');
    };
    setPressed();

    themeToggle.addEventListener('click', () => {
      const next = docEl.dataset.theme === 'light' ? 'dark' : 'light';
      docEl.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
      setPressed();
    });
  }

  /* -----------------------------------------------------------------------
     Footer year
     -----------------------------------------------------------------------*/
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -----------------------------------------------------------------------
     Sticky-nav scroll state
     -----------------------------------------------------------------------*/
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* -----------------------------------------------------------------------
     Mobile menu
     -----------------------------------------------------------------------*/
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    const closeMenu = () => {
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open menu');
      mobileMenu.hidden = true;
      document.body.style.overflow = '';
    };
    const openMenu = () => {
      hamburger.classList.add('is-open');
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.setAttribute('aria-label', 'Close menu');
      mobileMenu.hidden = false;
      document.body.style.overflow = 'hidden';
    };
    hamburger.addEventListener('click', () => {
      mobileMenu.hidden ? openMenu() : closeMenu();
    });
    mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mobileMenu.hidden) closeMenu();
    });
  }

  /* -----------------------------------------------------------------------
     Rotating role text
     -----------------------------------------------------------------------*/
  const ROLES = ['Developer', 'Gopher', 'k8s Enthusiast', 'RPA Enthusiast'];
  const rotatingEl = document.getElementById('rotating-role');
  if (rotatingEl && !reduced) {
    let roleIdx = 0;
    let charIdx = 0;
    let deleting = false;

    const tick = () => {
      const word = ROLES[roleIdx];
      if (!deleting) {
        rotatingEl.textContent = word.slice(0, ++charIdx);
        if (charIdx === word.length) {
          deleting = true;
          return setTimeout(tick, 1800);
        }
      } else {
        rotatingEl.textContent = word.slice(0, --charIdx);
        if (charIdx === 0) {
          deleting = false;
          roleIdx = (roleIdx + 1) % ROLES.length;
          return setTimeout(tick, 240);
        }
      }
      setTimeout(tick, deleting ? 40 : 90);
    };
    tick();
  }

  /* -----------------------------------------------------------------------
     Section reveal on scroll. We add `js-ready` to <html> only if we can
     actually animate in: that gates the CSS opacity:0 default so content
     remains visible without JS or under reduced motion.
     -----------------------------------------------------------------------*/
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && !reduced && 'IntersectionObserver' in window) {
    docEl.classList.add('js-ready');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -80px 0px', threshold: 0.05 },
    );
    reveals.forEach((el) => io.observe(el));
  }

  /* -----------------------------------------------------------------------
     Projects: render, filter, expand
     -----------------------------------------------------------------------*/
  const projectGrid = document.getElementById('project-grid');
  const projects = (window.PORTFOLIO_PROJECTS || []);

  if (projectGrid && projects.length) {
    const escapeHtml = (s) =>
      String(s).replace(/[&<>"']/g, (c) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      }[c]));

    const cardHtml = (p) => {
      const filterAttr = p.filters.join(' ');
      const techHtml = p.tech.map((t) => `<li>${escapeHtml(t)}</li>`).join('');
      const bodyHtml = p.body.map((para) => `<p>${escapeHtml(para)}</p>`).join('');
      return `
        <article
          class="project-card"
          data-filters="${escapeHtml(filterAttr)}"
          aria-expanded="false"
          aria-labelledby="proj-${escapeHtml(p.id)}-title"
        >
          <header class="project-head">
            <h3 class="project-title" id="proj-${escapeHtml(p.id)}-title">${escapeHtml(p.title)}</h3>
            <button
              type="button"
              class="project-toggle"
              aria-label="Show details for ${escapeHtml(p.title)}"
              data-project-toggle
            >
              <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
          </header>
          <p class="project-blurb">${escapeHtml(p.blurb)}</p>
          <ul class="project-tech">${techHtml}</ul>
          <div class="project-details">
            <div>
              <div class="project-body">
                ${bodyHtml}
                <a class="project-link" href="${escapeHtml(p.github)}" target="_blank" rel="noopener">
                  View on GitHub →
                </a>
              </div>
            </div>
          </div>
        </article>
      `;
    };

    projectGrid.innerHTML = projects.map(cardHtml).join('');

    /* Expand / collapse */
    projectGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.project-card');
      if (!card) return;
      // Allow clicks on inner links to behave normally
      if (e.target.closest('a')) return;
      const expanded = card.getAttribute('aria-expanded') === 'true';
      card.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      const btn = card.querySelector('[data-project-toggle]');
      const titleEl = card.querySelector('.project-title');
      if (btn && titleEl) {
        btn.setAttribute(
          'aria-label',
          (expanded ? 'Show' : 'Hide') + ' details for ' + titleEl.textContent
        );
      }
    });

    /* Filter chips */
    const chips = document.querySelectorAll('.filter-chip');
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const target = chip.dataset.filter;
        chips.forEach((c) => {
          c.classList.toggle('is-active', c === chip);
          c.setAttribute('aria-selected', c === chip ? 'true' : 'false');
        });
        const cards = projectGrid.querySelectorAll('.project-card');
        cards.forEach((card) => {
          const filters = (card.dataset.filters || '').split(/\s+/);
          const match = target === 'all' || filters.includes(target);
          card.classList.toggle('is-hidden', !match);
        });
      });
    });
  }

  /* -----------------------------------------------------------------------
     Active section highlight in nav (desktop)
     -----------------------------------------------------------------------*/
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (navLinks.length && 'IntersectionObserver' in window) {
    const linkMap = new Map();
    navLinks.forEach((a) => linkMap.set(a.getAttribute('href').slice(1), a));

    const sectionIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = linkMap.get(entry.target.id);
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach((a) => a.style.color = '');
            link.style.color = 'var(--text)';
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );

    document.querySelectorAll('main section[id]').forEach((s) => sectionIo.observe(s));
  }
})();
