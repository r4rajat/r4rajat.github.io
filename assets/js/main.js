(function () {
  'use strict';

  const docEl = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const createStatus = (id) => {
    const status = document.createElement('span');
    status.id = id;
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.style.position = 'absolute';
    status.style.width = '1px';
    status.style.height = '1px';
    status.style.padding = '0';
    status.style.margin = '-1px';
    status.style.overflow = 'hidden';
    status.style.clip = 'rect(0, 0, 0, 0)';
    status.style.whiteSpace = 'nowrap';
    status.style.border = '0';
    document.body.appendChild(status);
    return status;
  };

  /* -----------------------------------------------------------------------
     Theme toggle
     -----------------------------------------------------------------------*/
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const themeStatus = createStatus('theme-status');
    const setPressed = () => {
      const isLight = docEl.dataset.theme === 'light';
      themeToggle.setAttribute('aria-pressed', isLight ? 'true' : 'false');
      themeToggle.setAttribute('aria-label', `Switch to ${isLight ? 'dark' : 'light'} theme`);
      themeToggle.title = `Switch to ${isLight ? 'dark' : 'light'} theme`;
    };
    setPressed();

    themeToggle.addEventListener('click', () => {
      const next = docEl.dataset.theme === 'light' ? 'dark' : 'light';
      docEl.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
      setPressed();
      themeStatus.textContent = `${next[0].toUpperCase()}${next.slice(1)} theme enabled.`;
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
    const menuLinks = Array.from(mobileMenu.querySelectorAll('a'));

    const closeMenu = () => {
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open menu');
      mobileMenu.hidden = true;
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };
    const openMenu = () => {
      hamburger.classList.add('is-open');
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.setAttribute('aria-label', 'Close menu');
      mobileMenu.hidden = false;
      mobileMenu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (menuLinks[0]) menuLinks[0].focus();
    };
    const closeAndRestoreFocus = () => {
      closeMenu();
      // Returning to the trigger prevents focus from disappearing after Escape
      // or after activating a mobile navigation link.
      hamburger.focus();
    };

    closeMenu();
    hamburger.addEventListener('click', () => {
      mobileMenu.hidden ? openMenu() : closeAndRestoreFocus();
    });
    menuLinks.forEach((a) => a.addEventListener('click', closeAndRestoreFocus));
    mobileMenu.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab' || menuLinks.length < 2) return;
      const first = menuLinks[0];
      const last = menuLinks[menuLinks.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mobileMenu.hidden) {
        e.preventDefault();
        closeAndRestoreFocus();
      }
    });
  }

  /* -----------------------------------------------------------------------
     Rotating role text
     -----------------------------------------------------------------------*/
  const ROLES = ['Developer', 'Gopher', 'k8s Enthusiast', 'RPA Enthusiast'];
  const rotatingEl = document.getElementById('rotating-role');
  if (rotatingEl) {
    // The animated text changes one character at a time. Keep that visual
    // treatment out of the accessibility tree and announce each finished role
    // once instead of producing a stream of live-region updates.
    rotatingEl.removeAttribute('aria-live');
    if (!reduced) {
      rotatingEl.setAttribute('aria-hidden', 'true');
      const roleStatus = createStatus('rotating-role-status');
      roleStatus.textContent = ROLES[0];

      let roleIdx = 0;
      let charIdx = 0;
      let deleting = false;

      const tick = () => {
        const word = ROLES[roleIdx];
        if (!deleting) {
          rotatingEl.textContent = word.slice(0, ++charIdx);
          if (charIdx === word.length) {
            roleStatus.textContent = word;
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
          tabindex="0"
          aria-labelledby="proj-${escapeHtml(p.id)}-title"
        >
          <header class="project-head">
            <h3 class="project-title" id="proj-${escapeHtml(p.id)}-title">${escapeHtml(p.title)}</h3>
            <button
              type="button"
              class="project-toggle"
              aria-label="Show details for ${escapeHtml(p.title)}"
              aria-expanded="false"
              aria-controls="proj-${escapeHtml(p.id)}-details"
              data-project-toggle
            >
              <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
          </header>
          <p class="project-blurb">${escapeHtml(p.blurb)}</p>
          <ul class="project-tech">${techHtml}</ul>
          <div class="project-details" id="proj-${escapeHtml(p.id)}-details" aria-hidden="true" inert>
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

    const focusableSelector = 'a, button, input, select, textarea, [tabindex]';
    const setDetailsState = (card, expanded) => {
      const details = card.querySelector('.project-details');
      const btn = card.querySelector('[data-project-toggle]');
      if (!details || !btn) return;

      card.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      details.setAttribute('aria-hidden', expanded ? 'false' : 'true');
      details.toggleAttribute('inert', !expanded);
      details.inert = !expanded;

      // `inert` is supported by current browsers; temporarily removing tab
      // stops makes the collapsed state safe in older browsers too.
      details.querySelectorAll(focusableSelector).forEach((el) => {
        if (!expanded) {
          if (!el.hasAttribute('data-project-tabindex')) {
            el.setAttribute('data-project-tabindex', el.getAttribute('tabindex') || '');
          }
          el.setAttribute('tabindex', '-1');
        } else if (el.hasAttribute('data-project-tabindex')) {
          const previous = el.getAttribute('data-project-tabindex');
          if (previous) el.setAttribute('tabindex', previous);
          else el.removeAttribute('tabindex');
          el.removeAttribute('data-project-tabindex');
        }
      });
    };

    const toggleCard = (card) => {
      const expanded = card.getAttribute('aria-expanded') === 'true';
      setDetailsState(card, !expanded);
      const btn = card.querySelector('[data-project-toggle]');
      const titleEl = card.querySelector('.project-title');
      if (btn && titleEl) {
        btn.setAttribute(
          'aria-label',
          (expanded ? 'Show' : 'Hide') + ' details for ' + titleEl.textContent
        );
      }
    };

    projectGrid.querySelectorAll('.project-card').forEach((card) => setDetailsState(card, false));

    /* Expand / collapse */
    projectGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.project-card');
      if (!card) return;
      // Allow clicks on inner links to behave normally
      if (e.target.closest('a')) return;
      toggleCard(card);
    });

    projectGrid.addEventListener('keydown', (e) => {
      const card = e.target.closest('.project-card');
      if (!card || e.target !== card || (e.key !== 'Enter' && e.key !== ' ')) return;
      e.preventDefault();
      toggleCard(card);
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
     Active section highlight in nav
     -----------------------------------------------------------------------*/
  const navLinks = document.querySelectorAll(
    '.nav-links a[href^="#"], .mobile-menu a[href^="#"]',
  );
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  if (navLinks.length && sections.length) {
    const setActiveSection = (activeId) => {
      navLinks.forEach((link) => {
        const isActive = link.getAttribute('href').slice(1) === activeId;
        link.style.color = isActive ? 'var(--text)' : '';
        if (isActive) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
    };

    const updateActiveSection = () => {
      const scrollMarker = window.scrollY + (nav ? nav.offsetHeight : 0) + 24;
      let activeId = '';
      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        if (sectionTop <= scrollMarker) activeId = section.id;
      });
      setActiveSection(activeId);
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection, { passive: true });
    window.addEventListener('hashchange', updateActiveSection);
  }
})();
