// State Management
let selectedProjectIndex = 0;
let selectedCanNodeIndex = 0;
let modalActiveProjectIndex = 0;
let modalActiveImageIndex = 0;

// Telemetry Replay Engine State
let telemetryTime = 0.0;
let isTelemetryPlaying = true; // Auto-plays on load so page feels immediately alive
let telemetryAnimFrame = null;
const TELEMETRY_DURATION = 12.0;

document.addEventListener('DOMContentLoaded', () => {
  initLucide();
  initAmbientCanvas();
  initScrollAnimations();
  init3DTilt();
  initTelemetryEngine();
  renderCanNodeSelector();
  renderBuildsConsole();
  setupKeyboardShortcuts();
});

function initLucide() {
  if (window.lucide) window.lucide.createIcons();
}

// 1. SCROLL REVEALS & NUMERICAL COUNTER ANIMATIONS
function initScrollAnimations() {
  const elements = document.querySelectorAll('.reveal-up, .reveal-card');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        
        // Check for counter numbers to animate
        const counters = entry.target.querySelectorAll('.counter');
        counters.forEach(counter => animateCounter(counter));

        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseFloat(el.getAttribute('data-target'));
  const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
  const duration = 1400; // ms
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Smooth easeOutExpo curve
    const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const current = start + (target - start) * ease;

    el.textContent = current.toFixed(decimals);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target.toFixed(decimals);
    }
  }

  requestAnimationFrame(update);
}

// 2. 3D CARD CURSOR-TILT PHYSICS
function init3DTilt() {
  const cards = document.querySelectorAll('[data-tilt]');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      const rotX = ((y - cy) / cy) * -6; // +/- 6 deg
      const rotY = ((x - cx) / cx) * 6;  // +/- 6 deg

      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-2px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

// 3. AMBIENT PARTICLES & TELEMETRY BACKGROUND CANVAS
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
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    size: Math.random() * 1.5 + 1
  }));

  function draw() {
    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
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

      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
}

// 4. MOTEC CHASSIS TELEMETRY ENGINE
function getTelemetrySample(t) {
  // Speed curve: 0 to 38.0 MPH with CVT shift progression
  const speed = Math.min(38.0, 38.0 * (1 - Math.exp(-t / 3.4)));

  // Primary Engine RPM: 1800 idle, quick stall jump to ~3600-3800 RPM governor
  const priRpm = t < 0.2 ? 1800 : 3650 + 150 * Math.sin(t * 1.8) + (Math.sin(t * 12.0) * 40);

  // Secondary CVT RPM: tracks speed linearly
  const secRpm = (speed / 38.0) * 3100 + 120;
  const ratio = (secRpm / priRpm).toFixed(2);

  // Lateral & Longitudinal G-forces
  let longG = 0;
  if (t < 2.5) {
    longG = 0.85 * (1 - t / 3.0);
  } else if (t > 10.5) {
    longG = -1.1; // Braking
  } else {
    longG = -0.15 * Math.sin(t * 2.5);
  }

  let latG = 0;
  if (t >= 3.0 && t <= 10.5) {
    latG = 1.35 * Math.sin((t - 3.0) * 1.45);
  }

  const totalG = Math.sqrt(latG * latG + longG * longG).toFixed(2);
  return { t, speed: speed.toFixed(1), priRpm: Math.round(priRpm), secRpm: Math.round(secRpm), ratio, latG, longG, totalG };
}

function initTelemetryEngine() {
  const scrubber = document.getElementById('telemetry-scrubber');
  if (scrubber) {
    scrubber.addEventListener('input', (e) => {
      telemetryTime = parseFloat(e.target.value);
      if (isTelemetryPlaying) pauseTelemetry();
      updateTelemetryUI();
    });
  }

  // Auto-start run on page load
  startTelemetry();
}

function toggleTelemetryPlayback() {
  if (isTelemetryPlaying) {
    pauseTelemetry();
  } else {
    startTelemetry();
  }
}

function startTelemetry() {
  isTelemetryPlaying = true;
  const playLabel = document.getElementById('telemetry-play-label');
  const playIcon = document.getElementById('telemetry-play-icon');
  if (playLabel) playLabel.textContent = 'PAUSE';
  if (playIcon) playIcon.setAttribute('data-lucide', 'pause');
  initLucide();

  let lastTimestamp = performance.now();

  function loop(now) {
    if (!isTelemetryPlaying) return;
    const delta = (now - lastTimestamp) / 1000;
    lastTimestamp = now;

    telemetryTime += delta;
    if (telemetryTime >= TELEMETRY_DURATION) {
      telemetryTime = 0;
    }

    const scrubber = document.getElementById('telemetry-scrubber');
    if (scrubber) scrubber.value = telemetryTime;

    updateTelemetryUI();
    telemetryAnimFrame = requestAnimationFrame(loop);
  }

  telemetryAnimFrame = requestAnimationFrame(loop);
}

function pauseTelemetry() {
  isTelemetryPlaying = false;
  if (telemetryAnimFrame) cancelAnimationFrame(telemetryAnimFrame);
  const playLabel = document.getElementById('telemetry-play-label');
  const playIcon = document.getElementById('telemetry-play-icon');
  if (playLabel) playLabel.textContent = 'PLAY RUN';
  if (playIcon) playIcon.setAttribute('data-lucide', 'play');
  initLucide();
}

function updateTelemetryUI() {
  const sample = getTelemetrySample(telemetryTime);

  const timeEl = document.getElementById('telemetry-time-readout');
  const speedEl = document.getElementById('readout-speed');
  const priRpmEl = document.getElementById('readout-pri-rpm');
  const secRpmEl = document.getElementById('readout-sec-rpm');
  const ratioEl = document.getElementById('readout-ratio');
  const gTotalEl = document.getElementById('friction-g-total');
  const latGEl = document.getElementById('friction-lat-g');
  const longGEl = document.getElementById('friction-long-g');

  if (timeEl) timeEl.textContent = `${telemetryTime.toFixed(2)}s`;
  if (speedEl) speedEl.textContent = `${sample.speed} MPH`;
  if (priRpmEl) priRpmEl.textContent = `${sample.priRpm.toLocaleString()} RPM`;
  if (secRpmEl) secRpmEl.textContent = `${sample.secRpm.toLocaleString()} RPM`;
  if (ratioEl) ratioEl.textContent = sample.ratio;
  if (gTotalEl) gTotalEl.textContent = `${sample.totalG} G`;
  if (latGEl) latGEl.textContent = `${sample.latG >= 0 ? '+' : ''}${sample.latG.toFixed(2)} G`;
  if (longGEl) longGEl.textContent = `${sample.longG >= 0 ? '+' : ''}${sample.longG.toFixed(2)} G`;

  renderFrictionCircleCanvas(sample);
  renderWaveformCanvas(telemetryTime);
}

function renderFrictionCircleCanvas(currentSample) {
  const canvas = document.getElementById('friction-circle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const radius = cx - 25;

  ctx.clearRect(0, 0, w, h);

  // Outer limit circle (1.6 G)
  ctx.strokeStyle = '#1f2738';
  ctx.lineWidth = 1.5;
  [0.33, 0.66, 1.0].forEach(r => {
    ctx.beginPath();
    ctx.arc(cx, cy, radius * r, 0, Math.PI * 2);
    ctx.stroke();
  });

  // Crosshairs
  ctx.beginPath();
  ctx.moveTo(cx, cy - radius);
  ctx.lineTo(cx, cy + radius);
  ctx.moveTo(cx - radius, cy);
  ctx.lineTo(cx + radius, cy);
  ctx.stroke();

  // Draw historic scatter trail
  const trailCount = 18;
  for (let i = trailCount; i >= 1; i--) {
    const pastT = Math.max(0, telemetryTime - (i * 0.05));
    const s = getTelemetrySample(pastT);
    const alpha = (1 - (i / trailCount)) * 0.55;
    const px = cx + (s.latG / 1.6) * radius;
    const py = cy - (s.longG / 1.6) * radius;

    ctx.fillStyle = `rgba(255, 77, 0, ${alpha})`;
    ctx.beginPath();
    ctx.arc(px, py, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Current G vector
  const curX = cx + (currentSample.latG / 1.6) * radius;
  const curY = cy - (currentSample.longG / 1.6) * radius;

  ctx.strokeStyle = 'rgba(255, 77, 0, 0.7)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(curX, curY);
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(curX, curY, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ff4d00';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function renderWaveformCanvas(currentTime) {
  const canvas = document.getElementById('waveform-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  const padL = 40;
  const padR = 20;
  const padT = 15;
  const padB = 25;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;

  // Grid
  ctx.strokeStyle = '#121622';
  ctx.lineWidth = 1;
  for (let s = 0; s <= 12; s += 2) {
    const x = padL + (s / 12) * plotW;
    ctx.beginPath();
    ctx.moveTo(x, padT);
    ctx.lineTo(x, h - padB);
    ctx.stroke();
  }
  for (let r = 0; r <= 4; r++) {
    const y = padT + (r / 4) * plotH;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(w - padR, y);
    ctx.stroke();
  }

  // Primary RPM Trace (Safety Orange)
  ctx.strokeStyle = '#ff4d00';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let t = 0; t <= 12; t += 0.08) {
    const s = getTelemetrySample(t);
    const px = padL + (t / 12) * plotW;
    const py = (h - padB) - ((s.priRpm - 1500) / 2500) * plotH;
    if (t === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  // Secondary RPM Trace (Ice Blue)
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let t = 0; t <= 12; t += 0.08) {
    const s = getTelemetrySample(t);
    const px = padL + (t / 12) * plotW;
    const py = (h - padB) - ((s.secRpm - 0) / 3500) * plotH;
    if (t === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  // Speed Trace (White)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  for (let t = 0; t <= 12; t += 0.08) {
    const s = getTelemetrySample(t);
    const px = padL + (t / 12) * plotW;
    const py = (h - padB) - (s.speed / 45.0) * plotH;
    if (t === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  // Scrubber Cursor Line
  const curX = padL + (currentTime / 12) * plotW;
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 3]);
  ctx.beginPath();
  ctx.moveTo(curX, padT);
  ctx.lineTo(curX, h - padB);
  ctx.stroke();
  ctx.setLineDash([]);
}

// 5. CAN FD BUS TOPOLOGY SWITCHER
function renderCanNodeSelector() {
  const container = document.getElementById('can-node-selector');
  if (!container || typeof canNodesData === 'undefined') return;

  container.innerHTML = canNodesData.map((node, idx) => `
    <button 
      onclick="selectCanNode(${idx})"
      class="text-left p-3.5 border transition-all ${idx === selectedCanNodeIndex ? 'bg-cold-gunmetal border-cold-pure text-cold-pure shadow-md' : 'bg-cold-void border-cold-border text-cold-slate hover:border-cold-borderLight hover:text-cold-pure'}"
    >
      <div class="flex justify-between items-center text-[10px] text-cold-subtle mb-1">
        <span>${node.id.toUpperCase()}</span>
        <span class="w-1.5 h-1.5 rounded-full ${idx === selectedCanNodeIndex ? 'bg-cold-safety' : 'bg-cold-borderLight'}"></span>
      </div>
      <div class="font-bold text-sm tracking-tight text-cold-pure truncate">${node.title}</div>
      <div class="text-[10px] text-cold-subtle mt-0.5 truncate">${node.controller}</div>
    </button>
  `).join('');

  renderCanNodeDetail();
}

function selectCanNode(idx) {
  selectedCanNodeIndex = idx;
  renderCanNodeSelector();
}

function renderCanNodeDetail() {
  const container = document.getElementById('can-node-detail');
  if (!container || typeof canNodesData === 'undefined') return;

  const node = canNodesData[selectedCanNodeIndex];

  container.innerHTML = `
    <div class="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-6 border-b border-cold-border gap-4">
      <div>
        <div class="text-[10px] font-mono text-cold-safety uppercase tracking-widest mb-1">
          CAN FD PHYSICAL TRANSCEIVER SPECIFICATIONS
        </div>
        <h3 class="text-2xl font-display font-extrabold text-cold-pure uppercase">${node.title}</h3>
      </div>
      <div class="flex flex-wrap gap-2 font-mono text-[11px]">
        <span class="px-2.5 py-1 bg-cold-titanium border border-cold-border text-cold-pure font-bold">${node.busSpeed}</span>
        <span class="px-2.5 py-1 bg-cold-titanium border border-cold-border text-cold-slate">${node.sampleRate}</span>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
      
      <!-- Left Hardware Specs -->
      <div class="space-y-3">
        <div class="text-cold-pure font-bold text-xs uppercase tracking-wider border-b border-cold-border pb-1">
          Embedded Architecture &amp; Hardware
        </div>
        <div class="space-y-1.5 text-cold-slate">
          <div><span class="text-cold-subtle">Microcontroller:</span> <strong class="text-cold-pure">${node.controller}</strong></div>
          <div><span class="text-cold-subtle">Transceiver IC:</span> <strong class="text-cold-pure">${node.transceiver}</strong></div>
        </div>

        <div class="pt-2">
          <span class="text-cold-subtle block mb-2 text-[10px] uppercase">Node Integration Parameters:</span>
          <ul class="space-y-1.5 font-sans text-xs text-cold-slate">
            ${node.hardwareSpecs.map(spec => `
              <li class="flex items-start gap-2">
                <span class="text-cold-safety font-mono font-bold">›</span>
                <span>\${spec}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>

      <!-- Right Payload Channels -->
      <div>
        <div class="text-cold-pure font-bold text-xs uppercase tracking-wider border-b border-cold-border pb-1 mb-3">
          Transmitted CAN FD Frame Payloads
        </div>
        <div class="space-y-2">
          ${node.payloadChannels.map(ch => `
            <div class="p-3 bg-cold-void border border-cold-border flex flex-col justify-between">
              <div class="flex justify-between items-center text-[11px] mb-1">
                <span class="font-bold text-cold-pure font-mono">${ch.id} //${ch.name}</span>
                <span class="px-1.5 py-0.5 bg-cold-titanium border border-cold-border text-cold-safety text-[10px]">\${ch.rate}</span>
              </div>
              <div class="text-[11px] text-cold-subtle font-mono truncate">
                DATA: \${ch.payload}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;
}

// 6. MASTER-DETAIL ENGINEERING BUILDS CONSOLE
function renderBuildsConsole() {
  const navContainer = document.getElementById('builds-nav-list');
  const stage = document.getElementById('builds-detail-stage');
  if (!navContainer || !stage || typeof projectsData === 'undefined') return;

  navContainer.innerHTML = projectsData.map((project, idx) => `
    <button 
      onclick="selectBuild(${idx})"
      class="w-full text-left p-4 border transition-all ${idx === selectedProjectIndex ? 'bg-cold-void border-cold-pure text-cold-pure shadow-lg' : 'bg-cold-gunmetal border-cold-border text-cold-slate hover:border-cold-borderLight hover:text-cold-pure'}"
    >
      <div class="flex items-center justify-between mb-1">
        <span class="text-[10px] font-mono text-cold-subtle uppercase">UNIT 0${idx + 1} // ${project.category.toUpperCase()}</span>
        <span class="text-[10px] font-mono text-cold-subtle">${project.timeline}</span>
      </div>
      <div class="font-display font-extrabold text-base tracking-tight">${project.title}</div>
      <div class="text-[11px] text-cold-subtle font-sans mt-0.5 truncate">${project.team}</div>
    </button>
  `).join('');

  const active = projectsData[selectedProjectIndex];
  const mainImg = active.images[0] || { src: '', alt: 'CAD Schematic' };

  stage.innerHTML = `
    <!-- Top Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-6 border-b border-cold-border gap-4">
      <div>
        <div class="text-[10px] font-mono text-cold-safety uppercase tracking-widest mb-1">
          SUBSYSTEM BREAKDOWN // ${active.team}
        </div>
        <h3 class="text-3xl font-display font-extrabold text-cold-pure uppercase">${active.title}</h3>
      </div>
      <div class="flex flex-wrap gap-1.5 font-mono text-[10px]">
        ${active.tags.map(t => `<span class="px-2 py-0.5 bg-cold-titanium border border-cold-border text-cold-slate">\${t}</span>`).join('')}
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
        class="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'600\' height=\'340\' viewBox=\'0 0 600 340\'><rect width=\'100%\' height=\'100%\' fill=\'%2306080c\'/><text x=\'50%\' y=\'50%\' dominant-baseline=\'middle\' text-anchor=\'middle\' fill=\'%23f8fafc\' font-family=\'monospace\' font-size=\'14\'>CAD HARDWARE BLUEPRINT</text></svg>'"
      >

      <div class="absolute top-3 right-3 px-2.5 py-1 bg-cold-void/90 border border-cold-border text-cold-pure font-mono text-[10px] font-bold">
        ${active.images.length} CAD CHANNELS
      </div>

      <div class="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-cold-void via-cold-void/80 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[10px] text-cold-pure">
        <span class="flex items-center gap-1.5">
          <i data-lucide="maximize-2" class="w-3.5 h-3.5"></i>
          CLICK TO LAUNCH HIGH-RESOLUTION BLUEPRINT VIEWER
        </span>
        <span class="text-cold-subtle">ESC TO CLOSE</span>
      </div>
    </div>

    <!-- Technical Parameters Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 font-mono text-xs">
      <div class="p-4 bg-cold-titanium border border-cold-border space-y-2">
        <div class="text-cold-pure font-bold border-b border-cold-border pb-1 text-[11px]">HARDWARE SPECIFICATIONS</div>
        ${Object.entries(active.engineeringSpecs).map(([k, v]) => `
          <div class="flex justify-between py-0.5">
            <span class="text-cold-subtle">\${k}:</span>
            <span class="text-cold-pure font-bold text-right">\${v}</span>
          </div>
        `).join('')}
      </div>

      <div class="p-4 bg-cold-titanium border border-cold-border space-y-2">
        <div class="text-cold-pure font-bold border-b border-cold-border pb-1 text-[11px]">VALIDATION HIGHLIGHTS</div>
        <div class="space-y-1.5 font-sans text-xs text-cold-slate pt-1">
          ${active.executionHighlights.slice(0, 3).map(h => `
            <div class="flex items-start gap-2">
              <span class="text-cold-pure font-mono font-bold">›</span>
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
        class="px-5 py-2.5 bg-cold-pure hover:bg-cold-silver text-cold-void font-bold transition-all flex items-center gap-2 active:scale-95"
      >
        <i data-lucide="layers" class="w-4 h-4"></i>
        <span>INSPECT BLUEPRINT SLIDES (${active.images.length})</span>
      </button>

      <span class="text-[10px] text-cold-subtle">UNIT: ${active.id.toUpperCase()}</span>
    </div>
  `;

  initLucide();
}

function selectBuild(index) {
  selectedProjectIndex = index;
  renderBuildsConsole();
}

// 7. FULLSCREEN BLUEPRINT LIGHTBOX
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
        class="w-16 h-12 border shrink-0 overflow-hidden bg-cold-void transition-all ${i === modalActiveImageIndex ? 'border-cold-pure ring-1 ring-cold-pure scale-105' : 'border-cold-border opacity-50 hover:opacity-100'}"
      >
        <img src="${img.src}" alt="${img.alt}" class="w-full h-full object-contain" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'64\' height=\'48\'><rect width=\'100%\' height=\'100%\' fill=\'%2306080c\'/></svg>'">
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

// 8. CLIPBOARD COPY ENGINE
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