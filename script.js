/**
 * AIBEL.ENGINEER — RUNTIME ENGINE
 * Precision altitude particle engine, scrambler resolver, card physics, magnetic nodes.
 */

(function () {
  'use strict';

  // State
  const state = {
    mouse: { x: window.innerWidth / 2, y: window.innerHeight / 2, targetX: window.innerWidth / 2, targetY: window.innerHeight / 2 },
    scroll: { current: window.scrollY, velocity: 0, last: window.scrollY },
    isTabVisible: true,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    isTouch: window.matchMedia('(pointer: coarse)').matches
  };

  /* --------------------------------------------------------------------------
     1. ALTITUDE STARFIELD ENGINE (60FPS Capped Physics)
     -------------------------------------------------------------------------- */
  function initStarfield() {
    const canvas = document.getElementById('starfield');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let particles = [];
    let animationFrameId = null;

    // Mobile check to thin particle budget
    const particleBudget = window.innerWidth < 768 ? 70 : 180;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function createParticle() {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        baseZ: Math.random() * 0.8 + 0.2, // Depth factor
        radius: Math.random() * 1.1 + 0.3,
        alpha: Math.random() * 0.6 + 0.2,
        twinkleSpeed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        driftX: (Math.random() - 0.5) * 0.15,
        driftY: -(Math.random() * 0.25 + 0.05)
      };
    }

    function buildUniverse() {
      particles = [];
      for (let i = 0; i < particleBudget; i++) {
        particles.push(createParticle());
      }
    }

    function tick() {
      if (!state.isTabVisible || state.reducedMotion) {
        animationFrameId = requestAnimationFrame(tick);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Mouse Parallax Damping
      const mouseOffsetX = (state.mouse.x / width - 0.5) * 40;
      const mouseOffsetY = (state.mouse.y / height - 0.5) * 40;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Cosmic Drift
        p.x += p.driftX;
        p.y += p.driftY;

        // Twinkle
        p.alpha += p.twinkleSpeed;
        if (p.alpha > 0.85 || p.alpha < 0.15) {
          p.twinkleSpeed = -p.twinkleSpeed;
        }

        // Boundary Wrapping
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Depth projection
        const renderX = p.x + mouseOffsetX * p.baseZ;
        const renderY = p.y + mouseOffsetY * p.baseZ;

        ctx.beginPath();
        ctx.arc(renderX, renderY, p.radius * p.baseZ, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, Math.min(1, p.alpha))})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(tick);
    }

    window.addEventListener('resize', () => {
      resize();
      buildUniverse();
    }, { passive: true });

    document.addEventListener('visibilitychange', () => {
      state.isTabVisible = !document.hidden;
    });

    resize();
    buildUniverse();
    tick();
  }

  /* --------------------------------------------------------------------------
     2. NAME RESOLVER (System Boot Scramble Effect)
     -------------------------------------------------------------------------- */
  function initScramble() {
    const el = document.getElementById('scramble-name');
    if (!el || state.reducedMotion) return;

    const targetText = el.getAttribute('data-value') || 'AIBEL JOMON';
    const glyphs = '0123456789ABCDEF_//-[]<>';
    let iteration = 0;
    const maxIterations = targetText.length * 4;

    const interval = setInterval(() => {
      el.textContent = targetText
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' ';
          if (index < iteration / 4) return targetText[index];
          return glyphs[Math.floor(Math.random() * glyphs.length)];
        })
        .join('');

      iteration++;
      if (iteration >= maxIterations) {
        el.textContent = targetText;
        clearInterval(interval);
      }
    }, 28);
  }

  /* --------------------------------------------------------------------------
     3. RETICLE CURSOR & MAGNETIC NODES
     -------------------------------------------------------------------------- */
  function initCursor() {
    if (state.isTouch || state.reducedMotion) return;

    const dot = document.getElementById('cursor-dot');
    const reticle = document.getElementById('cursor-reticle');
    if (!dot || !reticle) return;

    let reticleX = window.innerWidth / 2;
    let reticleY = window.innerHeight / 2;

    window.addEventListener('mousemove', (e) => {
      state.mouse.targetX = e.clientX;
      state.mouse.targetY = e.clientY;
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
    }, { passive: true });

    function renderCursor() {
      // Lerp reticle behind dot
      reticleX += (state.mouse.targetX - reticleX) * 0.18;
      reticleY += (state.mouse.targetY - reticleY) * 0.18;
      state.mouse.x = reticleX;
      state.mouse.y = reticleY;

      reticle.style.left = `${reticleX}px`;
      reticle.style.top = `${reticleY}px`;

      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    // Hover Target Expansion
    const targets = document.querySelectorAll('a, button, [data-magnetic], .project-card, .focus-cell');
    targets.forEach((target) => {
      target.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      target.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    // Magnetic Node Pull
    const magneticElements = document.querySelectorAll('[data-magnetic]');
    magneticElements.forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const pullX = (e.clientX - centerX) * 0.28;
        const pullY = (e.clientY - centerY) * 0.28;
        el.style.transform = `translate(${pullX}px, ${pullY}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  /* --------------------------------------------------------------------------
     4. CARD TILT & SPECULAR SHINE ENGINE
     -------------------------------------------------------------------------- */
  function initCardPhysics() {
    if (state.isTouch || state.reducedMotion) return;

    const cards = document.querySelectorAll('[data-tilt]');
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Set CSS variables for radial specular shine
        card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);

        // Subtle mechanical deflection
        const rotateX = ((y / rect.height) - 0.5) * -6;
        const rotateY = ((x / rect.width) - 0.5) * 6;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.005, 1.005, 1.005)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }

  /* --------------------------------------------------------------------------
     5. DYNAMIC PROJECT GRID & FILTER DISPATCH
     -------------------------------------------------------------------------- */
  function renderProjects(activeTag = 'all') {
    const grid = document.getElementById('projects-grid');
    if (!grid || !Array.isArray(window.projectsData)) return;

    const filtered = activeTag === 'all'
      ? window.projectsData
      : window.projectsData.filter((p) => p.category.toLowerCase() === activeTag.toLowerCase());

    grid.innerHTML = filtered.map((project) => {
      const tagsHtml = project.tags.map((t) => `<span class="project-tag font-mono">${t}</span>`).join('');
      const linkHtml = project.link
        ? `<a href="${project.link}" target="_blank" rel="noopener noreferrer" class="project-link font-mono" data-magnetic><span>INSPECT UNIT</span><span class="arrow-glyph">↗</span></a>`
        : `<span class="project-link font-mono" style="color: var(--text-dim);">INTERNAL FIELD RECORD</span>`;

      return `
        <article class="project-card" data-tilt data-category="${project.category}">
          <div>
            <div class="project-meta-strip font-mono">
              <span class="project-id">${project.id.toUpperCase()}</span>
              <span class="project-team">${project.team.toUpperCase()}</span>
            </div>
            <h3 class="project-title">${project.title}</h3>
            <p class="project-impact font-mono">${project.impact}</p>
          </div>
          <div class="project-footer">
            <div class="project-tags">${tagsHtml}</div>
            ${linkHtml}
          </div>
        </article>
      `;
    }).join('');

    initCardPhysics();
    initCursor();
  }

  function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-pill');
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterButtons.forEach((b) => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
        const filter = btn.getAttribute('data-filter') || 'all';
        renderProjects(filter);
      });
    });
  }

  /* --------------------------------------------------------------------------
     6. CLIPBOARD DISPATCH & TOAST SYSTEM
     -------------------------------------------------------------------------- */
  function initClipboard() {
    const btn = document.getElementById('copy-email-btn');
    const toast = document.getElementById('toast');
    if (!btn || !toast) return;

    btn.addEventListener('click', () => {
      const email = btn.getAttribute('data-email') || 'aibel@tamu.edu';
      navigator.clipboard.writeText(email).then(() => {
        toast.textContent = `[ COPIED: ${email} // COMMS READY ]`;
        toast.classList.add('is-active');
        toast.setAttribute('aria-hidden', 'false');

        setTimeout(() => {
          toast.classList.remove('is-active');
          toast.setAttribute('aria-hidden', 'true');
        }, 3200);
      });
    });
  }

  /* --------------------------------------------------------------------------
     7. INITIALIZATION BOOTSTRAP
     -------------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initStarfield();
    initScramble();
    initCursor();
    renderProjects('all');
    initFilters();
    initClipboard();
  });
})();