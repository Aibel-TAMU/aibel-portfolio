/* =========================================================================
   AIBEL JOMON PORTFOLIO ENGINE // SYSTEMS, CONTROLS & TEST
   ========================================================================= */

// State Management
let currentFilter = 'all';
let modalActiveProjectIndex = 0;
let modalActiveImageIndex = 0;

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initSystemClock();
  initLucideIcons();
  initCadCanvas();
  renderProjectMatrix();
  setupFilterButtons();
  setupKeyboardShortcuts();
});

// Refresh Lucide Icons helper
function initLucideIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// 1. LIVE HUD CLOCK (College Station / Bryan CDT)
function initSystemClock() {
  const clockEl = document.getElementById('system-clock');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    // Format to US Central Time
    const timeStr = now.toLocaleTimeString('en-US', {
      timeZone: 'America/Chicago',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    clockEl.textContent = `${timeStr} CDT`;
  }
  update();
  setInterval(update, 1000);
}

// 2. INTERACTIVE CAD PARTICLES & NODES CANVAS
function initCadCanvas() {
  const canvas = document.getElementById('cad-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const nodes = [];
  const nodeCount = Math.min(Math.floor(width / 35), 45);

  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 1.5 + 1
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw connection lines
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 140) {
          const alpha = (1 - dist / 140) * 0.15;
          ctx.strokeStyle = `rgba(142, 22, 32, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;

      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
}

// 3. RENDER FULL PROJECT MATRIX
function renderProjectMatrix() {
  const container = document.getElementById('projects-grid');
  if (!container || typeof projectsData === 'undefined') return;

  const filtered = currentFilter === 'all' 
    ? projectsData 
    : projectsData.filter(p => p.category === currentFilter);

  container.innerHTML = filtered.map((project) => {
    // Determine real index in raw projectsData
    const rawIndex = projectsData.findIndex(p => p.id === project.id);
    const mainImg = project.images[0] || { src: '', alt: 'CAD Render' };

    return `
      <article class="project-card-container bg-surface-900 border border-surface-border rounded-2xl overflow-hidden flex flex-col justify-between" id="card-${project.id}">
        
        <!-- Card Image Stage -->
        <div class="relative w-full aspect-[16/10] bg-surface-950 border-b border-surface-border overflow-hidden group/thumb cursor-pointer" onclick="openInspectorModal(${rawIndex}, 0)">
          <img 
            src="${mainImg.src}" 
            alt="${mainImg.alt}"
            class="w-full h-full object-contain p-2 group-hover/thumb:scale-105 transition-transform duration-500 ease-out"
            onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'600\' height=\'375\' viewBox=\'0 0 600 375\'><rect width=\'100%\' height=\'100%\' fill=\'%2307090c\'/><text x=\'50%\' y=\'50%\' dominant-baseline=\'middle\' text-anchor=\'middle\' fill=\'%23500000\' font-family=\'monospace\' font-size=\'16\'>CAD SPEC SCHEMATIC</text></svg>'"
          >

          <!-- Top Pill Overlays -->
          <div class="absolute top-3 left-3 flex items-center gap-2">
            <span class="px-2.5 py-1 rounded bg-surface-900/90 border border-surface-border text-slate-200 text-[10px] font-mono backdrop-blur-md">
              ${project.team}
            </span>
          </div>

          <div class="absolute top-3 right-3">
            <span class="px-2.5 py-1 rounded bg-aggie/90 border border-aggie-bright/60 text-white text-[10px] font-mono font-bold flex items-center gap-1 backdrop-blur-md">
              <i data-lucide="camera" class="w-3 h-3"></i>
              <span>${project.images.length} VIEWS</span>
            </span>
          </div>

          <!-- Bottom Hover Inspection Callout -->
          <div class="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-surface-950 via-surface-950/80 to-transparent flex items-center justify-between opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300 font-mono text-[11px] text-slate-200">
            <span class="flex items-center gap-1 text-red-300">
              <i data-lucide="maximize-2" class="w-3.5 h-3.5"></i>
              Click to Open Technical Inspector &amp; Blueprint Slides
            </span>
            <span class="text-slate-400">ESC TO CLOSE</span>
          </div>
        </div>

        <!-- Card Content Body -->
        <div class="p-6 flex-grow flex flex-col justify-between">
          <div>
            <!-- Title & Timeline -->
            <div class="flex items-start justify-between gap-4 mb-2">
              <h3 class="text-xl font-bold text-white tracking-tight leading-snug hover:text-red-300 transition-colors">
                ${project.title}
              </h3>
              <span class="text-xs font-mono text-slate-400 shrink-0 mt-0.5">${project.timeline}</span>
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap gap-1.5 mb-4">
              ${project.tags.map(t => `
                <span class="px-2 py-0.5 rounded bg-surface-800 text-slate-300 text-[10px] font-mono border border-surface-border">
                  \${t}
                </span>
              `).join('')}
            </div>

            <!-- Problem / Summary -->
            <p class="text-xs text-slate-300 leading-relaxed mb-4">
              ${project.summary}
            </p>

            <!-- Quick Specs Table Strip -->
            <div class="rounded-xl bg-surface-950/70 border border-surface-border p-3 font-mono text-[11px] space-y-1.5 mb-4">
              ${Object.entries(project.engineeringSpecs).slice(0, 3).map(([key, value]) => `
                <div class="flex items-center justify-between text-slate-300">
                  <span class="text-slate-400">\${key}:</span>
                  <span class="text-white font-semibold text-right">\${value}</span>
                </div>
              `).join('')}
            </div>

            <!-- Execution Bullet Preview -->
            <div class="space-y-1.5 font-sans text-xs text-slate-300 mb-6">
              ${project.executionHighlights.slice(0, 2).map(highlight => `
                <div class="flex items-start gap-2">
                  <span class="text-aggie-bright font-mono font-bold">›</span>
                  <span>\${highlight}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Bottom Card Action Toolbar -->
          <div class="pt-4 border-t border-surface-border/70 flex items-center justify-between font-mono text-xs">
            <button 
              onclick="openInspectorModal(${rawIndex}, 0)" 
              class="px-4 py-2 rounded-lg bg-surface-800 hover:bg-aggie text-white transition-all flex items-center gap-2 border border-surface-border hover:border-aggie-bright"
            >
              <i data-lucide="layers" class="w-3.5 h-3.5"></i>
              <span>INSPECT CAD &amp; DATA (${project.images.length})</span>
            </button>

            <span class="text-[10px] text-slate-400">ID: ${project.id.toUpperCase()}</span>
          </div>

        </div>

      </article>
    `;
  }).join('');

  initLucideIcons();
}

// 4. FILTER CONTROLS
function setupFilterButtons() {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => {
        b.classList.remove('active', 'bg-aggie', 'text-white');
        b.classList.add('text-slate-400');
      });
      btn.classList.add('active', 'bg-aggie', 'text-white');
      btn.classList.remove('text-slate-400');

      currentFilter = btn.getAttribute('data-filter') || 'all';
      renderProjectMatrix();
    });
  });
}

// 5. FULLSCREEN INSPECTOR MODAL CONTROLLER
function openInspectorModal(projectIndex, imageIndex = 0) {
  modalActiveProjectIndex = projectIndex;
  modalActiveImageIndex = imageIndex;

  const modal = document.getElementById('inspector-modal');
  if (!modal || !projectsData[projectIndex]) return;

  updateModalView();

  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Stop background scrolling
  initLucideIcons();
}

function closeInspectorModal() {
  const modal = document.getElementById('inspector-modal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function updateModalView() {
  const project = projectsData[modalActiveProjectIndex];
  if (!project) return;

  const currentImg = project.images[modalActiveImageIndex];
  const activeImgEl = document.getElementById('modal-active-img');
  const titleEl = document.getElementById('modal-project-title');
  const counterEl = document.getElementById('modal-image-counter');
  const captionEl = document.getElementById('modal-caption');
  const thumbStrip = document.getElementById('modal-thumb-strip');

  if (titleEl) titleEl.textContent = `${project.title} // TECHNICAL INSPECTOR`;
  if (counterEl) counterEl.textContent = `SLIDE ${modalActiveImageIndex + 1} OF ${project.images.length}`;
  if (captionEl) captionEl.textContent = currentImg.alt || "CAD Specification Drawing";

  if (activeImgEl) {
    activeImgEl.src = currentImg.src;
    activeImgEl.alt = currentImg.alt;
  }

  // Render thumbnail strip
  if (thumbStrip) {
    thumbStrip.innerHTML = project.images.map((img, i) => `
      <button 
        onclick="navigateModalImageTo(${i})" 
        class="w-16 h-12 rounded-lg border shrink-0 overflow-hidden bg-surface-950 transition-all ${i === modalActiveImageIndex ? 'border-aggie-bright ring-2 ring-aggie-bright/40 scale-105' : 'border-surface-border opacity-50 hover:opacity-100'}"
        title="${img.alt}"
      >
        <img src="${img.src}" alt="${img.alt}" class="w-full h-full object-contain" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'64\' height=\'48\'><rect width=\'100%\' height=\'100%\' fill=\'%2307090c\'/></svg>'">
      </button>
    `).join('');
  }
}

function navigateModalImage(direction) {
  const project = projectsData[modalActiveProjectIndex];
  if (!project) return;

  const total = project.images.length;
  modalActiveImageIndex = (modalActiveImageIndex + direction + total) % total;
  updateModalView();
}

function navigateModalImageTo(index) {
  modalActiveImageIndex = index;
  updateModalView();
}

// 6. KEYBOARD SHORTCUTS (Esc, Left, Right)
function setupKeyboardShortcuts() {
  window.addEventListener('keydown', (e) => {
    const modal = document.getElementById('inspector-modal');
    if (!modal || !modal.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeInspectorModal();
    } else if (e.key === 'ArrowLeft') {
      navigateModalImage(-1);
    } else if (e.key === 'ArrowRight') {
      navigateModalImage(1);
    }
  });

  // Click outside to close modal
  const modal = document.getElementById('inspector-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeInspectorModal();
      }
    });
  }
}

// 7. INTERACTIVE RESUME MODAL HELPER
function openResumeModal() {
  const dossierSection = document.getElementById('dossier');
  if (dossierSection) {
    dossierSection.scrollIntoView({ behavior: 'smooth' });
    showHudToast("NAVIGATED TO AUTHENTICATED DOSSIER");
  }
}

// 8. CLIPBOARD COPY TOAST ENGINE
function copyEmailToClipboard() {
  const email = "aibel@tamu.edu";
  navigator.clipboard.writeText(email).then(() => {
    const copyText = document.getElementById('copy-text');
    const copyIcon = document.getElementById('copy-icon');
    
    if (copyText) copyText.textContent = "COPIED TO CLIPBOARD!";
    if (copyIcon) copyIcon.setAttribute('data-lucide', 'check');
    initLucideIcons();

    showHudToast(`COPIED [${email}] TO CLIPBOARD`);

    setTimeout(() => {
      if (copyText) copyText.textContent = `COPY: ${email}`;
      if (copyIcon) copyIcon.setAttribute('data-lucide', 'copy');
      initLucideIcons();
    }, 3000);
  }).catch(err => {
    console.error('Copy failed: ', err);
    window.location.href = `mailto:${email}`;
  });
}

function showHudToast(message) {
  const toast = document.getElementById('hud-toast');
  const msgEl = document.getElementById('hud-toast-msg');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.remove('translate-y-24', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-24', 'opacity-0');
  }, 3200);
}