// script.js
let currentFilter = 'all';
let modalActiveProjectIndex = 0;
let modalActiveImageIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
  initLucide();
  initHudClock();
  initFrictionCircle();
  initTelemetryCanvas();
  initLiveCanStream();
  renderProjectMatrix();
  setupFilterButtons();
  setupKeyboardShortcuts();
});

function initLucide() {
  if (window.lucide) window.lucide.createIcons();
}

// 1. Mission Elapsed Clock
function initHudClock() {
  const clockEl = document.getElementById('hud-clock');
  if (!clockEl) return;
  function update() {
    const now = new Date();
    const str = now.toLocaleTimeString('en-US', {
      timeZone: 'America/Chicago',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    clockEl.textContent = `${str} CDT`;
  }
  update();
  setInterval(update, 1000);
}

// 2. Interactive Friction Circle (G-G Diagram) Canvas Simulation
function initFrictionCircle() {
  const canvas = document.getElementById('friction-circle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const centerX = w / 2;
  const centerY = h / 2;
  const maxRadius = 75;

  let gHistory = [];
  let currentLat = 0;
  let currentLong = 0;

  function render() {
    ctx.clearRect(0, 0, w, h);

    // Coordinate grid circles
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 1;
    [0.33, 0.66, 1].forEach(r => {
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius * r, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - maxRadius);
    ctx.lineTo(centerX, centerY + maxRadius);
    ctx.moveTo(centerX - maxRadius, centerY);
    ctx.lineTo(centerX + maxRadius, centerY);
    ctx.stroke();

    // Generate vehicle G-forces
    currentLat += (Math.random() - 0.5) * 0.15;
    currentLong += (Math.random() - 0.5) * 0.15;
    currentLat = Math.max(-1.4, Math.min(1.4, currentLat * 0.98));
    currentLong = Math.max(-1.4, Math.min(1.4, currentLong * 0.98));

    gHistory.push({ x: currentLat, y: currentLong });
    if (gHistory.length > 25) gHistory.shift();

    // Draw historic scatter trail
    gHistory.forEach((pt, i) => {
      const alpha = (i / gHistory.length) * 0.6;
      ctx.fillStyle = `rgba(255, 30, 56, ${alpha})`;
      ctx.beginPath();
      ctx.arc(centerX + (pt.x / 1.5) * maxRadius, centerY - (pt.y / 1.5) * maxRadius, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Current point
    const curX = centerX + (currentLat / 1.5) * maxRadius;
    const curY = centerY - (currentLong / 1.5) * maxRadius;
    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.arc(curX, curY, 4, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(render);
  }
  render();
}

// 3. Background Avionics Telemetry Canvas
function initTelemetryCanvas() {
  const canvas = document.getElementById('telemetry-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  const lines = Array.from({ length: 30 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    len: Math.random() * 40 + 20,
    speed: Math.random() * 1.5 + 0.5
  }));

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(255, 30, 56, 0.4)';
    ctx.lineWidth = 1;

    lines.forEach(l => {
      l.y += l.speed;
      if (l.y > h) l.y = -l.len;
      ctx.beginPath();
      ctx.moveTo(l.x, l.y);
      ctx.lineTo(l.x, l.y + l.len);
      ctx.stroke();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// 4. Simulated Live CAN FD Telemetry Stream
function initLiveCanStream() {
  const container = document.getElementById('live-can-stream');
  const rpmReadout = document.getElementById('rpm-readout');
  if (!container) return;

  const canIds = ['0x102', '0x1F4', '0x2A0', '0x0C8', '0x3B2'];

  setInterval(() => {
    const id = canIds[Math.floor(Math.random() * canIds.length)];
    const byte1 = Math.floor(Math.random() * 255).toString(16).padStart(2, '0').toUpperCase();
    const byte2 = Math.floor(Math.random() * 255).toString(16).padStart(2, '0').toUpperCase();
    const byte3 = Math.floor(Math.random() * 255).toString(16).padStart(2, '0').toUpperCase();
    const byte4 = Math.floor(Math.random() * 255).toString(16).padStart(2, '0').toUpperCase();

    const line = document.createElement('div');
    line.className = 'flex justify-between font-mono text-[9px] text-slate-400';
    line.innerHTML = `<span>[CAN FD] ${id}</span><span class="text-pit-cyan">${byte1} ${byte2} ${byte3} ${byte4}</span><span class="text-pit-tachGreen">CRC:OK</span>`;
    container.appendChild(line);

    if (container.children.length > 5) {
      container.removeChild(container.firstChild);
    }

    if (rpmReadout) {
      const liveRpm = 3400 + Math.floor(Math.random() * 450);
      rpmReadout.textContent = `${liveRpm.toLocaleString()} RPM`;
    }
  }, 380);
}

// 5. Render Hardware Test Matrix
function renderProjectMatrix() {
  const container = document.getElementById('projects-grid');
  if (!container || typeof projectsData === 'undefined') return;

  const filtered = currentFilter === 'all' 
    ? projectsData 
    : projectsData.filter(p => p.category === currentFilter);

  container.innerHTML = filtered.map(project => {
    const rawIndex = projectsData.findIndex(p => p.id === project.id);
    const mainImg = project.images[0] || { src: '', alt: 'CAD Schematic' };

    return `
      <article class="mfd-card bg-pit-panel border border-pit-border overflow-hidden flex flex-col justify-between">
        
        <!-- Viewport Stage -->
        <div class="relative w-full aspect-[16/10] bg-pit-black border-b border-pit-border overflow-hidden group cursor-pointer" onclick="openInspectorModal(${rawIndex}, 0)">
          <img 
            src="${mainImg.src}" 
            alt="${mainImg.alt}"
            class="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
            onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'600\' height=\'375\' viewBox=\'0 0 600 375\'><rect width=\'100%\' height=\'100%\' fill=\'%2305070a\'/><text x=\'50%\' y=\'50%\' dominant-baseline=\'middle\' text-anchor=\'middle\' fill=\'%23ff1e38\' font-family=\'monospace\' font-size=\'16\'>CAD SPEC SCHEMATIC</text></svg>'"
          >

          <!-- Cockpit Badges -->
          <div class="absolute top-3 left-3 flex items-center gap-2">
            <span class="px-2 py-0.5 bg-pit-black/90 border border-pit-border text-[10px] font-mono text-slate-300">
              ${project.team}
            </span>
          </div>

          <div class="absolute top-3 right-3">
            <span class="px-2 py-0.5 bg-pit-neonRed text-white font-mono font-bold text-[10px] flex items-center gap-1 shadow-md">
              <i data-lucide="eye" class="w-3 h-3"></i>
              <span>${project.images.length} TELEMETRY VIEWS</span>
            </span>
          </div>

          <div class="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-pit-black via-pit-black/80 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[10px] text-slate-200">
            <span class="text-pit-neonRed flex items-center gap-1">
              <i data-lucide="maximize" class="w-3.5 h-3.5"></i>
              LAUNCH HIGH-RESOLUTION BLUEPRINT VIEWER
            </span>
            <span class="text-slate-400">ESC TO CLOSE</span>
          </div>
        </div>

        <!-- Spec Data Card Body -->
        <div class="p-6 flex-grow flex flex-col justify-between">
          <div>
            <div class="flex items-start justify-between gap-4 mb-2">
              <h3 class="text-xl font-bold text-white uppercase tracking-tight hover:text-pit-neonRed transition-colors">
                ${project.title}
              </h3>
              <span class="text-xs font-mono text-slate-400 shrink-0">${project.timeline}</span>
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap gap-1.5 mb-4">
              ${project.tags.map(t => `
                <span class="px-2 py-0.5 bg-pit-black text-slate-300 text-[10px] font-mono border border-pit-border">
                  \${t}
                </span>
              `).join('')}
            </div>

            <p class="text-xs text-slate-300 font-sans leading-relaxed mb-4">
              ${project.summary}
            </p>

            <!-- Technical Parameter Strip -->
            <div class="bg-pit-black border border-pit-border p-3 font-mono text-[11px] space-y-1.5 mb-4">
              ${Object.entries(project.engineeringSpecs).slice(0, 3).map(([key, val]) => `
                <div class="flex justify-between">
                  <span class="text-slate-400">\${key}:</span>
                  <span class="text-white font-bold">\${val}</span>
                </div>
              `).join('')}
            </div>

            <div class="space-y-1.5 text-xs text-slate-300 font-sans mb-6">
              ${project.executionHighlights.slice(0, 2).map(h => `
                <div class="flex items-start gap-2">
                  <span class="text-pit-neonRed font-mono font-bold">›</span>
                  <span>\${h}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="pt-4 border-t border-pit-border flex items-center justify-between font-mono text-xs">
            <button 
              onclick="openInspectorModal(${rawIndex}, 0)" 
              class="px-4 py-2 bg-pit-black hover:bg-pit-neonRed text-white transition-all flex items-center gap-2 border border-pit-border"
            >
              <i data-lucide="layers" class="w-3.5 h-3.5"></i>
              <span>INSPECT UNIT DATA (${project.images.length})</span>
            </button>
            <span class="text-[10px] text-slate-400">UNIT: ${project.id.toUpperCase()}</span>
          </div>

        </div>

      </article>
    `;
  }).join('');

  initLucide();
}

// 6. Filter Controls
function setupFilterButtons() {
  const btns = document.querySelectorAll('.filter-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => {
        b.classList.remove('active', 'bg-pit-neonRed', 'text-white', 'font-bold');
        b.classList.add('text-slate-400');
      });
      btn.classList.add('active', 'bg-pit-neonRed', 'text-white', 'font-bold');
      btn.classList.remove('text-slate-400');

      currentFilter = btn.getAttribute('data-filter') || 'all';
      renderProjectMatrix();
    });
  });
}

// 7. Blueprint Inspector Modal
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

  if (titleEl) titleEl.textContent = `${p.title} // TELEMETRY LOG`;
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
        class="w-16 h-12 border shrink-0 overflow-hidden bg-pit-black transition-all ${i === modalActiveImageIndex ? 'border-pit-neonRed ring-1 ring-pit-neonRed scale-105' : 'border-pit-border opacity-50 hover:opacity-100'}"
      >
        <img src="${img.src}" alt="${img.alt}" class="w-full h-full object-contain" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'64\' height=\'48\'><rect width=\'100%\' height=\'100%\' fill=\'%2305070a\'/></svg>'">
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

// 8. Instant Clipboard Copy Engine
function copyEmailToClipboard() {
  const email = "aibel@tamu.edu";
  navigator.clipboard.writeText(email).then(() => {
    const copyText = document.getElementById('copy-text');
    const copyIcon = document.getElementById('copy-icon');

    if (copyText) copyText.textContent = "COMMS LINK COPIED!";
    if (copyIcon) copyIcon.setAttribute('data-lucide', 'check');
    initLucide();

    showHudToast(`COPIED [${email}] TO CLIPBOARD`);

    setTimeout(() => {
      if (copyText) copyText.textContent = `COPY COMMS: ${email}`;
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