let modalActiveProjectIndex = 0;
let modalActiveImageIndex = 0;
let activeProjectCategory = 'all';

// Telemetry State
let telemetryTime = 0.0;
let isTelemetryPlaying = true;
let telemetrySpeedMultiplier = 1.0;
let telemetryAnimFrame = null;
const TELEMETRY_DURATION = 12.0;

document.addEventListener('DOMContentLoaded', function() {
  initStarfieldEngine();
  initLucide();
  renderContinuousProjectsFeed();
  initScrollAnimations();
  initScrollProgress();
  initMissionClock();
  initTelemetryEngine();
  setupKeyboardShortcuts();
});

function initLucide() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

// 1. DYNAMIC STARFIELD & WHITE SPARK PARTICLE ENGINE
function initStarfieldEngine() {
  const canvas = document.getElementById('starfield-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', function() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  });

  let mouse = { x: -1000, y: -1000 };
  window.addEventListener('mousemove', function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  let stars = [];
  let sparks = [];
  let shootingStars = [];

  const STAR_COUNT = Math.floor((width * height) / 4500);
  const SPARK_COUNT = Math.floor((width * height) / 14000);

  function initParticles() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.2 + 0.3,
        alpha: Math.random() * 0.7 + 0.2,
        twinkleSpeed: Math.random() * 0.025 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2
      });
    }

    sparks = [];
    for (let i = 0; i < SPARK_COUNT; i++) {
      sparks.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        size: Math.random() * 1.8 + 0.8,
        pulse: Math.random() * Math.PI * 2,
        color: Math.random() > 0.85 ? '#38bdf8' : '#ffffff'
      });
    }
  }

  function spawnShootingStar() {
    if (Math.random() < 0.008 && shootingStars.length < 2) {
      shootingStars.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.4),
        length: Math.random() * 90 + 50,
        speed: Math.random() * 12 + 10,
        angle: (Math.PI / 4) + (Math.random() - 0.5) * 0.2,
        opacity: 1.0,
        decay: Math.random() * 0.02 + 0.015
      });
    }
  }

  initParticles();

  function render() {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Twinkling stars
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.twinklePhase += s.twinkleSpeed;
      const currentAlpha = Math.max(0.1, s.alpha + Math.sin(s.twinklePhase) * 0.35);

      ctx.fillStyle = 'rgba(255, 255, 255, ' + currentAlpha + ')';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Drifting sparks
    for (let i = 0; i < sparks.length; i++) {
      const sp = sparks[i];

      const dx = mouse.x - sp.x;
      const dy = mouse.y - sp.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 140) {
        const force = (140 - dist) / 140;
        sp.x -= (dx / dist) * force * 1.5;
        sp.y -= (dy / dist) * force * 1.5;
      }

      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.pulse += 0.04;

      if (sp.x < 0) sp.x = width;
      if (sp.x > width) sp.x = 0;
      if (sp.y < 0) sp.y = height;
      if (sp.y > height) sp.y = 0;

      const dynamicAlpha = 0.5 + Math.sin(sp.pulse) * 0.45;
      ctx.fillStyle = sp.color === '#ffffff' 
        ? 'rgba(255, 255, 255, ' + dynamicAlpha + ')' 
        : 'rgba(56, 189, 248, ' + dynamicAlpha + ')';

      ctx.shadowBlur = 6;
      ctx.shadowColor = sp.color;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Shooting stars
    spawnShootingStar();
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const ss = shootingStars[i];
      ss.x += Math.cos(ss.angle) * ss.speed;
      ss.y += Math.sin(ss.angle) * ss.speed;
      ss.opacity -= ss.decay;

      if (ss.opacity <= 0 || ss.x > width || ss.y > height) {
        shootingStars.splice(i, 1);
        continue;
      }

      const tailX = ss.x - Math.cos(ss.angle) * ss.length;
      const tailY = ss.y - Math.sin(ss.angle) * ss.length;

      const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      grad.addColorStop(1, 'rgba(255, 255, 255, ' + ss.opacity + ')');

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(ss.x, ss.y);
      ctx.stroke();
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

// 2. LIVE MISSION TIME & SCROLL PROGRESS
function initMissionClock() {
  const clockEl = document.getElementById('mission-clock');
  if (!clockEl) return;
  function update() {
    const now = new Date();
    clockEl.textContent = now.toISOString().substring(11, 19) + ' UTC';
  }
  update();
  setInterval(update, 1000);
}

function initScrollProgress() {
  const bar = document.getElementById('scroll-progress-bar');
  if (!bar) return;
  window.addEventListener('scroll', function() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = progress + '%';
  });
}

// 3. IMAGE ERROR FALLBACK HANDLER
window.handleImgError = function(img) {
  img.onerror = null;
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><rect width="100%" height="100%" fill="#07090e"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#475569" font-family="monospace" font-size="16">CAD SPECIFICATION SCHEMATIC // RECORD SYNCED</text></svg>'
  );
};

// 4. INLINE PROJECT SLIDE SWITCHER
window.switchProjectCardSlide = function(pIdx, slideIdx) {
  const source = window.projectsData;
  if (!Array.isArray(source) || !source[pIdx]) return;
  const project = source[pIdx];
  if (!project.images || !project.images[slideIdx]) return;

  const mainImg = document.getElementById('card-img-' + project.id);
  const captionEl = document.getElementById('card-caption-' + project.id);
  const counterEl = document.getElementById('card-counter-' + project.id);

  if (mainImg) {
    mainImg.src = project.images[slideIdx].src;
    mainImg.alt = project.images[slideIdx].alt;
  }
  if (captionEl) {
    captionEl.textContent = project.images[slideIdx].alt || 'Blueprint Spec';
  }
  if (counterEl) {
    counterEl.textContent = 'SLIDE ' + (slideIdx + 1) + ' OF ' + project.images.length;
  }

  // Update active border highlight across thumbnail ribbon
  const thumbs = document.querySelectorAll('.card-thumb-' + project.id);
  thumbs.forEach(function(btn, idx) {
    if (idx === slideIdx) {
      btn.className = 'card-thumb-' + project.id + ' w-12 h-9 border shrink-0 overflow-hidden bg-black transition-all border-cold-pure ring-1 ring-cold-pure scale-105';
    } else {
      btn.className = 'card-thumb-' + project.id + ' w-12 h-9 border shrink-0 overflow-hidden bg-black transition-all border-cold-border opacity-50 hover:opacity-100';
    }
  });
};

// 5. PROJECT CATEGORY FILTER & RIVER GENERATION
window.setProjectFilter = function(category) {
  activeProjectCategory = category;
  document.querySelectorAll('.project-filter-btn').forEach(function(btn) {
    if (btn.getAttribute('data-filter') === category) {
      btn.className = 'project-filter-btn px-3 py-1.5 bg-cold-pure text-black font-bold transition-all';
    } else {
      btn.className = 'project-filter-btn px-3 py-1.5 text-cold-slate hover:text-cold-pure transition-all';
    }
  });
  renderContinuousProjectsFeed();
};

function renderContinuousProjectsFeed() {
  const container = document.getElementById('projects-feed-container');
  const source = window.projectsData;
  if (!container || !Array.isArray(source)) return;

  const filtered = activeProjectCategory === 'all'
    ? source
    : source.filter(function(p) { return p.category === activeProjectCategory; });

  let html = '';
  for (let pIdx = 0; pIdx < filtered.length; pIdx++) {
    const project = filtered[pIdx];
    const realIdx = source.indexOf(project);
    const mainImg = (project.images && project.images[0]) ? project.images[0] : { src: '', alt: 'CAD Schematic' };
    const allImages = project.images || [];
    const tags = Array.isArray(project.tags) ? project.tags : [];
    const executionHighlights = Array.isArray(project.executionHighlights) ? project.executionHighlights : [];
    const specs = project.engineeringSpecs ? Object.entries(project.engineeringSpecs) : [];

    let tagsHtml = '';
    for (let t = 0; t < tags.length; t++) {
      tagsHtml += '<span class="px-2.5 py-1 bg-cold-titanium border border-cold-border text-cold-slate font-mono text-[11px]">' + tags[t] + '</span>';
    }

    let highlightsHtml = '';
    for (let h = 0; h < executionHighlights.length; h++) {
      highlightsHtml += '<li class="flex items-start gap-2.5 p-3 bg-cold-gunmetal border border-cold-border/60">' +
        '<span class="text-cold-safety font-mono font-bold mt-0.5">›</span>' +
        '<span class="text-xs sm:text-sm text-cold-slate font-sans leading-relaxed">' + executionHighlights[h] + '</span>' +
        '</li>';
    }

    let specsHtml = '';
    for (let s = 0; s < specs.length; s++) {
      specsHtml += '<div class="flex justify-between items-center py-2 border-b border-cold-border/40 font-mono text-xs">' +
        '<span class="text-cold-subtle text-[11px] uppercase">' + specs[s][0] + ':</span>' +
        '<span class="text-cold-pure font-semibold text-right text-[11px]">' + specs[s][1] + '</span>' +
        '</div>';
    }

    let thumbnailRibbonHtml = '';
    for (let imgIdx = 0; imgIdx < allImages.length; imgIdx++) {
      const isSelected = imgIdx === 0;
      const borderClass = isSelected
        ? 'border-cold-pure ring-1 ring-cold-pure scale-105'
        : 'border-cold-border opacity-50 hover:opacity-100';

      thumbnailRibbonHtml += '<button onclick="window.switchProjectCardSlide(' + realIdx + ', ' + imgIdx + ')" class="card-thumb-' + project.id + ' w-12 h-9 border shrink-0 overflow-hidden bg-black transition-all ' + borderClass + '" title="' + (allImages[imgIdx].alt || 'Slide') + '">' +
        '<img src="' + allImages[imgIdx].src + '" alt="' + (allImages[imgIdx].alt || 'Thumbnail') + '" class="w-full h-full object-contain" onerror="window.handleImgError(this)">' +
        '</button>';
    }

    html += '<article class="pop-in bg-cold-gunmetal/70 border border-cold-border p-6 sm:p-10 shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-md relative" id="unit-' + project.id + '">' +
      
      // Card Header
      '<div class="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 mb-8 border-b border-cold-border">' +
        '<div>' +
          '<div class="flex items-center gap-3 font-mono text-xs text-cold-subtle mb-2">' +
            '<span class="px-2 py-0.5 bg-cold-titanium border border-cold-border text-cold-safety font-bold text-xs tracking-wider">UNIT 0' + (pIdx + 1) + '</span>' +
            '<span>//</span>' +
            '<span class="uppercase tracking-wider">' + (project.team || 'TAMU ENGINEERING') + '</span>' +
            '<span>//</span>' +
            '<span class="text-cold-slate">' + (project.timeline || '2026') + '</span>' +
          '</div>' +
          '<h3 class="text-3xl sm:text-5xl font-display font-extrabold text-cold-pure uppercase tracking-tight">' +
            (project.title || 'Subsystem Build') +
          '</h3>' +
        '</div>' +

        '<div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">' +
          '<span class="px-3 py-1 bg-cold-titanium border border-cold-border text-cold-ice font-mono text-xs font-bold">' +
            (project.statusBadge || 'FIELD VALIDATED') +
          '</span>' +
          '<div class="flex flex-wrap gap-1.5">' + tagsHtml + '</div>' +
        '</div>' +
      '</div>' +

      // Card Body Grid: Left = Massive Interactive Viewport, Right = Technical Dossier
      '<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">' +
        
        // Massive Viewport Stage (7 Cols)
        '<div class="lg:col-span-7 space-y-3">' +
          '<div class="image-zoom-box w-full aspect-[16/10] bg-black border border-cold-border cursor-pointer group relative overflow-hidden" onclick="window.openInspectorModal(' + realIdx + ', 0)">' +
            '<img id="card-img-' + project.id + '" src="' + mainImg.src + '" alt="' + (mainImg.alt || 'CAD Hero Model') + '" class="w-full h-full object-contain p-4 sm:p-6" onerror="window.handleImgError(this)">' +
            
            '<div class="absolute top-3 left-3 px-2.5 py-1 bg-black/90 border border-cold-border text-cold-ice font-mono text-[10px] font-bold flex items-center gap-1.5">' +
              '<span class="w-2 h-2 rounded-full bg-cold-ice animate-pulse"></span>' +
              '<span id="card-counter-' + project.id + '">SLIDE 1 OF ' + allImages.length + '</span>' +
            '</div>' +

            '<div class="absolute top-3 right-3 px-2.5 py-1 bg-black/90 border border-cold-border text-cold-pure font-mono text-[10px] font-bold flex items-center gap-1.5">' +
              '<i data-lucide="maximize-2" class="w-3.5 h-3.5 text-cold-safety"></i>' +
              '<span>FULLSCREEN</span>' +
            '</div>' +

            '<div class="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-between font-mono text-xs text-cold-pure">' +
              '<span id="card-caption-' + project.id + '" class="truncate pr-4 text-[11px] text-cold-slate">' + (mainImg.alt || 'CAD Model View') + '</span>' +
              '<span class="text-cold-subtle text-[10px] shrink-0 font-bold">CLICK TO INSPECT</span>' +
            '</div>' +
          '</div>' +

          // Interactive Thumbnail Ribbon on the Card
          '<div class="flex items-center gap-2 overflow-x-auto p-2 bg-black border border-cold-border">' +
            '<span class="font-mono text-[9px] text-cold-subtle uppercase tracking-wider shrink-0 mr-1">SLIDES:</span>' +
            thumbnailRibbonHtml +
          '</div>' +
        '</div>' +

        // Engineering Dossier & Spec Parameters (5 Cols)
        '<div class="lg:col-span-5 space-y-6">' +
          
          '<div>' +
            '<span class="font-mono text-[10px] text-cold-safety font-bold uppercase tracking-wider block mb-1.5">SUBSYSTEM OBJECTIVE</span>' +
            '<p class="text-sm sm:text-base text-cold-slate font-sans leading-relaxed">' + (project.summary || '') + '</p>' +
          '</div>' +

          '<div class="space-y-2">' +
            '<span class="font-mono text-[10px] text-cold-safety font-bold uppercase tracking-wider block">KEY EXECUTION &amp; ANALYSIS</span>' +
            '<ul class="space-y-2">' + highlightsHtml + '</ul>' +
          '</div>' +

          '<div class="p-4 bg-black border border-cold-border space-y-1">' +
            '<div class="flex items-center justify-between border-b border-cold-border pb-2 mb-1 font-mono text-xs">' +
              '<span class="text-cold-pure font-bold flex items-center gap-1.5">' +
                '<i data-lucide="cpu" class="w-3.5 h-3.5 text-cold-safety"></i>' +
                '<span>ENGINEERING BENCHMARKS</span>' +
              '</span>' +
              '<span class="text-[9px] text-emerald-400 font-bold">AUTHENTICATED</span>' +
            '</div>' +
            specsHtml +
          '</div>' +

        '</div>' +

      '</div>' +

    '</article>';
  }

  container.innerHTML = html;
  initLucide();
  initScrollAnimations();
}

// 6. SCROLL POP-IN & NUMBER COUNTERS
function initScrollAnimations() {
  const elements = document.querySelectorAll('.pop-in');

  const observer = new IntersectionObserver(function(entries, obs) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');

        const counters = entry.target.querySelectorAll('.counter');
        counters.forEach(function(counter) { animateCounter(counter); });

        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(function(el) { observer.observe(el); });
}

function animateCounter(el) {
  const target = parseFloat(el.getAttribute('data-target'));
  if (isNaN(target)) return;
  const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
  const duration = 1400;
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
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

// 7. G-G FRICTION CIRCLE ENGINE (CHASSIS TELEMETRY REPLAY)
function getTelemetrySample(t) {
  let longG = 0;
  if (t < 2.5) {
    longG = 0.85 * (1 - t / 3.0); // Acceleration
  } else if (t > 10.5) {
    longG = -1.15; // Hard braking
  } else {
    longG = -0.15 * Math.sin(t * 2.5);
  }

  let latG = 0;
  if (t >= 3.0 && t <= 10.5) {
    latG = 1.35 * Math.sin((t - 3.0) * 1.45); // Slalom lateral loading
  }

  const totalG = Math.sqrt(latG * latG + longG * longG).toFixed(2);
  return { t: t, latG: latG, longG: longG, totalG: totalG };
}

function initTelemetryEngine() {
  const scrubber = document.getElementById('telemetry-scrubber');
  if (scrubber) {
    scrubber.addEventListener('input', function(e) {
      telemetryTime = parseFloat(e.target.value);
      if (isTelemetryPlaying) window.toggleTelemetryPlayback();
      updateTelemetryUI();
    });
  }
  startTelemetry();
}

window.setTelemetrySpeed = function(multiplier) {
  telemetrySpeedMultiplier = multiplier;
  document.querySelectorAll('.telemetry-speed-btn').forEach(function(btn) {
    if (parseFloat(btn.getAttribute('data-speed')) === multiplier) {
      btn.className = 'telemetry-speed-btn px-2 py-1.5 border border-cold-border bg-cold-titanium text-cold-pure font-bold';
    } else {
      btn.className = 'telemetry-speed-btn px-2 py-1.5 border border-cold-border text-cold-slate hover:text-cold-pure';
    }
  });
};

window.toggleTelemetryPlayback = function() {
  if (isTelemetryPlaying) pauseTelemetry();
  else startTelemetry();
};

function updatePlayButtonDisplay(playing) {
  const btn = document.getElementById('telemetry-play-btn');
  if (!btn) return;
  btn.innerHTML = playing
    ? '<i data-lucide="pause" class="w-3.5 h-3.5"></i><span>PAUSE</span>'
    : '<i data-lucide="play" class="w-3.5 h-3.5"></i><span>PLAY RUN</span>';
  initLucide();
}

function startTelemetry() {
  isTelemetryPlaying = true;
  updatePlayButtonDisplay(true);

  let lastTimestamp = performance.now();

  function loop(now) {
    if (!isTelemetryPlaying) return;
    const delta = Math.min((now - lastTimestamp) / 1000, 0.1) * telemetrySpeedMultiplier;
    lastTimestamp = now;

    telemetryTime += delta;
    if (telemetryTime >= TELEMETRY_DURATION) telemetryTime = 0;

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
  updatePlayButtonDisplay(false);
}

function updateTelemetryUI() {
  const sample = getTelemetrySample(telemetryTime);

  const timeEl = document.getElementById('telemetry-time-readout');
  const gTotalEl = document.getElementById('friction-g-total');
  const latGEl = document.getElementById('friction-lat-g');
  const longGEl = document.getElementById('friction-long-g');

  if (timeEl) timeEl.textContent = telemetryTime.toFixed(2) + 's';
  if (gTotalEl) gTotalEl.textContent = sample.totalG + ' G';
  if (latGEl) latGEl.textContent = (sample.latG >= 0 ? '+' : '') + sample.latG.toFixed(2) + ' G';
  if (longGEl) longGEl.textContent = (sample.longG >= 0 ? '+' : '') + sample.longG.toFixed(2) + ' G';

  renderFrictionCircleCanvas(sample);
}

function renderFrictionCircleCanvas(currentSample) {
  const canvas = document.getElementById('friction-circle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const radius = cx - 28;

  ctx.clearRect(0, 0, w, h);

  // Concentric G-Limit Boundary Rings (0.5G, 1.0G, 1.6G)
  ctx.strokeStyle = '#1a2334';
  ctx.lineWidth = 1.5;
  [0.33, 0.66, 1.0].forEach(function(r) {
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

  // Historic acceleration scatter trail
  const trailCount = 20;
  for (let i = trailCount; i >= 1; i--) {
    const pastT = Math.max(0, telemetryTime - (i * 0.05));
    const s = getTelemetrySample(pastT);
    const alpha = (1 - (i / trailCount)) * 0.6;
    const px = cx + (s.latG / 1.6) * radius;
    const py = cy - (s.longG / 1.6) * radius;

    ctx.fillStyle = 'rgba(255, 77, 0, ' + alpha + ')';
    ctx.beginPath();
    ctx.arc(px, py, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Active G acceleration vector line
  const curX = cx + (currentSample.latG / 1.6) * radius;
  const curY = cy - (currentSample.longG / 1.6) * radius;

  ctx.strokeStyle = 'rgba(255, 77, 0, 0.8)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(curX, curY);
  ctx.stroke();

  // Point Puck
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(curX, curY, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ff4d00';
  ctx.lineWidth = 2.5;
  ctx.stroke();
}

// 8. FULLSCREEN BLUEPRINT LIGHTBOX MODAL
window.openInspectorModal = function(pIdx, iIdx) {
  if (typeof iIdx === 'undefined') iIdx = 0;
  const source = window.projectsData;
  if (!Array.isArray(source) || !source[pIdx]) return;

  modalActiveProjectIndex = pIdx;
  modalActiveImageIndex = iIdx;

  const modal = document.getElementById('inspector-modal');
  if (!modal) return;

  updateModalView();
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  initLucide();
};

window.closeInspectorModal = function() {
  const modal = document.getElementById('inspector-modal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
};

function updateModalView() {
  const source = window.projectsData;
  if (!Array.isArray(source)) return;
  const p = source[modalActiveProjectIndex];
  if (!p || !p.images || !p.images.length) return;

  if (modalActiveImageIndex >= p.images.length) modalActiveImageIndex = 0;
  if (modalActiveImageIndex < 0) modalActiveImageIndex = p.images.length - 1;

  const currentImg = p.images[modalActiveImageIndex];
  const activeImgEl = document.getElementById('modal-active-img');
  const titleEl = document.getElementById('modal-project-title');
  const counterEl = document.getElementById('modal-image-counter');
  const captionEl = document.getElementById('modal-caption');
  const thumbStrip = document.getElementById('modal-thumb-strip');

  if (titleEl) titleEl.textContent = p.title + ' // CAD BLUEPRINT';
  if (counterEl) counterEl.textContent = 'SLIDE ' + (modalActiveImageIndex + 1) + ' OF ' + p.images.length;
  if (captionEl) captionEl.textContent = currentImg.alt || "CAD Specification Blueprint";

  if (activeImgEl) {
    activeImgEl.src = currentImg.src;
    activeImgEl.alt = currentImg.alt;
  }

  if (thumbStrip) {
    let thumbsHtml = '';
    for (let i = 0; i < p.images.length; i++) {
      const img = p.images[i];
      const isSelected = (i === modalActiveImageIndex);
      const borderCls = isSelected 
        ? 'border-cold-pure ring-1 ring-cold-pure scale-105' 
        : 'border-cold-border opacity-50 hover:opacity-100';
      
      thumbsHtml += '<button onclick="window.navigateModalImageTo(' + i + ')" class="w-16 h-12 border shrink-0 overflow-hidden bg-black transition-all ' + borderCls + '">' +
        '<img src="' + img.src + '" alt="' + (img.alt || 'Thumbnail') + '" class="w-full h-full object-contain" onerror="window.handleImgError(this)">' +
        '</button>';
    }
    thumbStrip.innerHTML = thumbsHtml;
  }
}

window.navigateModalImage = function(direction) {
  const source = window.projectsData;
  if (!Array.isArray(source)) return;
  const p = source[modalActiveProjectIndex];
  if (!p || !p.images || !p.images.length) return;
  const len = p.images.length;
  modalActiveImageIndex = (modalActiveImageIndex + direction + len) % len;
  updateModalView();
};

window.navigateModalImageTo = function(idx) {
  modalActiveImageIndex = idx;
  updateModalView();
};

function setupKeyboardShortcuts() {
  window.addEventListener('keydown', function(e) {
    const modal = document.getElementById('inspector-modal');
    if (!modal || !modal.classList.contains('active')) return;
    if (e.key === 'Escape') window.closeInspectorModal();
    if (e.key === 'ArrowLeft') window.navigateModalImage(-1);
    if (e.key === 'ArrowRight') window.navigateModalImage(1);
  });
}

// 9. CLIPBOARD DISPATCH TOOL
window.copyEmailToClipboard = function() {
  const email = "aibel@tamu.edu";
  const btn = document.getElementById('copy-email-btn');

  navigator.clipboard.writeText(email).then(function() {
    if (btn) {
      btn.innerHTML = '<i data-lucide="check" class="w-4 h-4 text-emerald-400"></i><span>COPIED TO CLIPBOARD!</span>';
      initLucide();
    }
    showHudToast('COPIED [' + email + '] TO CLIPBOARD');

    setTimeout(function() {
      if (btn) {
        btn.innerHTML = '<i data-lucide="copy" class="w-4 h-4"></i><span>COPY: ' + email + '</span>';
        initLucide();
      }
    }, 3000);
  }).catch(() => {
    window.location.href = 'mailto:' + email;
  });
};

function showHudToast(msg) {
  const toast = document.getElementById('hud-toast');
  const msgEl = document.getElementById('hud-toast-msg');
  if (!toast || !msgEl) return;

  msgEl.textContent = msg;
  toast.classList.remove('translate-y-24', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(function() {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-24', 'opacity-0');
  }, 3200);
}