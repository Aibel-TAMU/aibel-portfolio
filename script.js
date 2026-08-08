let activeIndex = 0;
let isDragging = false;
let startX = 0;
let autoCycleTimer = null;
const AUTO_CYCLE_INTERVAL = 3500; // 3.5 Seconds per slide

function renderProjects() {
  const container = document.getElementById('projects-container');
  if (!container || typeof projectsData === 'undefined') return;

  // 1. FILTER FOR SHOWCASE PROJECTS ONLY (Top 3D Carousel Ring)
  const showcaseProjects = projectsData.filter(p => p.showcase !== false);

  // 2. Render Showcase Projects into 3D Ring
  container.innerHTML = showcaseProjects.map((project, pIndex) => `
    <article 
      data-index="${pIndex}"
      class="project-card absolute w-[88%] sm:w-[410px] bg-eng-dark rounded-2xl border border-eng-border shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col cursor-pointer select-none"
      onclick="handleCardClick(${pIndex})"
    >
      
      <!-- Image Carousel Component (Clicking photo cycles pictures) -->
      <div 
        class="carousel relative w-full aspect-[16/9] bg-eng-panel border-b border-eng-border overflow-hidden cursor-pointer group/img" 
        id="carousel-${pIndex}"
        onclick="handleImageClick(event, ${pIndex})"
      >
        <div class="carousel-track w-full h-full relative">
          ${project.images.map((img, i) => `
            <img src="${img.src}" alt="${img.alt}" class="absolute inset-0 w-full h-full object-contain opacity-0 transition-opacity duration-500 ease-in-out ${i === 0 ? 'active opacity-100' : ''}" onerror="this.src='https://via.placeholder.com/400x225/11151a/262d35?text=Hardware+Build'"
          `).join('')}
        </div>
        
        <!-- Hover Hint Overlay -->
        <div class="absolute top-2 right-2 px-2 py-1 rounded bg-eng-dark/80 backdrop-blur-sm text-[10px] font-mono text-white/80 opacity-0 group-hover/img:opacity-100 transition-opacity pointer-events-none">
          Click photo to flip ➔
        </div>

        ${project.images.length > 1 ? `
          <div class="carousel-dots absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20"></div>
        ` : ''}
      </div>

      <!-- Showcase Content Area -->
      <div class="p-5 flex-grow flex flex-col justify-between">
        <div>
          <h3 class="text-xl font-bold tracking-tight text-white leading-tight mb-2.5 group-hover:text-aggie-maroon-light transition-colors">${project.title}</h3>
          
          <div class="flex flex-wrap gap-1.5 mb-3.5 font-mono">
            ${project.tags.map(tag => `<span class="px-2.5 py-1 bg-eng-panel rounded-full text-[11px] text-white/90 font-semibold border border-eng-border">${tag}</span>`).join('')}
          </div>
          
          <p class="text-xs text-eng-text leading-relaxed line-clamp-3">${project.description}</p>
        </div>

        <div class="mt-4 pt-3 border-t border-eng-border flex items-center justify-between text-[11px] font-mono">
          <a href="#detail-${pIndex}" onclick="event.stopPropagation()" class="text-aggie-maroon-light hover:text-white transition-colors font-bold flex items-center gap-1">
            <span>VIEW DETAILED BREAKDOWN</span>
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" /></svg>
          </a>
        </div>
      </div>

    </article>
  `).join('');

  // 3. Render ALL projects into Lower Technical Index
  renderDetailedProjectSections();

  initImageCarousels();
  update3DPositions();
  setup3DControls();
  setupDragSwipe();
  setupAutoCycle();
  setupExpandableContact();
}

// EXPANDABLE CONTACT & RESUME CONTROLLER
function setupExpandableContact() {
  const footer = document.getElementById('contact');
  const triggerBar = document.getElementById('contact-trigger');
  const expandable = document.getElementById('contact-expandable');
  const btnText = document.getElementById('dossier-btn-text');
  const btnIcon = document.getElementById('dossier-btn-icon');
  const topContactBtns = document.querySelectorAll('a[href="#contact"]');

  if (!footer || !expandable) return;

  let isExpanded = false;
  let hasAutoExpanded = false;

  function expandFooter() {
    expandable.style.maxHeight = '950px';
    expandable.style.opacity = '1';
    if (btnText) btnText.textContent = 'COLLAPSE HUB';
    if (btnIcon) btnIcon.textContent = '[-]';
    isExpanded = true;
  }

  function collapseFooter() {
    expandable.style.maxHeight = '0px';
    expandable.style.opacity = '0';
    if (btnText) btnText.textContent = 'CLICK HERE';
    if (btnIcon) btnIcon.textContent = '[+]';
    isExpanded = false;
  }

  function toggleFooter(e) {
    if (e) e.stopPropagation();
    if (isExpanded) {
      collapseFooter();
    } else {
      expandFooter();
    }
  }

  // 1. Direct Click Toggle on Bar / Button
  if (triggerBar) {
    triggerBar.onclick = (e) => toggleFooter(e);
  }

  // 2. Smooth Auto-Expand On First Scroll To Bottom
  window.addEventListener('scroll', () => {
    if (hasAutoExpanded) return;

    const scrollPosition = window.innerHeight + window.scrollY;
    const bodyHeight = document.body.offsetHeight;

    if (bodyHeight - scrollPosition <= 80) {
      expandFooter();
      hasAutoExpanded = true; 
    }
  });

  // 3. Navbar "INITIATE CONTACT" Link Support
  topContactBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      expandFooter();
      footer.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// AUTO-CYCLE ENGINE
function setupAutoCycle() {
  const section = document.getElementById('projects');
  if (!section) return;

  function startTimer() {
    if (autoCycleTimer) clearInterval(autoCycleTimer);
    autoCycleTimer = setInterval(() => {
      const showcaseProjects = projectsData.filter(p => p.showcase !== false);
      activeIndex = (activeIndex >= showcaseProjects.length - 1) ? 0 : activeIndex + 1;
      update3DPositions();
    }, AUTO_CYCLE_INTERVAL);
  }

  function stopTimer() {
    if (autoCycleTimer) clearInterval(autoCycleTimer);
  }

  startTimer();

  section.addEventListener('mouseenter', stopTimer);
  section.addEventListener('mouseleave', startTimer);
}

// Renders lower detailed project list with directional toggle buttons for image carousels
function renderDetailedProjectSections() {
  const container = document.getElementById('detailed-projects-container');
  if (!container || typeof projectsData === 'undefined') return;

  container.innerHTML = projectsData.map((project, pIndex) => `
    <article id="detail-${pIndex}" class="bg-eng-panel rounded-2xl border border-eng-border p-6 md:p-8 relative overflow-hidden group hover:border-aggie-maroon-light/40 transition-colors">
      
      <!-- Header Row -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-eng-border">
        <div>
          <span class="font-mono text-xs text-aggie-maroon-light font-bold uppercase tracking-wider">
            ${project.showcase !== false ? 'FEATURED BUILD 0' + (pIndex + 1) : 'PROJECT LOG 0' + (pIndex + 1)}
          </span>
          <h3 class="text-2xl font-bold text-white mt-0.5">${project.title}</h3>
        </div>
        <div class="flex flex-wrap gap-2 font-mono">
          ${project.tags.map(tag => `<span class="px-3 py-1 bg-eng-dark rounded-md text-xs font-semibold text-eng-text border border-eng-border">${tag}</span>`).join('')}
        </div>
      </div>

      <!-- Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left Columns: Technical Overview & Execution -->
        <div class="lg:col-span-2 space-y-4">
          <div>
            <h4 class="font-mono text-xs text-white uppercase font-bold tracking-wider mb-2">Technical Overview</h4>
            <p class="text-sm text-eng-text leading-relaxed">${project.description}</p>
          </div>

          ${project.stackBreakdown ? `
            <div class="pt-2">
              <h4 class="font-mono text-xs text-white uppercase font-bold tracking-wider mb-2">Engineering Execution</h4>
              <ul class="space-y-2 font-sans text-xs text-eng-text">
                ${project.stackBreakdown.map(item => `
                  <li class="flex items-start gap-2 bg-eng-dark/60 p-2.5 rounded border border-eng-border/50">
                    <span class="text-aggie-maroon-light font-bold font-mono">[✓]</span>
                    <span>${item}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          ` : ''}
        </div>

        <!-- Right Column: Interactive Deck with Toggle Buttons -->
        <div 
          class="detail-carousel bg-eng-dark rounded-xl border border-eng-border p-3 flex flex-col items-center justify-between h-64 relative group/detailimg select-none"
          id="detail-carousel-${pIndex}"
        >
          <!-- Image Container -->
          <div 
            class="carousel-track w-full flex-grow relative overflow-hidden rounded bg-eng-panel cursor-pointer"
            onclick="handleDetailImageNav(event, ${pIndex}, 1)"
          >
            ${project.images.map((img, i) => `
              <img 
                src="${img.src}" 
                alt="${img.alt}" 
                data-alt="${img.alt}"
                class="absolute inset-0 w-full h-full object-contain opacity-0 transition-opacity duration-500 ease-in-out ${i === 0 ? 'active opacity-100' : ''}" 
                onerror="this.src='https://via.placeholder.com/400x225/11151a/262d35?text=Hardware+Build'"
              >
            `).join('')}
          </div>

          <!-- SIDE TOGGLE BUTTONS (Rendered if > 1 image) -->
          ${project.images.length > 1 ? `
            <!-- Left Toggle Button -->
            <button 
              onclick="handleDetailImageNav(event, ${pIndex}, -1)" 
              class="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-eng-dark/80 border border-eng-border text-white hover:bg-aggie-maroon hover:border-aggie-maroon-light transition-all flex items-center justify-center text-xs font-bold shadow-lg opacity-80 hover:opacity-100 hover:scale-110 active:scale-95"
              aria-label="Previous Image"
            >
              ❮
            </button>

            <!-- Right Toggle Button -->
            <button 
              onclick="handleDetailImageNav(event, ${pIndex}, 1)" 
              class="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-eng-dark/80 border border-eng-border text-white hover:bg-aggie-maroon hover:border-aggie-maroon-light transition-all flex items-center justify-center text-xs font-bold shadow-lg opacity-80 hover:opacity-100 hover:scale-110 active:scale-95"
              aria-label="Next Image"
            >
              ❯
            </button>
          ` : ''}

          <!-- Single Bottom Label Display -->
          <span class="detail-img-label font-mono text-[10px] text-eng-text/70 text-center mt-2.5 line-clamp-1">
            ${project.images[0].alt}
          </span>
        </div>

      </div>

    </article>
  `).join('');
}

// Photo Click Handler (Flipping through pictures)
function handleImageClick(event, projectIndex) {
  event.stopPropagation(); // Stops main card rotation
  const carousel = document.getElementById(`carousel-${projectIndex}`);
  if (!carousel) return;

  const images = carousel.querySelectorAll('.carousel-track img');
  if (images.length <= 1) return;

  let activeImgIndex = Array.from(images).findIndex(img => img.classList.contains('active'));
  let nextImgIndex = (activeImgIndex + 1) % images.length;

  images.forEach((img, index) => {
    img.classList.toggle('active', index === nextImgIndex);
    img.classList.toggle('opacity-100', index === nextImgIndex);
  });

  const dots = carousel.querySelectorAll('.dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('bg-aggie-maroon-light', index === nextImgIndex);
    dot.classList.toggle('scale-125', index === nextImgIndex);
    dot.classList.toggle('bg-white/30', index !== nextImgIndex);
  });
}

// 3D Curve Positioning Engine
function update3DPositions() {
  const cards = document.querySelectorAll('.project-card');
  const total = cards.length;
  const indicator = document.getElementById('project-count-indicator');

  if (indicator) {
    indicator.textContent = `FOCUSING BUILD ${activeIndex + 1} OF ${total}`;
  }

  cards.forEach((card, i) => {
    let offset = (i - activeIndex + total) % total;
    if (offset > total / 2) offset -= total;

    card.style.transition = 'all 0.65s cubic-bezier(0.34, 1.45, 0.64, 1)';
    
    if (offset === 0) {
      // CENTER ACTIVE CARD
      card.style.transform = 'translate3d(0, 0, 180px) rotateY(0deg) scale(1.08)';
      card.style.opacity = '1';
      card.style.zIndex = '30';
      card.style.filter = 'none';
      card.style.borderColor = 'rgba(112, 0, 0, 0.9)';
      card.style.boxShadow = '0 30px 60px -15px rgba(80, 0, 0, 0.45), 0 0 20px rgba(80, 0, 0, 0.2)';
    } else if (offset === 1) {
      // RIGHT CARD
      card.style.transform = 'translate3d(70%, 15px, -180px) rotateY(-28deg) scale(0.82)';
      card.style.opacity = '0.5';
      card.style.zIndex = '20';
      card.style.filter = 'brightness(0.6) contrast(1.1)';
      card.style.borderColor = '#262d35';
      card.style.boxShadow = 'none';
    } else if (offset === -1) {
      // LEFT CARD
      card.style.transform = 'translate3d(-70%, 15px, -180px) rotateY(28deg) scale(0.82)';
      card.style.opacity = '0.5';
      card.style.zIndex = '20';
      card.style.filter = 'brightness(0.6) contrast(1.1)';
      card.style.borderColor = '#262d35';
      card.style.boxShadow = 'none';
    } else {
      // REAR HIDDEN CARDS
      const direction = offset > 0 ? 140 : -140;
      card.style.transform = `translate3d(${direction}%, 40px, -380px) rotateY(${offset > 0 ? -45 : 45}deg) scale(0.6)`;
      card.style.opacity = '0';
      card.style.zIndex = '10';
      card.style.filter = 'brightness(0.2)';
    }
  });

  setupHoverEffect();
}

// Hover Response
function setupHoverEffect() {
  const cards = document.querySelectorAll('.project-card');
  const total = cards.length;

  cards.forEach((card, i) => {
    let offset = (i - activeIndex + total) % total;
    if (offset > total / 2) offset -= total;

    card.onmouseenter = () => {
      card.style.transition = 'all 0.35s cubic-bezier(0.25, 1, 0.5, 1)';
      if (offset === 0) {
        card.style.transform = 'translate3d(0, -12px, 240px) rotateY(0deg) scale(1.12)';
      } else if (offset === 1) {
        card.style.transform = 'translate3d(68%, 5px, -80px) rotateY(-18deg) scale(0.88)';
        card.style.opacity = '0.85';
        card.style.filter = 'brightness(0.9)';
      } else if (offset === -1) {
        card.style.transform = 'translate3d(-68%, 5px, -80px) rotateY(18deg) scale(0.88)';
        card.style.opacity = '0.85';
        card.style.filter = 'brightness(0.9)';
      }
    };

    card.onmouseleave = () => {
      update3DPositions();
    };
  });
}

function handleCardClick(index) {
  if (activeIndex !== index) {
    activeIndex = index;
    update3DPositions();
  }
}

// Mouse Drag & Touch Swiping
function setupDragSwipe() {
  const container = document.getElementById('projects-container');
  if (!container) return;

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
  });

  window.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const diffX = e.clientX - startX;
    
    if (Math.abs(diffX) > 40) {
      const showcaseProjects = projectsData.filter(p => p.showcase !== false);
      if (diffX < 0) {
        activeIndex = (activeIndex >= showcaseProjects.length - 1) ? 0 : activeIndex + 1;
      } else {
        activeIndex = (activeIndex <= 0) ? showcaseProjects.length - 1 : activeIndex - 1;
      }
      update3DPositions();
    }
  });

  container.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });

  container.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const diffX = endX - startX;
    if (Math.abs(diffX) > 40) {
      const showcaseProjects = projectsData.filter(p => p.showcase !== false);
      if (diffX < 0) {
        activeIndex = (activeIndex >= showcaseProjects.length - 1) ? 0 : activeIndex + 1;
      } else {
        activeIndex = (activeIndex <= 0) ? showcaseProjects.length - 1 : activeIndex - 1;
      }
      update3DPositions();
    }
  });
}

function setup3DControls() {
  const prevBtn = document.getElementById('prev-project-btn');
  const nextBtn = document.getElementById('next-project-btn');

  if (prevBtn) {
    prevBtn.onclick = () => {
      const showcaseProjects = projectsData.filter(p => p.showcase !== false);
      activeIndex = (activeIndex <= 0) ? showcaseProjects.length - 1 : activeIndex - 1;
      update3DPositions();
    };
  }

  if (nextBtn) {
    nextBtn.onclick = () => {
      const showcaseProjects = projectsData.filter(p => p.showcase !== false);
      activeIndex = (activeIndex >= showcaseProjects.length - 1) ? 0 : activeIndex + 1;
      update3DPositions();
    };
  }
}

// Dot Indicators Initializer
function initImageCarousels() {
  document.querySelectorAll('.carousel').forEach((carousel) => {
    const images = carousel.querySelectorAll('.carousel-track img');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    if (images.length <= 1 || !dotsContainer) return;
    
    dotsContainer.innerHTML = '';

    images.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.className = `dot w-2 h-2 rounded-full cursor-pointer transition-all ${index === 0 ? 'bg-aggie-maroon-light scale-125' : 'bg-white/30'}`;
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        images.forEach((img, i) => {
          img.classList.toggle('active', i === index);
          img.classList.toggle('opacity-100', i === index);
        });
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((d, i) => {
          d.classList.toggle('bg-aggie-maroon-light', i === index);
          d.classList.toggle('scale-125', i === index);
          d.classList.toggle('bg-white/30', i !== index);
        });
      });
      dotsContainer.appendChild(dot);
    });
  });
}

// Detail Section Photo Directional Navigation Handler
function handleDetailImageNav(event, projectIndex, direction = 1) {
  if (event) event.stopPropagation();
  
  const carousel = document.getElementById(`detail-carousel-${projectIndex}`);
  if (!carousel) return;

  const images = carousel.querySelectorAll('.carousel-track img');
  const label = carousel.querySelector('.detail-img-label');
  if (images.length <= 1) return;

  let activeImgIndex = Array.from(images).findIndex(img => img.classList.contains('active'));
  let totalImages = images.length;

  // Calculate next index based on direction (-1 or +1)
  let nextImgIndex = (activeImgIndex + direction + totalImages) % totalImages;

  images.forEach((img, index) => {
    img.classList.toggle('active', index === nextImgIndex);
    img.classList.toggle('opacity-100', index === nextImgIndex);
  });

  // Dynamically update the bottom label text
  if (label && images[nextImgIndex]) {
    label.textContent = images[nextImgIndex].getAttribute('data-alt') || images[nextImgIndex].alt;
  }
}

document.addEventListener('DOMContentLoaded', renderProjects);