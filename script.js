/* ============================
   AOS (Animate on Scroll) – safe init
   ============================ */
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, disable: window.innerWidth < 768 });
    document.body.classList.add('aos-ready');
  } else {
    document.body.classList.add('aos-ready');
  }
}
initAOS();

/* ============================
   THEME TOGGLE (iOS switch + auto day/night)
   ============================ */
const bodyEl = document.body;
const themeToggle = document.getElementById('themeToggleCheckbox');
let manualMode = false;
let userOverride = localStorage.getItem('themeOverride');   // remember manually chosen theme

function updateThemeUI(light) {
  if (light) {
    bodyEl.classList.add('light');
    themeToggle.checked = true;
  } else {
    bodyEl.classList.remove('light');
    themeToggle.checked = false;
  }
}

function isDay() {
  const h = new Date().getHours();
  return h >= 6 && h < 18;
}

function applyTheme() {
  const light = manualMode ? userOverride === 'light' : isDay();
  updateThemeUI(light);
}

themeToggle.addEventListener('change', () => {
  manualMode = true;
  userOverride = themeToggle.checked ? 'light' : 'dark';
  localStorage.setItem('themeOverride', userOverride);
  applyTheme();
});
applyTheme();
// Re‑check every minute in automatic mode
setInterval(() => { if (!manualMode) applyTheme(); }, 60000);

/* ============================
   AGE CALCULATION (birthday 2000‑06‑29)
   ============================ */
const ageEl = document.getElementById('ageDisplay');
const birth = new Date('2000-06-29');
const today = new Date();
let age = today.getFullYear() - birth.getFullYear();
if (today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) {
  age--;
}
ageEl.textContent = age;
document.getElementById('currentYear').textContent = today.getFullYear();

/* ============================
   VISITOR FLAG & CLOCK (IP‑based timezone)
   ============================ */
let visitorTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone; // fallback
let clockInterval = null;

async function fetchGeoData() {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (res.ok) {
      const data = await res.json();
      if (data.timezone) visitorTimezone = data.timezone;
      if (data.country_code) {
        const code = data.country_code.toLowerCase();
        // Convert country code to flag emoji
        const flag = code.replace(/./g, c => String.fromCodePoint(c.charCodeAt(0) + 127397));
        document.getElementById('visitorFlag').textContent = flag;
        startClock();
        return;
      }
    }
  } catch (e) {}
  try {
    const res = await fetch('https://ip-api.com/json/?fields=status,countryCode,timezone');
    if (res.ok) {
      const data = await res.json();
      if (data.status === 'success') {
        if (data.timezone) visitorTimezone = data.timezone;
        if (data.countryCode) {
          const code = data.countryCode.toLowerCase();
          const flag = code.replace(/./g, c => String.fromCodePoint(c.charCodeAt(0) + 127397));
          document.getElementById('visitorFlag').textContent = flag;
          startClock();
          return;
        }
      }
    }
  } catch (e) {}
  document.getElementById('visitorFlag').textContent = '🌐';
  startClock();
}

function startClock() {
  if (clockInterval) clearInterval(clockInterval);
  updateClock();
  clockInterval = setInterval(updateClock, 1000);
}

function updateClock() {
  const now = new Date();
  const options = { hour: '2-digit', minute: '2-digit', timeZone: visitorTimezone };
  document.getElementById('liveClock').textContent = now.toLocaleTimeString('en-US', options);
}
fetchGeoData();

/* ============================
   MOBILE TAB BAR ACTIVE STATE
   ============================ */
const sections = ['hero', 'experience', 'projects', 'skills', 'education', 'contact'];
const tabItems = document.querySelectorAll('.tab-item');
window.addEventListener('scroll', () => {
  let current = sections[0];
  for (const section of sections) {
    const el = document.getElementById(section);
    if (el && window.scrollY >= el.offsetTop - 200) current = section;
  }
  tabItems.forEach(tab => {
    tab.classList.remove('active');
    if (tab.getAttribute('href') === '#' + current) tab.classList.add('active');
  });
});

/* ============================
   EXPERIENCE DATA
   ============================ */
const expData = [
  {
    period: 'Dec 2024 – Present',
    title: 'IT Manager',
    company: 'FIBC Lanka (Pvt) Ltd, Polonnaruwa',
    desc: 'Managing IT operations, networks, servers, cloud, security, ERP (Tally Prime), HRM (SignHR), CCTV, and hardware/software support. Also creating bag artwork and social media content.'
  },
  {
    period: 'Jul 2021 – Oct 2023',
    title: 'Computer Aided Design Designer',
    company: 'Brandix, Polonnaruwa',
    desc: 'Designed apparel patterns using Lectra Modaris and AutoCAD, ensuring precision and efficiency in mass production.'
  }
];
document.getElementById('experienceTimeline').innerHTML = expData.map((e, i) => `
  <div class="timeline-item" data-aos="fade-up" data-aos-delay="${i * 100}">
    <div class="timeline-dot"></div>
    <div class="timeline-content">
      <div class="timeline-date">${e.period}</div>
      <div class="timeline-title">${e.title}</div>
      <div class="timeline-company">${e.company}</div>
      <p>${e.desc}</p>
    </div>
  </div>
`).join('');

/* ============================
   SKILLS DATA
   ============================ */
const skills = [
  {
    cat: 'IT & ERP',
    items: [
      { n: 'Tally ERP / SignHR', p: 85 },
      { n: 'Network & Security', p: 90 },
      { n: 'Cloud & Server Admin', p: 80 },
      { n: 'CCTV & Hardware Support', p: 88 }
    ]
  },
  {
    cat: 'Graphic & CAD Design',
    items: [
      { n: 'Adobe Photoshop', p: 92 },
      { n: 'Modaris', p: 85 },
      { n: 'AutoCAD', p: 80 },
      { n: 'CorelDRAW', p: 88 }
    ]
  }
];
document.getElementById('skillsContainer').innerHTML = skills.map(c => `
  <div class="skill-category" data-aos="fade-up">
    <h4>${c.cat}</h4>
    ${c.items.map(s => `
      <div class="skill-bar-item">
        <div class="skill-info"><span>${s.n}</span><span>${s.p}%</span></div>
        <div class="skill-progress"><div class="skill-progress-fill" style="width:${s.p}%"></div></div>
      </div>
    `).join('')}
  </div>
`).join('');

/* ============================
   EDUCATION DATA
   ============================ */
const eduData = [
  {
    period: 'Jun 2017 – Jun 2026',
    title: 'BSc (Hons) Computer Networks & Security',
    company: 'American College of Higher Education',
    desc: 'CCNA Certified. Cisco Networking Academy, IEEE Student Branch, hackathons.'
  },
  {
    period: 'Feb 2016 – Aug 2016',
    title: 'Diploma in Computer Software Engineering',
    company: 'ICT Institute Polonnaruwa',
    desc: 'C++, C#, and software development fundamentals.'
  }
];
document.getElementById('educationTimeline').innerHTML = eduData.map((e, i) => `
  <div class="timeline-item" data-aos="fade-up" data-aos-delay="${i * 100}">
    <div class="timeline-dot"></div>
    <div class="timeline-content">
      <div class="timeline-date">${e.period}</div>
      <div class="timeline-title">${e.title}</div>
      <div class="timeline-company">${e.company}</div>
      <p>${e.desc}</p>
    </div>
  </div>
`).join('');

/* ============================
   LINKEDIN HEADLINE (from local JSON)
   ============================ */
fetch('data/linkedin.json')
  .then(r => r.json())
  .then(d => {
    document.getElementById('linkedinHeadline').textContent = d.headline || 'IT Manager & Digital Creative at FIBC Lanka (Pvt) Ltd';
  })
  .catch(() => {
    document.getElementById('linkedinHeadline').textContent = 'IT Manager & Digital Creative at FIBC Lanka (Pvt) Ltd';
  });

/* ============================
   PROJECTS (local JSON + GitHub API)
   ============================ */
const langIcons = {
  JavaScript: 'devicon-javascript-plain', Python: 'devicon-python-plain',
  HTML: 'devicon-html5-plain', CSS: 'devicon-css3-plain'
};
const kwIcons = {
  network: 'fa-network-wired', dashboard: 'fa-chart-line', design: 'fa-paint-brush',
  bot: 'fa-robot', chat: 'fa-comment', web: 'fa-globe', api: 'fa-code',
  secret: 'fa-lock', container: 'fa-box'
};
const defaultIcon = 'fa-code';

/** Determine the best icon for a project based on language or keywords */
function getIcon(p) {
  if (p.icon) return p.icon;
  const lang = p.language || (p.tags && p.tags[0]);
  if (lang && langIcons[lang]) return langIcons[lang];
  const text = (p.name + ' ' + (p.description || '')).toLowerCase();
  for (let k in kwIcons) if (text.includes(k)) return kwIcons[k];
  return defaultIcon;
}

async function loadProjects() {
  const grid = document.getElementById('projectsGrid');
  let projects = [];
  // 1. Load from local projects.json
  try {
    const r = await fetch('data/projects.json');
    if (r.ok) projects = await r.json();
  } catch (e) {}
  // 2. Fetch your GitHub repos
  try {
    const gh = await fetch('https://api.github.com/users/barrylk/repos?sort=updated&per_page=6');
    if (gh.ok) {
      const repos = await gh.json();
      projects = [...projects, ...repos.map(r => ({
        name: r.name,
        description: r.description || 'GitHub Repository',
        language: r.language,
        tags: r.language ? [r.language] : [],
        links: { github: r.html_url }
      }))];
    }
  } catch (e) {}
  // 3. Fallback if nothing loaded
  if (!projects.length) projects = [{ name: 'Sample Project', description: 'Add projects in data/projects.json', icon: 'fa-code' }];
  // 4. Load Devicon CSS if needed
  if (!document.querySelector('link[href*="devicon"]')) {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.15.1/devicon.min.css';
    document.head.appendChild(l);
  }
  // 5. Assign icons
  projects.forEach(p => p.icon = getIcon(p));
  // 6. Render cards
  grid.innerHTML = projects.map((p, i) => {
    const ic = p.icon.startsWith('devicon-') ? `<i class="${p.icon}"></i>` : `<i class="fas ${p.icon}"></i>`;
    return `<div class="project-card" data-aos="fade-up" data-aos-delay="${i * 50}" onclick='openModal(${JSON.stringify(p).replace(/'/g, "&apos;")})'>
      <div class="project-icon">${ic}</div>
      <div class="project-title">${p.name}</div>
      <div class="project-desc">${p.description || ''}</div>
      ${p.tags ? `<div class="project-tags">${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}</div>` : ''}
    </div>`;
  }).join('');
}

function openModal(p) {
  document.getElementById('modalTitle').textContent = p.name;
  document.getElementById('modalDescription').textContent = p.description || '';
  let links = '';
  if (p.links?.github) links += `<a href="${p.links.github}" target="_blank" class="cta-btn primary">GitHub</a>`;
  if (p.links?.drive) links += `<a href="${p.links.drive}" target="_blank" class="cta-btn primary">Drive</a>`;
  document.getElementById('modalLinks').innerHTML = links;
  document.getElementById('projectModal').style.display = 'flex';
}
window.closeModal = () => document.getElementById('projectModal').style.display = 'none';
window.onclick = e => { if (e.target === document.getElementById('projectModal')) closeModal(); };

/* ============================
   CONTACT FORM (Formspree)
   ============================ */
document.getElementById('contactForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const form = e.target;
  const status = document.getElementById('form-status');
  try {
    const res = await fetch(form.action, { method:'POST', body: new FormData(form), headers:{'Accept':'application/json'} });
    status.textContent = res.ok ? '✅ Message sent!' : '❌ Error, try again.';
    if (res.ok) form.reset();
  } catch { status.textContent = '❌ Network error.'; }
});

/* ============================
   SNAKE GAME (unchanged, fully functional)
   ============================ */
const snakeBtn = document.getElementById('snakeBtn');
const snakeModal = document.getElementById('snakeGameModal');
const snakeClose = document.getElementById('snakeGameCloseBtn');
const snakeWindow = document.getElementById('snakeGameWindow');
const snakeHandle = document.getElementById('snakeDragHandle');
const snakeCanvas = document.getElementById('snakeCanvas');
const ctx = snakeCanvas.getContext('2d');
const scoreSpan = document.getElementById('snakeScore');

let snake, food, direction, nextDirection, score, gameInterval, gameRunning;
const gridSize = 20, tileCount = snakeCanvas.width / gridSize;

function initSnake() { snake = [{x:10,y:10}]; direction = {x:1,y:0}; nextDirection = {x:1,y:0}; score = 0; gameRunning = true; placeFood(); updateScore(); }
function placeFood() { food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) }; while (snake.some(p => p.x === food.x && p.y === food.y)) { food.x = Math.floor(Math.random() * tileCount); food.y = Math.floor(Math.random() * tileCount); } }
function updateScore() { scoreSpan.textContent = 'Score: ' + score; }
function draw() { ctx.clearRect(0,0,snakeCanvas.width,snakeCanvas.height); ctx.fillStyle = '#e74c3c'; ctx.beginPath(); ctx.arc(food.x*gridSize + gridSize/2, food.y*gridSize + gridSize/2, gridSize/2 - 2, 0, 2*Math.PI); ctx.fill(); snake.forEach((p,i) => { ctx.fillStyle = i === 0 ? '#2ecc71' : '#27ae60'; ctx.fillRect(p.x*gridSize, p.y*gridSize, gridSize-2, gridSize-2); }); }
function moveSnake() { direction = nextDirection; const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y }; if (head.x < 0) head.x = tileCount-1; if (head.x >= tileCount) head.x = 0; if (head.y < 0) head.y = tileCount-1; if (head.y >= tileCount) head.y = 0; if (snake.some(p => p.x === head.x && p.y === head.y)) { endGame(); return; } snake.unshift(head); if (head.x === food.x && head.y === food.y) { score += 10; updateScore(); placeFood(); } else { snake.pop(); } }
function endGame() { gameRunning = false; clearInterval(gameInterval); ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(0,0,snakeCanvas.width,snakeCanvas.height); ctx.fillStyle = 'white'; ctx.font = '20px Inter, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('Game Over', snakeCanvas.width/2, snakeCanvas.height/2); }
function gameLoop() { if (!gameRunning) return; moveSnake(); draw(); }
function startSnakeGame() { if (gameRunning) return; initSnake(); gameInterval = setInterval(gameLoop, 100); }
function stopSnakeGame() { gameRunning = false; clearInterval(gameInterval); }

document.addEventListener('keydown', e => { if (!gameRunning) return; const key = e.key.toLowerCase(); if (['arrowup','w'].includes(key) && direction.y === 0) nextDirection = {x:0, y:-1}; if (['arrowdown','s'].includes(key) && direction.y === 0) nextDirection = {x:0, y:1}; if (['arrowleft','a'].includes(key) && direction.x === 0) nextDirection = {x:-1, y:0}; if (['arrowright','d'].includes(key) && direction.x === 0) nextDirection = {x:1, y:0}; });
let touchStartX, touchStartY;
snakeCanvas.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; touchStartY = e.touches[0].clientY; });
snakeCanvas.addEventListener('touchend', e => { if (!touchStartX || !touchStartY) return; const dx = e.changedTouches[0].clientX - touchStartX, dy = e.changedTouches[0].clientY - touchStartY; if (Math.abs(dx) > Math.abs(dy)) { if (dx > 0 && direction.x === 0) nextDirection = {x:1,y:0}; else if (dx < 0 && direction.x === 0) nextDirection = {x:-1,y:0}; } else { if (dy > 0 && direction.y === 0) nextDirection = {x:0,y:1}; else if (dy < 0 && direction.y === 0) nextDirection = {x:0,y:-1}; } touchStartX = null; touchStartY = null; });

snakeBtn.addEventListener('click', () => { snakeModal.classList.add('active'); startSnakeGame(); });
function closeSnake() { snakeModal.classList.remove('active'); stopSnakeGame(); }
snakeClose.addEventListener('click', closeSnake);
snakeModal.addEventListener('click', e => { if (e.target === snakeModal) closeSnake(); });

const isMobile = window.matchMedia('(pointer: coarse)').matches;
if (!isMobile) {
  let offX, offY, dragging = false;
  snakeHandle.addEventListener('mousedown', e => { dragging = true; const rect = snakeWindow.getBoundingClientRect(); offX = e.clientX - rect.left; offY = e.clientY - rect.top; snakeWindow.style.transition = 'none'; });
  document.addEventListener('mousemove', e => { if (!dragging) return; snakeWindow.style.left = e.clientX - offX + 'px'; snakeWindow.style.top  = e.clientY - offY + 'px'; });
  document.addEventListener('mouseup', () => { dragging = false; snakeWindow.style.transition = ''; });
}

/* ============================
   MUSIC PLAYER (YouTube audio only)
   ============================ */
const playlist = [
  { id: 'JGwWNGJdvx8', title: 'Shape of You', artist: 'Ed Sheeran' },
  { id: 'fKopy74weus', title: 'Blinding Lights', artist: 'The Weeknd' },
  { id: '9bZkp7q19f0', title: 'Gangnam Style', artist: 'PSY' },
  { id: 'kJQP7kiw5Fk', title: 'Despacito', artist: 'Luis Fonsi' },
  { id: 'RgKAFK5djSk', title: 'See You Again', artist: 'Wiz Khalifa' }
];
let curTrack = 0, player = null, isPlaying = false, progressInterval;

const musicBtn = document.getElementById('musicBtn'), musicModal = document.getElementById('musicModal'), musicCloseBtn = document.getElementById('musicCloseBtn'),
      playBtn = document.getElementById('playBtn'), prevBtn = document.getElementById('prevBtn'), nextBtn = document.getElementById('nextBtn'),
      progressBar = document.getElementById('progressBar'), volumeBar = document.getElementById('volumeBar'),
      currentTimeEl = document.getElementById('currentTime'), durationEl = document.getElementById('duration'),
      songTitleEl = document.getElementById('songTitle'), songArtistEl = document.getElementById('songArtist');

function loadTrack(idx) { curTrack = idx; const t = playlist[idx]; songTitleEl.textContent = t.title; songArtistEl.textContent = t.artist; if (player && player.loadVideoById) { player.loadVideoById(t.id); isPlaying = false; playBtn.innerHTML = '<i class="fas fa-play"></i>'; clearInterval(progressInterval); } }
function togglePlay() { if (!player) return; if (isPlaying) { player.pauseVideo(); playBtn.innerHTML = '<i class="fas fa-play"></i>'; } else { player.playVideo(); playBtn.innerHTML = '<i class="fas fa-pause"></i>'; } }
function initYT() { if (player || typeof YT === 'undefined' || !YT.Player) return; player = new YT.Player('ytPlayer', { height: '0', width: '0', videoId: playlist[0].id, playerVars: { autoplay:0, controls:0, disablekb:1, fs:0, iv_load_policy:3, modestbranding:1, rel:0 }, events: { onReady: () => { setVol(); updateDur(); progressInterval = setInterval(updateProg, 500); }, onStateChange: e => { if (e.data === YT.PlayerState.PLAYING) { isPlaying = true; playBtn.innerHTML = '<i class="fas fa-pause"></i>'; } else if (e.data === YT.PlayerState.PAUSED) { isPlaying = false; playBtn.innerHTML = '<i class="fas fa-play"></i>'; } else if (e.data === YT.PlayerState.ENDED) nextTrack(); } } }); }
function setVol() { if (player) player.setVolume(volumeBar.value); }
function updateProg() { if (player && player.getCurrentTime && player.getDuration) { const cur = player.getCurrentTime(), dur = player.getDuration(); if (dur) { progressBar.value = (cur/dur)*100; currentTimeEl.textContent = fmt(cur); durationEl.textContent = fmt(dur); } } }
function updateDur() { if (player && player.getDuration) { const d = player.getDuration(); if (d) durationEl.textContent = fmt(d); } }
function seekTo(v) { if (player && player.getDuration) player.seekTo((v/100)*player.getDuration(), true); }
function fmt(s) { const m = Math.floor(s/60), sec = Math.floor(s%60); return m + ':' + (sec<10?'0':'') + sec; }
function prevTrack() { let i = curTrack - 1; if (i < 0) i = playlist.length - 1; loadTrack(i); if (isPlaying) setTimeout(() => player.playVideo(), 500); }
function nextTrack() { let i = (curTrack + 1) % playlist.length; loadTrack(i); if (isPlaying) setTimeout(() => player.playVideo(), 500); }

musicBtn.addEventListener('click', () => { musicModal.classList.add('active'); loadTrack(0); if (!player && typeof YT !== 'undefined' && YT.Player) initYT(); });
musicCloseBtn.addEventListener('click', () => { musicModal.classList.remove('active'); });
playBtn.addEventListener('click', togglePlay); prevBtn.addEventListener('click', prevTrack); nextBtn.addEventListener('click', nextTrack);
progressBar.addEventListener('input', () => seekTo(progressBar.value)); volumeBar.addEventListener('input', setVol);
if (typeof YT !== 'undefined' && YT.Player) initYT(); else window.onYouTubeIframeAPIReady = initYT;

/* ============================
   CURSOR‑FOLLOWING BLOBS
   ============================ */
const blobsEls = document.querySelectorAll('.blob');
let mX = innerWidth / 2, mY = innerHeight / 2;
document.addEventListener('mousemove', e => { mX = e.clientX; mY = e.clientY; });
if (isMobile) { window.addEventListener('deviceorientation', e => { if (e.gamma === null || e.beta === null) return; mX = (e.gamma + 90) / 180 * innerWidth; mY = (e.beta + 180) / 360 * innerHeight; }); }
(function moveBlobs() { const arr = Array.from(blobsEls); arr.forEach((b, i) => { const factor = (i + 1) * 0.1; const x = (mX - innerWidth/2) * factor, y = (mY - innerHeight/2) * factor; b.style.transform = `translate(${x}px, ${y}px)`; }); requestAnimationFrame(moveBlobs); })();

/* ============================
   2D WORLD MAP WITH TRAFFIC (REAL SVG MAP)
   ============================ */
function initMap() {
  const canvas = document.getElementById('mapCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h;

  let dotCache  = [];    // { lat, lon } — built once from TopoJSON
  let dotCanvas = null;  // pre-rendered dot layer — rebuilt on resize only
  let mapReady  = false;

  // ── Dynamic script loader ───────────────────────────────
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src; s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  // ── Draw one GeoJSON ring onto an equirectangular offscreen canvas ──
  function drawRing(offCtx, ring, OW, OH) {
    ring.forEach(([lon, lat], i) => {
      const x = ((lon + 180) / 360) * OW;
      const y = ((90 - lat)  / 180) * OH;
      i === 0 ? offCtx.moveTo(x, y) : offCtx.lineTo(x, y);
    });
    offCtx.closePath();
  }

  // ── Build lat/lon dot array from TopoJSON (runs once) ──
  function buildDotCache(world) {
    const OW = 3600, OH = 1800, DOT_STEP = 10;
    const offscreen = document.createElement('canvas');
    offscreen.width = OW; offscreen.height = OH;
    const offCtx = offscreen.getContext('2d', { willReadFrequently: true });

    // land is a SINGLE Feature (merged MultiPolygon), not a FeatureCollection
    const land = topojson.feature(world, world.objects.land);
    const g = land.geometry;
    const polys = g.type === 'MultiPolygon' ? g.coordinates
                : g.type === 'Polygon'      ? [g.coordinates]
                : [];

    offCtx.fillStyle = '#fff';
    polys.forEach(poly => {
      offCtx.beginPath();
      poly.forEach(ring => drawRing(offCtx, ring, OW, OH));
      offCtx.fill('evenodd');   // inner rings cut holes correctly
    });

    // Offscreen IS equirectangular — inverse is mathematically exact
    const imgData = offCtx.getImageData(0, 0, OW, OH).data;
    for (let y = 0; y < OH; y += DOT_STEP) {
      for (let x = 0; x < OW; x += DOT_STEP) {
        if (imgData[(y * OW + x) * 4] > 200) {
          dotCache.push({
            lat:  90 - (y / OH) * 180,
            lon: -180 + (x / OW) * 360
          });
        }
      }
    }

    mapReady = true;
    buildDotCanvas();   // render to screen-sized canvas immediately
  }

  // ── Pre-render all dots to an offscreen canvas ──────────
  // Called once after data loads, and again on every resize.
  // drawDottedMap() then does a single drawImage() per frame — very fast.
  function buildDotCanvas() {
    if (!mapReady || !dotCache.length) return;
    dotCanvas = document.createElement('canvas');
    dotCanvas.width = w; dotCanvas.height = h;
    const dc = dotCanvas.getContext('2d');

    const { mapW, mapH, mapX, mapY } = mapBounds();
    const r = isMobile ? 1.1 : 1.5;

    // One big path = one fill() call instead of thousands
    dc.beginPath();
    dotCache.forEach(d => {
      const x = mapX + ((d.lon + 180) / 360) * mapW;
      const y = mapY + ((90 - d.lat)  / 180) * mapH;
      dc.moveTo(x + r, y);
      dc.arc(x, y, r, 0, Math.PI * 2);
    });
    dc.fillStyle = 'rgba(115, 105, 140, 0.52)';
    dc.fill();
  }

  // ── Kick off data loading ───────────────────────────────
  loadScript('https://unpkg.com/topojson-client@3/dist/topojson-client.min.js')
    .then(() => fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'))
    .then(r => r.json())
    .then(world => buildDotCache(world))
    .catch(() => { mapReady = true; });

  // ── Cities ─────────────────────────────────────────────
  const cities = [
    { name: 'Colombo',      lat:   6.9271, lon:  79.8612 },
    { name: 'Singapore',    lat:   1.3521, lon: 103.8198 },
    { name: 'Mumbai',       lat:  19.0760, lon:  72.8777 },
    { name: 'Dubai',        lat:  25.2048, lon:  55.2708 },
    { name: 'Frankfurt',    lat:  50.1109, lon:   8.6821 },
    { name: 'London',       lat:  51.5072, lon:  -0.1276 },
    { name: 'Amsterdam',    lat:  52.3676, lon:   4.9041 },
    { name: 'Tokyo',        lat:  35.6762, lon: 139.6503 },
    { name: 'Seoul',        lat:  37.5665, lon: 126.9780 },
    { name: 'Sydney',       lat: -33.8688, lon: 151.2093 },
    { name: 'New York',     lat:  40.7128, lon: -74.0060 },
    { name: 'Los Angeles',  lat:  34.0522, lon: -118.2437 },
    { name: 'Toronto',      lat:  43.6532, lon: -79.3832 },
    { name: 'São Paulo',    lat: -23.5558, lon: -46.6396 },
    { name: 'Johannesburg', lat: -26.2041, lon:  28.0473 }
  ];

  // ── Routes ─────────────────────────────────────────────
  const routes = [
    ['Colombo','Singapore'], ['Colombo','Mumbai'],   ['Colombo','Dubai'],
    ['Singapore','Tokyo'],   ['Singapore','Sydney'], ['Mumbai','Frankfurt'],
    ['Dubai','Frankfurt'],   ['Dubai','London'],     ['Frankfurt','London'],
    ['Frankfurt','New York'],['London','New York'],  ['New York','Los Angeles'],
    ['Tokyo','Los Angeles'], ['Amsterdam','Toronto'],['São Paulo','London'],
    ['Johannesburg','Dubai']
  ];

  let flows = [], particles = [];
  let totalAttacks = 4800000 + Math.floor(Math.random() * 800000);

  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const targetFPS = isMobile ? 24 : 60;
  const frameDelay = 1000 / targetFPS;
  let lastTime = 0, frame = 0;

  // ── Projection (equirectangular, same alignment as dot cache) ──
  function mapBounds() {
    const mapRatio = 2;
    let mapW = w * 1.12, mapH = mapW / mapRatio;
    if (mapH < h * 0.72) { mapH = h * 0.72; mapW = mapH * mapRatio; }
    return { mapW, mapH, mapX: (w - mapW) / 2, mapY: (h - mapH) / 2 + h * 0.02 };
  }

  function project(lat, lon) {
    const { mapW, mapH, mapX, mapY } = mapBounds();
    return {
      x: mapX + ((lon + 180) / 360) * mapW,
      y: mapY + ((90 - lat) / 180) * mapH
    };
  }

  // ── Background ─────────────────────────────────────────
  function drawBackground() {
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#0f0c1a');
    grad.addColorStop(1, '#07060f');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle latitude / longitude grid
    ctx.strokeStyle = 'rgba(255,255,255,0.025)';
    ctx.lineWidth = 0.5;
    const { mapW, mapH, mapX, mapY } = mapBounds();
    for (let lon = -180; lon <= 180; lon += 30) {
      const x = mapX + ((lon + 180) / 360) * mapW;
      ctx.beginPath(); ctx.moveTo(x, mapY); ctx.lineTo(x, mapY + mapH); ctx.stroke();
    }
    for (let lat = -90; lat <= 90; lat += 30) {
      const y = mapY + ((90 - lat) / 180) * mapH;
      ctx.beginPath(); ctx.moveTo(mapX, y); ctx.lineTo(mapX + mapW, y); ctx.stroke();
    }
  }

  // ── Dotted world map — single drawImage per frame ─────
  function drawDottedMap() {
    if (dotCanvas) ctx.drawImage(dotCanvas, 0, 0);
  }

  // ── City markers + labels ──────────────────────────────
  function drawCities() {
    const t = Date.now() / 900;
    cities.forEach((c, idx) => {
      const p = project(c.lat, c.lon);
      const pulse = (Math.sin(t + idx * 1.3) + 1) / 2;

      // Outer pulse ring
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4 + pulse * 7, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(200, 170, 90, ${0.08 + pulse * 0.14})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Inner glow ring
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(230, 190, 80, ${0.35 + pulse * 0.25})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Core dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 210, 100, ${0.7 + pulse * 0.3})`;
      ctx.shadowColor = 'rgba(255, 190, 60, 0.9)';
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.restore();

      // City label
      ctx.save();
      ctx.font = `${isMobile ? 9 : 10}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(220, 205, 160, 0.75)';
      ctx.fillText(c.name, p.x, p.y - 9);
      ctx.restore();
    });
  }

  // ── Attack counter on canvas ───────────────────────────
  function drawCounter() {
    totalAttacks += Math.floor(Math.random() * 4 + 1);
    const txt = totalAttacks.toLocaleString() + '  ATTACKS ON THIS DAY';
    ctx.save();
    ctx.font = `bold ${isMobile ? 11 : 14}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(255, 50, 90, 0.55)';
    ctx.shadowBlur = 14;
    ctx.fillStyle = '#ff3d6a';
    ctx.fillText(txt, w / 2, 38);
    ctx.restore();
  }

  // ── Bezier helper ──────────────────────────────────────
  function curvePoint(a, b, t) {
    const midX = (a.x + b.x) / 2, midY = (a.y + b.y) / 2;
    const dx = b.x - a.x, dy = b.y - a.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const lift = Math.min(isMobile ? 65 : 130, Math.max(28, dist * 0.18));
    const nx = -dy / dist, ny = dx / dist;
    const cx = midX + nx * lift, cy = midY + ny * lift;
    return {
      x: (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * cx + t * t * b.x,
      y: (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * cy + t * t * b.y,
      cx, cy
    };
  }

  // ── Spawn flows ────────────────────────────────────────
  function spawnFlow() {
    if (flows.length > (isMobile ? 10 : 22)) return;
    const pair = routes[Math.floor(Math.random() * routes.length)];
    const fromCity = cities.find(c => c.name === pair[0]);
    const toCity   = cities.find(c => c.name === pair[1]);
    if (!fromCity || !toCity) return;
    const flow = {
      from: fromCity, to: toCity,
      life: 0, maxLife: 130 + Math.random() * 100,
      opacity: 0.25 + Math.random() * 0.35
    };
    flows.push(flow);
    const count = isMobile ? 1 : 3;
    for (let i = 0; i < count; i++) {
      particles.push({ flow, t: Math.random() * 0.2, speed: 0.007 + Math.random() * 0.007, size: isMobile ? 1.8 : 2.6 });
    }
  }

  // ── Update state ───────────────────────────────────────
  function updateTraffic() {
    if (frame % (isMobile ? 12 : 7) === 0) spawnFlow();
    flows.forEach(f => f.life++);
    flows = flows.filter(f => f.life < f.maxLife);
    particles.forEach(p => p.t += p.speed);
    particles = particles.filter(p => p.t <= 1 && flows.includes(p.flow));
  }

  // ── Draw gold arcs + glowing particles ────────────────
  function drawTraffic() {
    flows.forEach(f => {
      const start = project(f.from.lat, f.from.lon);
      const end   = project(f.to.lat,   f.to.lon);
      const fadeIn  = Math.min(1, f.life / 30);
      const fadeOut = Math.min(1, (f.maxLife - f.life) / 40);
      const alpha   = f.opacity * Math.min(fadeIn, fadeOut);
      const cp = curvePoint(start, end, 0.5);

      // Outer glow
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.quadraticCurveTo(cp.cx, cp.cy, end.x, end.y);
      ctx.strokeStyle = `rgba(200, 140, 20, ${alpha * 0.35})`;
      ctx.lineWidth = isMobile ? 2.5 : 4;
      ctx.filter = 'blur(3px)';
      ctx.stroke();
      ctx.restore();

      // Core arc
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.quadraticCurveTo(cp.cx, cp.cy, end.x, end.y);
      const grad = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
      grad.addColorStop(0,   `rgba(255, 180,  40, ${alpha * 0.6})`);
      grad.addColorStop(0.5, `rgba(255, 210,  80, ${alpha})`);
      grad.addColorStop(1,   `rgba(255, 150,  20, ${alpha * 0.5})`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = isMobile ? 0.8 : 1.2;
      ctx.stroke();
      ctx.restore();
    });

    // Glowing gold head particles
    particles.forEach(p => {
      const start = project(p.flow.from.lat, p.flow.from.lon);
      const end   = project(p.flow.to.lat,   p.flow.to.lon);
      const pos   = curvePoint(start, end, p.t);
      ctx.save();
      const grd = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, p.size * 3.5);
      grd.addColorStop(0,   'rgba(255, 230,  90, 1)');
      grd.addColorStop(0.3, 'rgba(255, 170,  30, 0.75)');
      grd.addColorStop(1,   'rgba(255, 120,   0, 0)');
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, p.size * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
      ctx.restore();
    });
  }

  // ── HUD update ─────────────────────────────────────────
  function updateHud() {
    const activeFlowsEl = document.getElementById('activeFlows');
    const packetRateEl  = document.getElementById('packetRate');
    const avgLatencyEl  = document.getElementById('avgLatency');
    const dataFlowEl    = document.getElementById('dataFlow');
    if (!activeFlowsEl) return;
    const active = flows.length;
    activeFlowsEl.textContent = active.toString().padStart(2, '0');
    packetRateEl.textContent  = Math.round(3800 + active * 420 + Math.random() * 1200).toLocaleString();
    avgLatencyEl.textContent  = Math.round(24 + Math.random() * 38) + ' ms';
    if (!window.__trafficTotalData) window.__trafficTotalData = 164.2;
    window.__trafficTotalData += 0.03 + Math.random() * 0.08;
    dataFlowEl.textContent = window.__trafficTotalData.toFixed(1) + ' GB';
  }

  // ── Main loop ──────────────────────────────────────────
  function animate(now) {
    requestAnimationFrame(animate);
    if (now - lastTime < frameDelay) return;
    lastTime = now;
    frame++;

    ctx.clearRect(0, 0, w, h);
    drawBackground();
    drawDottedMap();
    updateTraffic();
    drawTraffic();
    drawCities();
    drawCounter();

    if (frame % 18 === 0) updateHud();
  }

  function resize() {
    w = canvas.width  = innerWidth;
    h = canvas.height = innerHeight;
    buildDotCanvas();   // re-render dots for new dimensions
  }
  window.addEventListener('resize', resize);
  resize();

  for (let i = 0; i < (isMobile ? 5 : 12); i++) spawnFlow();
  requestAnimationFrame(animate);
}

/* ============================
   START EVERYTHING
   ============================ */
window.addEventListener('load', () => {
  loadProjects();   // populate project cards
  initMap();        // start the world map with traffic
});