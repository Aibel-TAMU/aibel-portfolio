// State Management
let selectedProjectIndex = 0;
let modalActiveProjectIndex = 0;
let modalActiveImageIndex = 0;
let audioEnabled = true;
let isBlueprintMode = false;
let audioCtx = null;

// Gyro / PFD Attitude State
let attitudePitch = 0;
let attitudeRoll = 0;

document.addEventListener('DOMContentLoaded', () => {
  initLucide();
  initHudClock();
  initAmbientCanvas();
  initPfdCanvas();
  initLiveCanStream();
  initTireCurveBench();
  renderProjectConsole();
  setupKeyboardShortcuts();
});

function initLucide() {
  if (window.lucide) window.lucide.createIcons();
}

// 1. Audio Synthesizer (Zero External Dependencies)
function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playBeep(freq = 750, duration = 0.04, type = 'sine') {
  if (!audioEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Autoplay restrictions handle gracefully
  }
}

function toggleAudio() {
  audioEnabled = !audioEnabled;
  const label = document.getElementById('audio-label');
  const icon = document.getElementById('audio-icon');

  if (audioEnabled) {
    playBeep(900, 0.06);
    if (label) label.textContent = 'AVIONICS AUDIO: ON';
    if (icon) icon.setAttribute('data-lucide', 'volume-2');
  } else {
    if (label) label.textContent = 'AVIONICS AUDIO: OFF';
    if (icon) icon.setAttribute('data-lucide', 'volume-x');
  }
  initLucide();
}

// 2. HUD Clock (Central Daylight Time)
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

// 3. Ambient Background Particle / Grid Canvas
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  const particles = Array.from({ length: 32 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    size: Math.random() * 1.5 + 1
  }));

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // Draw connection lines
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.08)';
    ctx.lineWidth = 0.8;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 140) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      ctx.fillStyle = '#00f2fe';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
}

// 4. Primary Flight Display (PFD) Attitude Gyro Canvas
function initPfdCanvas() {
  const canvas = document.getElementById('pfd-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;

  const readoutEl = document.getElementById('gyro-attitude-readout');

  // Interactive mouse coupling to pitch & roll
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    attitudeRoll = (x / (rect.width / 2)) * 35; // +/- 35 deg roll
    attitudePitch = (y / (rect.height / 2)) * -25; // +/- 25 deg pitch

    if (readoutEl) {
      readoutEl.textContent = `P: ${attitudePitch.toFixed(1)}° | R: ${attitudeRoll.toFixed(1)}°`;
    }
  });

  canvas.addEventListener('mouseleave', () => {
    attitudeRoll = 0;
    attitudePitch = 0;
    if (readoutEl) readoutEl.textContent = `P: 0.0° | R: 0.0°`;
  });

  function draw() {
    ctx.clearRect(0, 0, w, h);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((attitudeRoll * Math.PI) / 180);

    const pitchOffset = (attitudePitch * 2.2);

    // Sky & Ground Segments
    ctx.fillStyle = '#09152b';
    ctx.fillRect(-w, -h + pitchOffset, w * 2, h);
    ctx.fillStyle = '#0a1017';
    ctx.fillRect(-w, pitchOffset, w * 2, h);

    // Horizon line
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-w, pitchOffset);
    ctx.lineTo(w, pitchOffset);
    ctx.stroke();

    // Pitch ladder rungs
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    [-20, -10, 10, 20].forEach(deg => {
      const y = pitchOffset - (deg * 2.2);
      const rungWidth = 35;
      ctx.beginPath();
      ctx.moveTo(-rungWidth, y);
      ctx.lineTo(rungWidth, y);
      ctx.stroke();
    });

    ctx.restore();

    // Fixed Aircraft Crosshair Reticle (HUD Glass Overlay)
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 30, cy);
    ctx.lineTo(cx - 10, cy);
    ctx.lineTo(cx - 10, cy + 6);
    ctx.moveTo(cx + 30, cy);
    ctx.lineTo(cx + 10, cy);
    ctx.lineTo(cx + 10, cy + 6);
    ctx.stroke();

    ctx.fillStyle = '#00f2fe';
    ctx.beginPath();
    ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(draw);
  }
  draw();
}

// 5. Live CAN FD Serial Sniffer Stream
function initLiveCanStream() {
  const container = document.getElementById('live-can-stream');
  if (!container) return;

  const canIds = ['0x102', '0x1F4', '0x2A0', '0x0C8', '0x3B2'];

  setInterval(() => {
    const id = canIds[Math.floor(Math.random() * canIds.length)];
    const b1 = Math.floor(Math.random() * 255).toString(16).padStart(2, '0').toUpperCase();
    const b2 = Math.floor(Math.random() * 255).toString(16).padStart(2, '0').toUpperCase();
    const b3 = Math.floor(Math.random() * 255).toString(16).padStart(2, '0').toUpperCase();
    const b4 = Math.floor(Math.random() * 255).toString(16).padStart(2, '0').toUpperCase();

    const line = document.createElement('div');
    line.className = 'flex justify-between font-mono text-[9px] text-cold-graphite';
    line.innerHTML = `<span>[CAN FD] ${id}</span><span class="text-cold-cyan font-bold">${b1} ${b2} ${b3} ${b4}</span><span class="text-white">CRC:PASS</span>`;
    container.appendChild(line);

    if (container.children.length > 5) {
      container.removeChild(container.firstChild);
    }
  }, 420);
}

// 6. Empirical Tire Stiffness Simulation Bench
function initTireCurveBench() {
  const slider = document.getElementById('psi-slider');
  const psiReadout = document.getElementById('psi-readout');
  const kReadout = document.getElementById('calculated-k');
  const defReadout = document.getElementById('calculated-deflection');
  const busBar = document.getElementById('can-bus-bar');
  const busPercent = document.getElementById('can-bus-percent');

  const canvas = document.getElementById('curve-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function renderCurve(psi) {
    // Empirical non-linear relationship: K ~ 120 + 19.1 * PSI
    const k = 120 + 19.1 * psi;
    const peakDeflection = (600 / k).toFixed(2); // Deflection at 600 lbf normal load

    if (psiReadout) psiReadout.textContent = `${psi.toFixed(1)} PSI`;
    if (kReadout) kReadout.textContent = `${k.toFixed(1)} lbf/in`;
    if (defReadout) defReadout.textContent = `${peakDeflection} inches`;

    // Dynamic Bus load simulation
    const util = (16.2 + psi * 0.55).toFixed(1);
    if (busBar) busBar.style.width = `${util}%`;
    if (busPercent) busPercent.textContent = `${util}% (Nominal)`;

    // Draw Force-Displacement Chart
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const padLeft = 45;
    const padBottom = 35;
    const padTop = 20;
    const padRight = 20;

    // Grid lines
    ctx.strokeStyle = '#131b2b';
    ctx.lineWidth = 1;
    for (let x = padLeft; x < w - padRight; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, padTop);
      ctx.lineTo(x, h - padBottom);
      ctx.stroke();
    }
    for (let y = padTop; y < h - padBottom; y += 45) {
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(w - padRight, y);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#1f2b42';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padLeft, padTop);
    ctx.lineTo(padLeft, h - padBottom);
    ctx.lineTo(w - padRight, h - padBottom);
    ctx.stroke();

    // Plot Force Curve: F(x) = K * x^1.08 (slight progressive stiffening)
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    const maxDisp = 4.5; // inches
    const maxForce = 900; // lbf

    for (let d = 0; d <= maxDisp; d += 0.05) {
      const force = k * Math.pow(d, 1.05);
      const px = padLeft + (d / maxDisp) * (w - padLeft - padRight);
      const py = (h - padBottom) - (force / maxForce) * (h - padBottom - padTop);

      if (d === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Mark 600 lbf operating point
    const opDisp = parseFloat(peakDeflection);
    const markX = padLeft + (opDisp / maxDisp) * (w - padLeft - padRight);
    const markY = (h - padBottom) - (600 / maxForce) * (h - padBottom - padTop);

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(markX, markY, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#00f2fe';
    ctx.font = '10px JetBrains Mono';
    ctx.fillText(`600 lbf @ ${opDisp}"`, markX + 8, markY - 8);
  }

  if (slider) {
    slider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      playBeep(450 + val * 60, 0.02);
      renderCurve(val);
    });
    renderCurve(parseFloat(slider.value));
  }
}

// 7. Master-Detail Project Console Switcher
function renderProjectConsole() {
  const navContainer = document.getElementById('project-nav-list');
  const stage = document.getElementById('project-detail-stage');
  if (!navContainer || !stage || typeof projectsData === 'undefined') return;

  // Render Left Navigation List
  navContainer.innerHTML = projectsData.map((project, idx) => `
    <button 
      onclick="selectProject(${idx})"
      class="w-full text-left p-3.5 border transition-all ${idx === selectedProjectIndex ? 'bg-cold-void border-cold-cyan text-white shadow-[0_0_20px_rgba(0,242,254,0.15)]' : 'bg-cold-titanium border-cold-border text-cold-tungsten hover:border-cold-borderLight hover:text-white'}"
    >
      <div class="flex items-center justify-between mb-1">
        <span class="text-[9px] font-mono text-cold-graphite uppercase">UNIT 0${idx + 1} // ${project.category.toUpperCase()}</span>
        <span class="text-[9px] font-mono text-cold-cyan">${project.timeline}</span>
      </div>
      <div class="font-display font-bold text-sm tracking-tight">${project.title}</div>
      <div class="text-[10px] text-cold-graphite font-sans mt-0.5 truncate">${project.team}</div>
    </button>
  `).join('');

  // Render Right Detail Stage
  const activeProject = projectsData[selectedProjectIndex];
  const mainImg = activeProject.images[0] || { src: '', alt: 'CAD Schematic' };

  stage.innerHTML = `
    <!-- Top Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-6 border-b border-cold-border gap-4">
      <div>
        <div class="text-[10px] font-mono text-cold-cyan uppercase tracking-widest mb-1">
          SUBSYSTEM BREAKDOWN // ${activeProject.team}
        </div>
        <h3 class="text-2xl font-display font-bold text-white uppercase">${activeProject.title}</h3>
      </div>
      <div class="flex flex-wrap gap-1.5 font-mono text-[10px]">
        ${activeProject.tags.map(t => `<span class="px-2 py-0.5 bg-cold-steel border border-cold-border text-slate-300">\${t}</span>`).join('')}
      </div>
    </div>

    <!-- Image Stage -->
    <div 
      class="relative w-full aspect-[16/9] bg-cold-void border border-cold-border overflow-hidden mb-6 group cursor-pointer"
      onclick="openInspectorModal(${selectedProjectIndex}, 0)"
    >
      <img 
        src="${mainImg.src}" 
        alt="${mainImg.alt}"
        class="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
        onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'600\' height=\'340\' viewBox=\'0 0 600 340\'><rect width=\'100%\' height=\'100%\' fill=\'%2304060a\'/><text x=\'50%\' y=\'50%\' dominant-baseline=\'middle\' text-anchor=\'middle\' fill=\'%2300f2fe\' font-family=\'monospace\' font-size=\'14\'>CAD HARDWARE BLUEPRINT</text></svg>'"
      >

      <div class="absolute top-3 right-3 px-2.5 py-1 bg-cold-void/90 border border-cold-border text-cold-cyan font-mono text-[10px] font-bold">
        ${activeProject.images.length} CAD CHANNELS
      </div>

      <div class="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-cold-void via-cold-void/80 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[10px] text-slate-300">
        <span class="text-cold-cyan flex items-center gap-1">
          <i data-lucide="maximize" class="w-3.5 h-3.5"></i>
          CLICK TO LAUNCH HIGH-RESOLUTION BLUEPRINT VIEWER
        </span>
        <span class="text-cold-graphite">KEYBOARD [ESC] TO CLOSE</span>
      </div>
    </div>

    <!-- Technical Parameters Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 font-mono text-xs">
      <div class="p-4 bg-cold-steel border border-cold-border space-y-2">
        <div class="text-white font-bold border-b border-cold-border pb-1 text-[11px]">HARDWARE SPECIFICATIONS</div>
        ${Object.entries(activeProject.engineeringSpecs).map(([k, v]) => `
          <div class="flex justify-between py-0.5">
            <span class="text-cold-graphite">\${k}:</span>
            <span class="text-white font-semibold text-right">\${v}</span>
          </div>
        `).join('')}
      </div>

      <div class="p-4 bg-cold-steel border border-cold-border space-y-2">
        <div class="text-white font-bold border-b border-cold-border pb-1 text-[11px]">VALIDATION HIGHLIGHTS</div>
        <div class="space-y-1.5 font-sans text-xs text-slate-300 pt-1">
          ${activeProject.executionHighlights.slice(0, 3).map(h => `
            <div class="flex items-start gap-2">
              <span class="text-cold-cyan font-mono font-bold">›</span>
              <span>\${h}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Bottom Actions -->
    <div class="pt-4 border-t border-cold-border flex items-center justify-between font-mono text-xs">
      <button 
        onclick="openInspectorModal(${selectedProjectIndex}, 0)"
        class="px-5 py-2.5 bg-cold-cyan hover:bg-white text-cold-void font-bold transition-all flex items-center gap-2 clip-corner shadow-[0_0_20px_rgba(0,242,254,0.25)]"
      >
        <i data-lucide="layers" class="w-4 h-4"></i>
        <span>INSPECT BLUEPRINT SLIDES (${activeProject.images.length})</span>
      </button>

      <span class="text-[10px] text-cold-graphite">UNIT_REF: ${activeProject.id.toUpperCase()}</span>
    </div>
  `;

  initLucide();
}

function selectProject(index) {
  playBeep(700, 0.03);
  selectedProjectIndex = index;
  renderProjectConsole();
}

// 8. Fullscreen Inspector Modal & Blueprint Shader Engine
function openInspectorModal(pIdx, iIdx = 0) {
  playBeep(850, 0.05);
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
  playBeep(450, 0.04);
  const modal = document.getElementById('inspector-modal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function toggleBlueprintMode() {
  isBlueprintMode = !isBlueprintMode;
  playBeep(isBlueprintMode ? 1200 : 600, 0.06);

  const img = document.getElementById('modal-active-img');
  const label = document.getElementById('blueprint-toggle-label');

  if (img) img.classList.toggle('blueprint-mode', isBlueprintMode);
  if (label) label.textContent = isBlueprintMode ? 'BLUEPRINT SHADER: ON' : 'BLUEPRINT SHADER: OFF';
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
    activeImgEl.classList.toggle('blueprint-mode', isBlueprintMode);
  }

  if (thumbStrip) {
    thumbStrip.innerHTML = p.images.map((img, i) => `
      <button 
        onclick="navigateModalImageTo(${i})" 
        class="w-16 h-12 border shrink-0 overflow-hidden bg-cold-void transition-all ${i === modalActiveImageIndex ? 'border-cold-cyan ring-1 ring-cold-cyan scale-105' : 'border-cold-border opacity-50 hover:opacity-100'}"
      >
        <img src="${img.src}" alt="${img.alt}" class="w-full h-full object-contain" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'64\' height=\'48\'><rect width=\'100%\' height=\'100%\' fill=\'%2304060a\'/></svg>'">
      </button>
    `).join('');
  }
}

function navigateModalImage(direction) {
  playBeep(700, 0.03);
  const p = projectsData[modalActiveProjectIndex];
  if (!p) return;
  const len = p.images.length;
  modalActiveImageIndex = (modalActiveImageIndex + direction + len) % len;
  updateModalView();
}

function navigateModalImageTo(idx) {
  playBeep(700, 0.03);
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
    if (e.key.toLowerCase() === 'b') toggleBlueprintMode();
  });
}

// 9. Instant Comms Clipboard Copy Tool
function copyEmailToClipboard() {
  const email = "aibel@tamu.edu";
  navigator.clipboard.writeText(email).then(() => {
    playBeep(1050, 0.08);
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