// State Management
let selectedProjectIndex = 0;
let modalActiveProjectIndex = 0;
let modalActiveImageIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
  initLucide();
  initTireCurveBench();
  renderBuildsConsole();
  setupKeyboardShortcuts();
});

function initLucide() {
  if (window.lucide) window.lucide.createIcons();
}

// 1. Empirical Tire Stiffness Simulation Bench
function initTireCurveBench() {
  const slider = document.getElementById('psi-slider');
  const psiReadout = document.getElementById('psi-readout');
  const kReadout = document.getElementById('calculated-k');
  const defReadout = document.getElementById('calculated-deflection');
  const busBar = document.getElementById('bus-util-bar');
  const busText = document.getElementById('bus-util-text');
  const canvas = document.getElementById('curve-canvas');

  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function render(psi) {
    // Non-linear spring relationship: K ~ 120 + 19.1 * PSI
    const k = 120 + 19.1 * psi;
    const peakDef = (600 / k).toFixed(2); // In inches under 600 lbf stall load

    if (psiReadout) psiReadout.textContent = `${psi.toFixed(1)} PSI`;
    if (kReadout) kReadout.textContent = `${k.toFixed(1)} lbf/in`;
    if (defReadout) defReadout.textContent = `${peakDef} inches`;

    const util = (16.2 + psi * 0.55).toFixed(1);
    if (busBar) busBar.style.width = `${util}%`;
    if (busText) busText.textContent = `${util}% (Nominal)`;

    // Draw Force-Deflection Curve
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const padL = 50;
    const padB = 40;
    const padT = 20;
    const padR = 20;

    // Grid Lines
    ctx.strokeStyle = '#161c27';
    ctx.lineWidth = 1;
    for (let x = padL; x < w - padR; x += 65) {
      ctx.beginPath();
      ctx.moveTo(x, padT);
      ctx.lineTo(x, h - padB);
      ctx.stroke();
    }
    for (let y = padT; y < h - padB; y += 45) {
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(w - padR, y);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#232b3b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, h - padB);
    ctx.lineTo(w - padR, h - padB);
    ctx.stroke();

    // Plot Force Curve: F(x) = K * x^1.05
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    const maxDisp = 4.5; // inches
    const maxForce = 900; // lbf

    for (let d = 0; d <= maxDisp; d += 0.05) {
      const force = k * Math.pow(d, 1.05);
      const px = padL + (d / maxDisp) * (w - padL - padR);
      const py = (h - padB) - (force / maxForce) * (h - padB - padT);

      if (d === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Mark 600 lbf operating point
    const opDisp = parseFloat(peakDef);
    const markX = padL + (opDisp / maxDisp) * (w - padL - padR);
    const markY = (h - padB) - (600 / maxForce) * (h - padB - padT);

    ctx.fillStyle = '#ff5500';
    ctx.beginPath();
    ctx.arc(markX, markY, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f8fafc';
    ctx.font = '11px JetBrains Mono';
    ctx.fillText(`600 lbf @ ${opDisp}"`, markX + 10, markY - 8);
  }

  if (slider) {
    slider.addEventListener('input', (e) => {
      render(parseFloat(e.target.value));
    });
    render(parseFloat(slider.value));
  }
}

// 2. Master-Detail Engineering Builds Switcher
function renderBuildsConsole() {
  const navContainer = document.getElementById('builds-nav-list');
  const stage = document.getElementById('builds-detail-stage');
  if (!navContainer || !stage || typeof projectsData === 'undefined') return;

  // Render Left Subsystem Navigation List
  navContainer.innerHTML = projectsData.map((project, idx) => `
    <button 
      onclick="selectBuild(${idx})"
      class="w-full text-left p-4 border transition-all ${idx === selectedProjectIndex ? 'bg-metal-void border-metal-pure text-metal-pure shadow-lg' : 'bg-metal-gunmetal border-metal-border text-metal-slate hover:border-metal-borderLight hover:text-metal-pure'}"
    >
      <div class="flex items-center justify-between mb-1">
        <span class="text-[10px] font-mono text-metal-subtle uppercase">UNIT 0${idx + 1} // ${project.category.toUpperCase()}</span>
        <span class="text-[10px] font-mono text-metal-subtle">${project.timeline}</span>
      </div>
      <div class="font-display font-extrabold text-base tracking-tight">${project.title}</div>
      <div class="text-[11px] text-metal-subtle font-sans mt-0.5 truncate">${project.team}</div>
    </button>
  `).join('');

  // Render Right Detail Stage
  const active = projectsData[selectedProjectIndex];
  const mainImg = active.images[0] || { src: '', alt: 'CAD Schematic' };

  stage.innerHTML = `
    <!-- Top Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-6 border-b border-metal-border gap-4">
      <div>
        <div class="text-[10px] font-mono text-metal-accent uppercase tracking-widest mb-1">
          SUBSYSTEM BREAKDOWN // ${active.team}
        </div>
        <h3 class="text-3xl font-display font-extrabold text-metal-pure uppercase">${active.title}</h3>
      </div>
      <div class="flex flex-wrap gap-1.5 font-mono text-[10px]">
        ${active.tags.map(t => `<span class="px-2 py-0.5 bg-metal-titanium border border-metal-border text-metal-slate">\${t}</span>`).join('')}
      </div>
    </div>

    <!-- Image Stage -->
    <div 
      class="relative w-full aspect-[16/9] bg-metal-void border border-metal-border overflow-hidden mb-6 group cursor-pointer"
      onclick="openInspectorModal(${selectedProjectIndex}, 0)"
    >
      <img 
        src="${mainImg.src}" 
        alt="${mainImg.alt}"
        class="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'600\' height=\'340\' viewBox=\'0 0 600 340\'><rect width=\'100%\' height=\'100%\' fill=\'%2307090d\'/><text x=\'50%\' y=\'50%\' dominant-baseline=\'middle\' text-anchor=\'middle\' fill=\'%23f8fafc\' font-family=\'monospace\' font-size=\'14\'>CAD HARDWARE BLUEPRINT</text></svg>'"
      >

      <div class="absolute top-3 right-3 px-2.5 py-1 bg-metal-void/90 border border-metal-border text-metal-pure font-mono text-[10px] font-bold">
        ${active.images.length} CAD CHANNELS
      </div>

      <div class="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-metal-void via-metal-void/80 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[10px] text-metal-pure">
        <span class="flex items-center gap-1.5">
          <i data-lucide="maximize-2" class="w-3.5 h-3.5"></i>
          CLICK TO LAUNCH HIGH-RESOLUTION BLUEPRINT VIEWER
        </span>
        <span class="text-metal-subtle">ESC TO CLOSE</span>
      </div>
    </div>

    <!-- Technical Parameters Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 font-mono text-xs">
      <div class="p-4 bg-metal-titanium border border-metal-border space-y-2">
        <div class="text-metal-pure font-bold border-b border-metal-border pb-1 text-[11px]">HARDWARE SPECIFICATIONS</div>
        ${Object.entries(active.engineeringSpecs).map(([k, v]) => `
          <div class="flex justify-between py-0.5">
            <span class="text-metal-subtle">\${k}:</span>
            <span class="text-metal-pure font-bold text-right">\${v}</span>
          </div>
        `).join('')}
      </div>

      <div class="p-4 bg-metal-titanium border border-metal-border space-y-2">
        <div class="text-metal-pure font-bold border-b border-metal-border pb-1 text-[11px]">VALIDATION HIGHLIGHTS</div>
        <div class="space-y-1.5 font-sans text-xs text-metal-slate pt-1">
          ${active.executionHighlights.slice(0, 3).map(h => `
            <div class="flex items-start gap-2">
              <span class="text-metal-pure font-mono font-bold">›</span>
              <span>\${h}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Bottom Actions -->
    <div class="pt-4 border-t border-metal-border flex items-center justify-between font-mono text-xs">
      <button 
        onclick="openInspectorModal(${selectedProjectIndex}, 0)"
        class="px-5 py-2.5 bg-metal-pure hover:bg-metal-silver text-metal-void font-bold transition-all flex items-center gap-2"
      >
        <i data-lucide="layers" class="w-4 h-4"></i>
        <span>INSPECT BLUEPRINT SLIDES (${active.images.length})</span>
      </button>

      <span class="text-[10px] text-metal-subtle">UNIT: ${active.id.toUpperCase()}</span>
    </div>
  `;

  initLucide();
}

function selectBuild(index) {
  selectedProjectIndex = index;
  renderBuildsConsole();
}

// 3. Blueprint Inspector Modal
function openInspectorModal(pIdx, iIdx = 0) {
  modalActiveProjectIndex = pIdx;
  modalActiveImageIndex = iIdx;

  const modal = document.getElementById('inspector-modal');
  if (!modal || !projectsData[pIdx]) return;

  updateModalView();
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  initLucide();
}

function closeInspectorModal() {
  const modal = document.getElementById('inspector-modal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function updateModalView() {
  const p = projectsData[modalActiveProjectIndex];
  if (!p) return;

  const currentImg = p.images[modalActiveImageIndex];
  const activeImgEl = document.getElementById('modal-active-img');
  const titleEl = document.getElementById('modal-project-title');
  const counterEl = document.getElementById('modal-image-counter');
  const captionEl = document.getElementById('modal-caption');
  const thumbStrip = document.getElementById('modal-thumb-strip');

  if (titleEl) titleEl.textContent = `${p.title} // CAD BLUEPRINT`;
  if (counterEl) counterEl.textContent = `SLIDE ${modalActiveImageIndex + 1} OF ${p.images.length}`;
  if (captionEl) captionEl.textContent = currentImg.alt || "CAD Specification Blueprint";

  if (activeImgEl) {
    activeImgEl.src = currentImg.src;
    activeImgEl.alt = currentImg.alt;
  }

  if (thumbStrip) {
    thumbStrip.innerHTML = p.images.map((img, i) => `
      <button 
        onclick="navigateModalImageTo(${i})" 
        class="w-16 h-12 border shrink-0 overflow-hidden bg-metal-void transition-all ${i === modalActiveImageIndex ? 'border-metal-pure ring-1 ring-metal-pure scale-105' : 'border-metal-border opacity-50 hover:opacity-100'}"
      >
        <img src="${img.src}" alt="${img.alt}" class="w-full h-full object-contain" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'64\' height=\'48\'><rect width=\'100%\' height=\'100%\' fill=\'%2307090d\'/></svg>'">
      </button>
    `).join('');
  }
}

function navigateModalImage(direction) {
  const p = projectsData[modalActiveProjectIndex];
  if (!p) return;
  const len = p.images.length;
  modalActiveImageIndex = (modalActiveImageIndex + direction + len) % len;
  updateModalView();
}

function navigateModalImageTo(idx) {
  modalActiveImageIndex = idx;
  updateModalView();
}

function setupKeyboardShortcuts() {
  window.addEventListener('keydown', e => {
    const modal = document.getElementById('inspector-modal');
    if (!modal || !modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeInspectorModal();
    if (e.key === 'ArrowLeft') navigateModalImage(-1);
    if (e.key === 'ArrowRight') navigateModalImage(1);
  });
}

// 4. Instant Clipboard Copy Tool
function copyEmailToClipboard() {
  const email = "aibel@tamu.edu";
  navigator.clipboard.writeText(email).then(() => {
    const copyText = document.getElementById('copy-text');
    const copyIcon = document.getElementById('copy-icon');

    if (copyText) copyText.textContent = "COPIED TO CLIPBOARD!";
    if (copyIcon) copyIcon.setAttribute('data-lucide', 'check');
    initLucide();

    showHudToast(`COPIED [${email}] TO CLIPBOARD`);

    setTimeout(() => {
      if (copyText) copyText.textContent = `COPY: ${email}`;
      if (copyIcon) copyIcon.setAttribute('data-lucide', 'copy');
      initLucide();
    }, 3000);
  }).catch(() => {
    window.location.href = `mailto:${email}`;
  });
}

function showHudToast(msg) {
  const toast = document.getElementById('hud-toast');
  const msgEl = document.getElementById('hud-toast-msg');
  if (!toast || !msgEl) return;

  msgEl.textContent = msg;
  toast.classList.remove('translate-y-24', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-24', 'opacity-0');
  }, 3200);
}