// script.js
let currentFilter = 'all';
let modalActiveProjectIndex = 0;
let modalActiveImageIndex = 0;
let audioFxEnabled = true;
let isBlueprintMode = false;
let audioCtx = null;

document.addEventListener('DOMContentLoaded', () => {
  initLucide();
  initMissionClock();
  initRadarCanvas();
  initFrictionCircle();
  initOscilloscope();
  initLiveCanStream();
  renderProjectMatrix();
  setupFilterButtons();
  setupKeyboardShortcuts();
});

function initLucide() {
  if (window.lucide) window.lucide.createIcons();
}

// 1. Web Audio API Synthesizer (No external audio files needed)
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

function playBeep(freq = 800, duration = 0.05, type = 'sine') {
  if (!audioFxEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Audio context may be restricted by autoplay policy
  }
}

function toggleAudioFx() {
  audioFxEnabled = !audioFxEnabled;
  const label = document.getElementById('sfx-label');
  const icon = document.getElementById('sfx-icon');
  if (audioFxEnabled) {
    playBeep(990, 0.06);
    if (label) label.textContent = 'AVIONICS AUDIO: LIVE';
    if (icon) icon.setAttribute('data-lucide', 'volume-2');
  } else {
    if (label) label.textContent = 'AVIONICS AUDIO: MUTED';
    if (icon) icon.setAttribute('data-lucide', 'volume-x');
  }
  initLucide();
}

// 2. Mission Elapsed Clock (College Station CDT)
function initMissionClock() {
  const clockEl = document.getElementById('mission-clock');
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

// 3. Radar Background Canvas
function initRadarCanvas() {
  const canvas = document.getElementById('radar-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  const blips = Array.from({ length: 28 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    size: Math.random() * 2 + 1
  }));

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // Coordinate links
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
    ctx.lineWidth = 0.8;
    for (let i = 0; i < blips.length; i++) {
      for (let j = i + 1; j < blips.length; j++) {
        const dx = blips[i].x - blips[j].x;
        const dy = blips[i].y - blips[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 150) {
          ctx.beginPath();
          ctx.moveTo(blips[i].x, blips[i].y);
          ctx.lineTo(blips[j].x, blips[j].y);
          ctx.stroke();
        }
      }
    }

    blips.forEach(b => {
      b.x += b.vx;
      b.y += b.vy;
      if (b.x < 0 || b.x > w) b.vx *= -1;
      if (b.y < 0 || b.y > h) b.vy *= -1;

      ctx.fillStyle = '#00f0ff';
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
}

// 4. MFD Friction Circle (G-G Diagram)
function initFrictionCircle() {
  const canvas = document.getElementById('friction-circle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const maxR = 48;

  let gHistory = [];
  let lat = 0;
  let lon = 0;
  const gLoadEl = document.getElementById('hud-g-load');

  function render() {
    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = '#152136';
    ctx.lineWidth = 1;
    [0.33, 0.66, 1].forEach(r => {
      ctx.beginPath();
      ctx.arc(cx, cy, maxR * r, 0, Math.PI * 2);
      ctx.stroke();
    });

    ctx.beginPath();
    ctx.moveTo(cx, cy - maxR);
    ctx.lineTo(cx, cy + maxR);
    ctx.moveTo(cx - maxR, cy);
    ctx.lineTo(cx + maxR, cy);
    ctx.stroke();

    lat += (Math.random() - 0.5) * 0.16;
    lon += (Math.random() - 0.5) * 0.16;
    lat = Math.max(-1.4, Math.min(1.4, lat * 0.98));
    lon = Math.max(-1.4, Math.min(1.4, lon * 0.98));

    gHistory.push({ x: lat, y: lon });
    if (gHistory.length > 20) gHistory.shift();

    gHistory.forEach((pt, i) => {
      const alpha = (i / gHistory.length) * 0.6;
      ctx.fillStyle = `rgba(255, 23, 68, ${alpha})`;
      ctx.beginPath();
      ctx.arc(cx + (pt.x / 1.5) * maxR, cy - (pt.y / 1.5) * maxR, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    const px = cx + (lat / 1.5) * maxR;
    const py = cy - (lon / 1.5) * maxR;
    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.arc(px, py, 3.5, 0, Math.PI * 2);
    ctx.fill();

    if (gLoadEl) {
      const totalG = Math.sqrt(lat * lat + lon * lon).toFixed(2);
      gLoadEl.textContent = `+${totalG} G`;
    }

    requestAnimationFrame(render);
  }
  render();
}

// 5. MFD Oscilloscope Waveform
function initOscilloscope() {
  const canvas = document.getElementById('oscilloscope-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  let phase = 0;

  function render() {
    ctx.clearRect(0, 0, w, h);

    // Oscilloscope grid lines
    ctx.strokeStyle = '#0e1828';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 25) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Oscilloscope wave
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
      const y = h / 2 + Math.sin(x * 0.08 + phase) * 22 + (Math.random() - 0.5) * 4;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    phase += 0.12;
    requestAnimationFrame(render);
  }
  render();
}

// 6. Live CAN FD Bus Serial Stream
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
    line.className = 'flex justify-between font-mono text-[9px] text-telemetry-stealthText';
    line.innerHTML = `<span>[CAN FD] ${id}</span><span class="text-telemetry-cyan">${byte1} ${byte2} ${byte3} ${byte4}</span><span class="text-telemetry-tachGreen font-bold">CRC:PASS</span>`;
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

// 7. Render Project Hardware Matrix with 3D Tilt
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
      <article 
        class="mfd-card bg-telemetry-panel border border-telemetry-border overflow-hidden flex flex-col justify-between"
        onmousemove="handleCardTilt(event, this)"
        onmouseleave="resetCardTilt(this)"
      >
        
        <!-- Viewport Stage -->
        <div class="relative w-full aspect-[16/10] bg-telemetry-void border-b border-telemetry-border overflow-hidden group cursor-pointer" onclick="openInspectorModal(${rawIndex}, 0)">
          <img 
            src="${mainImg.src}" 
            alt="${mainImg.alt}"
            class="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
            onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'600\' height=\'375\' viewBox=\'0 0 600 375\'><rect width=\'100%\' height=\'100%\' fill=\'%2302050a\'/><text x=\'50%\' y=\'50%\' dominant-baseline=\'middle\' text-anchor=\'middle\' fill=\'%2300f0ff\' font-family=\'monospace\' font-size=\'16\'>CAD SPEC SCHEMATIC</text></svg>'"
          >

          <!-- Cockpit Badges -->
          <div class="absolute top-3 left-3 flex items-center gap-2">
            <span class="px-2 py-0.5 bg-telemetry-void/90 border border-telemetry-border text-[10px] font-mono text-slate-300">
              ${project.team}
            </span>
          </div>

          <div class="absolute top-3 right-3">
            <span class="px-2 py-0.5 bg-telemetry-plasma text-white font-mono font-bold text-[10px] flex items-center gap-1 shadow-md">
              <i data-lucide="eye" class="w-3 h-3"></i>
              <span>${project.images.length} TELEMETRY VIEWS</span>
            </span>
          </div>

          <div class="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-telemetry-void via-telemetry-void/80 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[10px] text-slate-200">
            <span class="text-telemetry-cyan flex items-center gap-1">
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
              <h3 class="text-xl font-hud font-bold text-white uppercase tracking-tight hover:text-telemetry-cyan transition-colors">
                ${project.title}
              </h3>
              <span class="text-xs font-mono text-slate-400 shrink-0">${project.timeline}</span>
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap gap-1.5 mb-4">
              ${project.tags.map(t => `
                <span class="px-2 py-0.5 bg-telemetry-void text-slate-300 text-[10px] font-mono border border-telemetry-border">
                  \${t}
                </span>
              `).join('')}
            </div>

            <p class="text-xs text-slate-300 font-tech leading-relaxed mb-4">
              ${project.summary}
            </p>

            <!-- Technical Parameter Strip -->
            <div class="bg-telemetry-void border border-telemetry-border p-3 font-mono text-[11px] space-y-1.5 mb-4">
              ${Object.entries(project.engineeringSpecs).slice(0, 3).map(([key, val]) => `
                <div class="flex justify-between">
                  <span class="text-telemetry-stealthText">\${key}:</span>
                  <span class="text-white font-bold">\${val}</span>
                </div>
              `).join('')}
            </div>

            <div class="space-y-1.5 text-xs text-slate-300 font-tech mb-6">
              ${project.executionHighlights.slice(0, 2).map(h => `
                <div class="flex items-start gap-2">
                  <span class="text-telemetry-cyan font-mono font-bold">›</span>
                  <span>\${h}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="pt-4 border-t border-telemetry-border flex items-center justify-between font-mono text-xs">
            <button 
              onclick="openInspectorModal(${rawIndex}, 0)" 
              class="px-4 py-2 bg-telemetry-void hover:bg-telemetry-cyan hover:text-telemetry-void text-white transition-all flex items-center gap-2 border border-telemetry-border clip-corner font-hud text-[11px] font-bold"
            >
              <i data-lucide="layers" class="w-3.5 h-3.5"></i>
              <span>INSPECT UNIT DATA (${project.images.length})</span>
            </button>
            <span class="text-[10px] text-slate-500">UNIT: ${project.id.toUpperCase()}</span>
          </div>

        </div>

      </article>
    `;
  }).join('');

  initLucide();
}

// 8. 3D Card Physics Tilt Handler
function handleCardTilt(e, card) {
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const rotateX = ((y - centerY) / centerY) * -6;
  const rotateY = ((x - centerX) / centerX) * 6;

  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
}

function resetCardTilt(card) {
  card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
}

// 9. Filter Controls
function setupFilterButtons() {
  const btns = document.querySelectorAll('.filter-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      playBeep(750, 0.04);
      btns.forEach(b => {
        b.classList.remove('active', 'bg-telemetry-cyan', 'text-telemetry-void', 'font-bold');
        b.classList.add('text-slate-400');
      });
      btn.classList.add('active', 'bg-telemetry-cyan', 'text-telemetry-void', 'font-bold');
      btn.classList.remove('text-slate-400');

      currentFilter = btn.getAttribute('data-filter') || 'all';
      renderProjectMatrix();
    });
  });
}

// 10. Blueprint Inspector Modal
function openInspectorModal(pIdx, iIdx = 0) {
  playBeep(880, 0.05);
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
  playBeep(440, 0.04);
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

  if (titleEl) titleEl.textContent = `${p.title} // TELEMETRY LOG`;
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
        class="w-16 h-12 border shrink-0 overflow-hidden bg-telemetry-void transition-all ${i === modalActiveImageIndex ? 'border-telemetry-cyan ring-1 ring-telemetry-cyan scale-105' : 'border-telemetry-border opacity-50 hover:opacity-100'}"
      >
        <img src="${img.src}" alt="${img.alt}" class="w-full h-full object-contain" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'64\' height=\'48\'><rect width=\'100%\' height=\'100%\' fill=\'%2302050a\'/></svg>'">
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

// 11. Instant Clipboard Copy Engine
function copyEmailToClipboard() {
  const email = "aibel@tamu.edu";
  navigator.clipboard.writeText(email).then(() => {
    playBeep(1040, 0.08);
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