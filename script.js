/* ============================
   AOS (Animate on Scroll) – safe init
   ============================ */
function initAOS() {
  // If the AOS library is already loaded, initialise it.
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true });
  } else {
    // Otherwise wait 200ms and try again.
    setTimeout(initAOS, 200);
  }
}
initAOS();

/* ============================
   THEME TOGGLE (iOS switch + auto day/night)
   ============================ */
const bodyEl = document.body;
const themeToggle = document.getElementById('themeToggleCheckbox');
let manualMode = false;               // true when the user manually flips the switch
let userOverride = localStorage.getItem('themeOverride');  // 'light' or 'dark'

/**
 * Applies the given theme to the UI.
 * @param {boolean} light – true for light mode, false for dark.
 */
function updateThemeUI(light) {
  if (light) {
    bodyEl.classList.add('light');
    themeToggle.checked = true;
  } else {
    bodyEl.classList.remove('light');
    themeToggle.checked = false;
  }
}

/** Returns true if it's daytime (6 AM – 5:59 PM). */
function isDay() {
  const h = new Date().getHours();
  return h >= 6 && h < 18;
}

/** Chooses the correct theme based on manual override or time of day. */
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
// Re‑check every minute in auto mode
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
  // Try ipapi.co
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
  // Fallback to ip‑api.com
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
  // Both failed → show globe emoji and use device timezone
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
  // 1. Try to load from local data/projects.json
  try {
    const r = await fetch('data/projects.json');
    if (r.ok) projects = await r.json();
  } catch (e) {}
  // 2. Fetch your GitHub repos (public)
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
   NETWORK MONITOR SIMULATION
   ============================ */
setInterval(() => {
  document.getElementById('dlSpeed').textContent = (Math.random() * 50 + 10).toFixed(1) + ' Mbps';
  document.getElementById('ulSpeed').textContent = (Math.random() * 20 + 5).toFixed(1) + ' Mbps';
  document.getElementById('latency').textContent = (Math.random() * 80 + 5).toFixed(0) + ' ms';
}, 1500);

/* ============================
   SNAKE GAME (unchanged)
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

// ... (full snake game functions as before – initSnake, placeFood, updateScore, draw, moveSnake, endGame, gameLoop, startSnakeGame, stopSnakeGame, keyboard/touch listeners, modal controls, draggable)
// I am including them explicitly to keep the answer self‑contained.

function initSnake() {
  snake = [{x: 10, y: 10}];
  direction = {x: 1, y: 0};
  nextDirection = {x: 1, y: 0};
  score = 0;
  gameRunning = true;
  placeFood();
  updateScore();
}
function placeFood() {
  food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
  while (snake.some(p => p.x === food.x && p.y === food.y)) {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
  }
}
function updateScore() { scoreSpan.textContent = 'Score: ' + score; }
function draw() {
  ctx.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height);
  ctx.fillStyle = '#e74c3c';
  ctx.beginPath();
  ctx.arc(food.x*gridSize + gridSize/2, food.y*gridSize + gridSize/2, gridSize/2 - 2, 0, 2*Math.PI);
  ctx.fill();
  snake.forEach((p,i) => {
    ctx.fillStyle = i === 0 ? '#2ecc71' : '#27ae60';
    ctx.fillRect(p.x*gridSize, p.y*gridSize, gridSize-2, gridSize-2);
  });
}
function moveSnake() {
  direction = nextDirection;
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  if (head.x < 0) head.x = tileCount-1;
  if (head.x >= tileCount) head.x = 0;
  if (head.y < 0) head.y = tileCount-1;
  if (head.y >= tileCount) head.y = 0;
  if (snake.some(p => p.x === head.x && p.y === head.y)) { endGame(); return; }
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) { score += 10; updateScore(); placeFood(); }
  else { snake.pop(); }
}
function endGame() {
  gameRunning = false;
  clearInterval(gameInterval);
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(0,0,snakeCanvas.width,snakeCanvas.height);
  ctx.fillStyle = 'white';
  ctx.font = '20px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Game Over', snakeCanvas.width/2, snakeCanvas.height/2);
}
function gameLoop() { if (!gameRunning) return; moveSnake(); draw(); }
function startSnakeGame() { if (gameRunning) return; initSnake(); gameInterval = setInterval(gameLoop, 100); }
function stopSnakeGame() { gameRunning = false; clearInterval(gameInterval); }

document.addEventListener('keydown', e => {
  if (!gameRunning) return;
  const key = e.key.toLowerCase();
  if (['arrowup','w'].includes(key) && direction.y === 0) nextDirection = {x:0, y:-1};
  if (['arrowdown','s'].includes(key) && direction.y === 0) nextDirection = {x:0, y:1};
  if (['arrowleft','a'].includes(key) && direction.x === 0) nextDirection = {x:-1, y:0};
  if (['arrowright','d'].includes(key) && direction.x === 0) nextDirection = {x:1, y:0};
});
let touchStartX, touchStartY;
snakeCanvas.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; touchStartY = e.touches[0].clientY; });
snakeCanvas.addEventListener('touchend', e => {
  if (!touchStartX || !touchStartY) return;
  const dx = e.changedTouches[0].clientX - touchStartX, dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0 && direction.x === 0) nextDirection = {x:1,y:0};
    else if (dx < 0 && direction.x === 0) nextDirection = {x:-1,y:0};
  } else {
    if (dy > 0 && direction.y === 0) nextDirection = {x:0,y:1};
    else if (dy < 0 && direction.y === 0) nextDirection = {x:0,y:-1};
  }
  touchStartX = null; touchStartY = null;
});

snakeBtn.addEventListener('click', () => { snakeModal.classList.add('active'); startSnakeGame(); });
function closeSnake() { snakeModal.classList.remove('active'); stopSnakeGame(); }
snakeClose.addEventListener('click', closeSnake);
snakeModal.addEventListener('click', e => { if (e.target === snakeModal) closeSnake(); });

const isMobile = window.matchMedia('(pointer: coarse)').matches;
if (!isMobile) {
  let offX, offY, dragging = false;
  snakeHandle.addEventListener('mousedown', e => {
    dragging = true;
    const rect = snakeWindow.getBoundingClientRect();
    offX = e.clientX - rect.left; offY = e.clientY - rect.top;
    snakeWindow.style.transition = 'none';
  });
  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    snakeWindow.style.left = e.clientX - offX + 'px';
    snakeWindow.style.top  = e.clientY - offY + 'px';
  });
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

const musicBtn = document.getElementById('musicBtn');
const musicModal = document.getElementById('musicModal');
const musicCloseBtn = document.getElementById('musicCloseBtn');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const volumeBar = document.getElementById('volumeBar');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const songTitleEl = document.getElementById('songTitle');
const songArtistEl = document.getElementById('songArtist');

function loadTrack(idx) {
  curTrack = idx;
  const t = playlist[idx];
  songTitleEl.textContent = t.title; songArtistEl.textContent = t.artist;
  if (player && player.loadVideoById) {
    player.loadVideoById(t.id);
    isPlaying = false;
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    clearInterval(progressInterval);
  }
}
function togglePlay() {
  if (!player) return;
  if (isPlaying) { player.pauseVideo(); playBtn.innerHTML = '<i class="fas fa-play"></i>'; }
  else { player.playVideo(); playBtn.innerHTML = '<i class="fas fa-pause"></i>'; }
}
function initYT() {
  if (player || typeof YT === 'undefined' || !YT.Player) return;
  player = new YT.Player('ytPlayer', {
    height: '0', width: '0', videoId: playlist[0].id,
    playerVars: { autoplay: 0, controls: 0, disablekb: 1, fs:0, iv_load_policy:3, modestbranding:1, rel:0 },
    events: {
      onReady: () => { setVol(); updateDur(); progressInterval = setInterval(updateProg, 500); },
      onStateChange: e => {
        if (e.data === YT.PlayerState.PLAYING) { isPlaying = true; playBtn.innerHTML = '<i class="fas fa-pause"></i>'; }
        else if (e.data === YT.PlayerState.PAUSED) { isPlaying = false; playBtn.innerHTML = '<i class="fas fa-play"></i>'; }
        else if (e.data === YT.PlayerState.ENDED) nextTrack();
      }
    }
  });
}
function setVol() { if (player) player.setVolume(volumeBar.value); }
function updateProg() {
  if (player && player.getCurrentTime && player.getDuration) {
    const cur = player.getCurrentTime(), dur = player.getDuration();
    if (dur) { progressBar.value = (cur/dur)*100; currentTimeEl.textContent = fmt(cur); durationEl.textContent = fmt(dur); }
  }
}
function updateDur() { if (player && player.getDuration) { const d = player.getDuration(); if (d) durationEl.textContent = fmt(d); } }
function seekTo(v) { if (player && player.getDuration) player.seekTo((v/100)*player.getDuration(), true); }
function fmt(s) { const m = Math.floor(s/60), sec = Math.floor(s%60); return m + ':' + (sec<10?'0':'') + sec; }
function prevTrack() { let i = curTrack - 1; if (i < 0) i = playlist.length - 1; loadTrack(i); if (isPlaying) setTimeout(() => player.playVideo(), 500); }
function nextTrack() { let i = (curTrack + 1) % playlist.length; loadTrack(i); if (isPlaying) setTimeout(() => player.playVideo(), 500); }

musicBtn.addEventListener('click', () => { musicModal.classList.add('active'); loadTrack(0); if (!player && typeof YT !== 'undefined' && YT.Player) initYT(); });
musicCloseBtn.addEventListener('click', () => { musicModal.classList.remove('active'); });
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', prevTrack);
nextBtn.addEventListener('click', nextTrack);
progressBar.addEventListener('input', () => seekTo(progressBar.value));
volumeBar.addEventListener('input', setVol);

if (typeof YT !== 'undefined' && YT.Player) initYT();
else window.onYouTubeIframeAPIReady = initYT;

/* ============================
   CURSOR‑FOLLOWING BLOBS
   ============================ */
const blobsEls = document.querySelectorAll('.blob');
let mX = innerWidth / 2, mY = innerHeight / 2;
document.addEventListener('mousemove', e => { mX = e.clientX; mY = e.clientY; });
if (isMobile) {
  window.addEventListener('deviceorientation', e => {
    if (e.gamma === null || e.beta === null) return;
    mX = (e.gamma + 90) / 180 * innerWidth;
    mY = (e.beta + 180) / 360 * innerHeight;
  });
}
(function moveBlobs() {
  const arr = Array.from(blobsEls);
  arr.forEach((b, i) => {
    const factor = (i + 1) * 0.1;
    const x = (mX - innerWidth/2) * factor, y = (mY - innerHeight/2) * factor;
    b.style.transform = `translate(${x}px, ${y}px)`;
  });
  requestAnimationFrame(moveBlobs);
})();

/* ============================
   2D WORLD MAP WITH LIVE TRAFFIC
   ============================ */
function initMap() {
  const canvas = document.getElementById('mapCanvas');
  const ctx = canvas.getContext('2d');
  let w, h;

  /* ------------- REALISTIC CONTINENT OUTLINES -------------
     Each continent is an array of [lat, lon] points.
     The map uses a Mercator projection. */
  const continents = [
    // Africa
    { pts: [[31.1,-17.3],[32.3,-26.1],[28.6,-32.7],[23.0,-33.0],[18.5,-34.8],[14.5,-30.0],[10.0,-25.0],[8.0,-18.0],[11.0,-11.0],[15.0,-3.0],[21.0,0.0],[25.0,5.0],[31.1,5.0],[37.0,10.0],[37.1,17.0],[36.0,22.0],[33.0,25.0],[31.0,23.0],[31.1,-17.3]], fill:'#2a5298' },
    // North America
    { pts: [[53.0,-170.0],[53.0,-130.0],[48.0,-125.0],[44.0,-124.0],[42.0,-115.0],[35.0,-105.0],[32.0,-105.0],[30.0,-95.0],[25.0,-80.0],[20.0,-78.0],[18.0,-90.0],[20.0,-105.0],[22.0,-110.0],[28.0,-118.0],[35.0,-125.0],[45.0,-130.0],[53.0,-170.0]], fill:'#2a5298' },
    // South America
    { pts: [[10.0,-75.0],[8.0,-60.0],[4.0,-51.0],[-2.0,-45.0],[-5.0,-35.0],[-15.0,-38.0],[-22.0,-40.0],[-34.0,-53.0],[-40.0,-62.0],[-44.0,-65.0],[-54.0,-68.0],[-53.0,-72.0],[-48.0,-73.0],[-34.0,-57.0],[-22.0,-40.0],[-10.0,-35.0],[0.0,-50.0],[10.0,-75.0]], fill:'#2a5298' },
    // Asia
    { pts: [[50.0,140.0],[50.0,150.0],[55.0,160.0],[60.0,170.0],[65.0,180.0],[68.0,-170.0],[70.0,-160.0],[72.0,-140.0],[74.0,-110.0],[70.0,-90.0],[62.0,-75.0],[55.0,-60.0],[45.0,-55.0],[40.0,-50.0],[36.0,-45.0],[32.0,-35.0],[31.1,-17.3],[37.0,10.0],[42.0,30.0],[48.0,40.0],[53.0,50.0],[60.0,60.0],[68.0,70.0],[72.0,80.0],[76.0,90.0],[78.0,100.0],[70.0,120.0],[60.0,130.0],[50.0,140.0]], fill:'#2a5298' },
    // Europe
    { pts: [[48.0,0.0],[52.0,5.0],[55.0,15.0],[60.0,20.0],[65.0,25.0],[70.0,20.0],[72.0,15.0],[70.0,5.0],[65.0,-10.0],[60.0,-15.0],[55.0,-15.0],[48.0,-5.0],[45.0,0.0],[48.0,0.0]], fill:'#2a5298' },
    // Australia
    { pts: [[-12.0,130.0],[-10.0,135.0],[-15.0,145.0],[-20.0,148.0],[-25.0,150.0],[-30.0,153.0],[-35.0,150.0],[-38.0,145.0],[-35.0,135.0],[-28.0,125.0],[-20.0,115.0],[-12.0,130.0]], fill:'#2a5298' }
  ];

  /* ----- CITIES (lat, lon) for dots ----- */
  const cities = [
    [40.7,-74.0],[51.5,-0.1],[35.7,139.7],[-33.9,151.2],[55.8,37.6],[25.2,55.3],[1.3,103.8],
    [-23.5,-46.6],[19.4,-99.1],[48.9,2.3],[39.9,32.9],[-26.2,28.0],[37.6,127.0],[-1.3,36.8],
    [28.6,77.2],[13.8,100.5],[14.6,121.0],[-6.2,106.8],[3.1,101.7],[22.3,114.2]
  ];

  /* ----- TRAFFIC ARCS from Sri Lanka (6.9°N, 79.9°E) ----- */
  let arcs = [];

  /** Mercator projection: converts lat/lon to canvas coordinates. */
  function project(lat, lon) {
    const x = (lon + 180) * (w / 360);
    const latRad = lat * Math.PI / 180;
    const mercN = Math.log(Math.tan((Math.PI / 4) + (latRad / 2)));
    const y = (h / 2) - (w * mercN / (2 * Math.PI));
    return [x, y];
  }

  /** Draw the continent outlines. */
  function drawMap() {
    ctx.save();
    ctx.globalAlpha = 0.2;
    continents.forEach(c => {
      ctx.beginPath();
      const first = project(c.pts[0][0], c.pts[0][1]);
      ctx.moveTo(first[0], first[1]);
      for (let i = 1; i < c.pts.length; i++) {
        const p = project(c.pts[i][0], c.pts[i][1]);
        ctx.lineTo(p[0], p[1]);
      }
      ctx.closePath();
      ctx.fillStyle = c.fill;
      ctx.fill();
    });
    ctx.restore();
  }

  /** Main animation loop. */
  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, w, h);
    drawMap();

    // Draw city dots
    ctx.fillStyle = '#4ae2ff';
    cities.forEach(c => {
      const [x, y] = project(c[0], c[1]);
      ctx.beginPath(); ctx.arc(x, y, 1.5, 0, 2*Math.PI); ctx.fill();
    });

    // Sri Lanka blinking red dot
    const [slX, slY] = project(6.9, 79.9);
    const blink = Math.sin(Date.now() * 0.01) * 0.5 + 0.5;
    ctx.fillStyle = `rgba(255, 50, 50, ${blink})`;
    ctx.beginPath(); ctx.arc(slX, slY, 4, 0, 2*Math.PI); ctx.fill();

    // Draw traffic arcs
    arcs.forEach(a => {
      const [x1, y1] = project(a.from[0], a.from[1]);
      const [x2, y2] = project(a.to[0], a.to[1]);
      const midX = (x1 + x2) / 2 + (y2 - y1) * 0.3;
      const midY = (y1 + y2) / 2 - (x2 - x1) * 0.3;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo(midX, midY, x2, y2);
      ctx.strokeStyle = a.color; ctx.lineWidth = 0.8; ctx.stroke();

      // Moving dots along the arc
      a.dots.forEach(d => {
        const t = d.t;
        const dx = (1-t)*(1-t)*x1 + 2*(1-t)*t*midX + t*t*x2;
        const dy = (1-t)*(1-t)*y1 + 2*(1-t)*t*midY + t*t*y2;
        ctx.beginPath(); ctx.arc(dx, dy, 1.5, 0, 2*Math.PI);
        ctx.fillStyle = a.color; ctx.fill();
        d.t += d.speed * d.dir;
        if (d.t > 1 || d.t < 0) d.dir *= -1;
      });
    });

    // Spawn new arcs periodically
    if (Math.random() < 0.02) {
      const to = cities[Math.floor(Math.random() * cities.length)];
      arcs.push({
        from: [6.9, 79.9],
        to: [to[0], to[1]],
        color: `hsl(${Math.random() * 360}, 80%, 60%)`,
        dots: [{ t: 0, speed: 0.003 + Math.random() * 0.006, dir: 1 }]
      });
      if (arcs.length > 25) arcs.shift();
    }
  }

  /** Handle window resize – make the canvas fill the screen. */
  function resize() {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();
  animate();
}

/* ============================
   START EVERYTHING
   ============================ */
window.addEventListener('load', () => {
  loadProjects();   // populate projects grid
  initMap();        // draw the 2D world map
});