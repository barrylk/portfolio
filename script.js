// ========== AOS ==========
function initAOS() { if (typeof AOS !== 'undefined') AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true }); else setTimeout(initAOS, 200); }
initAOS();

// ========== THEME (iOS toggle + auto) ==========
const bodyEl = document.body;
const themeToggle = document.getElementById('themeToggleCheckbox');
let manualMode = false, userOverride = localStorage.getItem('themeOverride');
function updateThemeUI(light) {
  if (light) { bodyEl.classList.add('light'); themeToggle.checked = true; }
  else { bodyEl.classList.remove('light'); themeToggle.checked = false; }
}
function isDay() { const h = new Date().getHours(); return h >= 6 && h < 18; }
function applyTheme() {
  let light = manualMode ? userOverride === 'light' : isDay();
  updateThemeUI(light);
}
themeToggle.addEventListener('change', () => {
  manualMode = true;
  userOverride = themeToggle.checked ? 'light' : 'dark';
  localStorage.setItem('themeOverride', userOverride);
  applyTheme();
});
applyTheme();
setInterval(() => { if (!manualMode) applyTheme(); }, 60000);

// ========== AGE ==========
const ageEl = document.getElementById('ageDisplay');
const birth = new Date('2000-06-29');
const today = new Date();
let age = today.getFullYear() - birth.getFullYear();
if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
ageEl.textContent = age;
document.getElementById('currentYear').textContent = today.getFullYear();

// ========== VISITOR FLAG & TIME ==========
let visitorTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
let clockInterval = null;
async function fetchGeoData() {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (res.ok) {
      const data = await res.json();
      if (data.timezone) visitorTimezone = data.timezone;
      if (data.country_code) {
        const code = data.country_code.toLowerCase();
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

// ========== MOBILE TAB BAR ACTIVE STATE ==========
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
    if (tab.getAttribute('href') === `#${current}`) tab.classList.add('active');
  });
});

// ========== EXPERIENCE ==========
const expData = [
  { period:'Dec 2024 – Present', title:'IT Manager', company:'FIBC Lanka (Pvt) Ltd, Polonnaruwa', desc:'Managing IT operations, networks, servers, cloud, security, ERP (Tally Prime), HRM (SignHR), CCTV, and hardware/software support. Also creating bag artwork and social media content.' },
  { period:'Jul 2021 – Oct 2023', title:'Computer Aided Design Designer', company:'Brandix, Polonnaruwa', desc:'Designed apparel patterns using Lectra Modaris and AutoCAD, ensuring precision and efficiency in mass production.' }
];
const timeline = document.getElementById('experienceTimeline');
timeline.innerHTML = expData.map((e,i) => `
  <div class="timeline-item" data-aos="fade-up" data-aos-delay="${i*100}">
    <div class="timeline-dot"></div>
    <div class="timeline-content">
      <div class="timeline-date">${e.period}</div>
      <div class="timeline-title">${e.title}</div>
      <div class="timeline-company">${e.company}</div>
      <p>${e.desc}</p>
    </div>
  </div>`).join('');

// ========== SKILLS ==========
const skills = [
  { cat:'IT & ERP', items:[{n:'Tally ERP / SignHR',p:85},{n:'Network & Security',p:90},{n:'Cloud & Server Admin',p:80},{n:'CCTV & Hardware Support',p:88}] },
  { cat:'Graphic & CAD Design', items:[{n:'Adobe Photoshop',p:92},{n:'Modaris',p:85},{n:'AutoCAD',p:80},{n:'CorelDRAW',p:88}] }
];
const skillsContainer = document.getElementById('skillsContainer');
skillsContainer.innerHTML = skills.map(c => `
  <div class="skill-category" data-aos="fade-up">
    <h4>${c.cat}</h4>
    ${c.items.map(s => `
      <div class="skill-bar-item">
        <div class="skill-info"><span>${s.n}</span><span>${s.p}%</span></div>
        <div class="skill-progress"><div class="skill-progress-fill" style="width:${s.p}%"></div></div>
      </div>`).join('')}
  </div>`).join('');

// ========== EDUCATION ==========
const eduData = [
  { period:'Jun 2017 – Jun 2026', title:'BSc (Hons) Computer Networks & Security', company:'American College of Higher Education', desc:'CCNA Certified. Cisco Networking Academy, IEEE Student Branch, hackathons.' },
  { period:'Feb 2016 – Aug 2016', title:'Diploma in Computer Software Engineering', company:'ICT Institute Polonnaruwa', desc:'C++, C#, and software development fundamentals.' }
];
const eduTimeline = document.getElementById('educationTimeline');
eduTimeline.innerHTML = eduData.map((e,i) => `
  <div class="timeline-item" data-aos="fade-up" data-aos-delay="${i*100}">
    <div class="timeline-dot"></div>
    <div class="timeline-content">
      <div class="timeline-date">${e.period}</div>
      <div class="timeline-title">${e.title}</div>
      <div class="timeline-company">${e.company}</div>
      <p>${e.desc}</p>
    </div>
  </div>`).join('');

// ========== LINKEDIN ==========
fetch('data/linkedin.json')
  .then(r => r.json()).then(d => {
    document.getElementById('linkedinHeadline').textContent = d.headline || 'IT Manager & Digital Creative at FIBC Lanka (Pvt) Ltd';
  }).catch(() => document.getElementById('linkedinHeadline').textContent = 'IT Manager & Digital Creative at FIBC Lanka (Pvt) Ltd');

// ========== PROJECTS ==========
const langIcons = {JavaScript:'devicon-javascript-plain',Python:'devicon-python-plain',HTML:'devicon-html5-plain',CSS:'devicon-css3-plain'};
const kwIcons = {network:'fa-network-wired',dashboard:'fa-chart-line',design:'fa-paint-brush',bot:'fa-robot',chat:'fa-comment',web:'fa-globe',api:'fa-code',secret:'fa-lock',container:'fa-box'};
const defaultIcon = 'fa-code';
function getIcon(p) {
  if (p.icon) return p.icon;
  const lang = p.language || (p.tags && p.tags[0]);
  if (lang && langIcons[lang]) return langIcons[lang];
  const text = (p.name+' '+ (p.description||'')).toLowerCase();
  for (let k in kwIcons) if (text.includes(k)) return kwIcons[k];
  return defaultIcon;
}
async function loadProjects() {
  const grid = document.getElementById('projectsGrid');
  let projects = [];
  try {
    const r = await fetch('data/projects.json');
    if (r.ok) projects = await r.json();
  } catch(e){}
  try {
    const gh = await fetch('https://api.github.com/users/barrylk/repos?sort=updated&per_page=6');
    if (gh.ok) {
      const repos = await gh.json();
      const mapped = repos.map(r => ({
        name:r.name, description:r.description||'GitHub Repository', language:r.language, tags:r.language?[r.language]:[], links:{github:r.html_url}
      }));
      projects = [...projects, ...mapped];
    }
  } catch(e){}
  if (!projects.length) projects = [{name:'Sample Project', description:'Add projects in data/projects.json', icon:'fa-code'}];
  if (!document.querySelector('link[href*="devicon"]')) {
    const l = document.createElement('link'); l.rel='stylesheet'; l.href='https://cdn.jsdelivr.net/gh/devicons/devicon@v2.15.1/devicon.min.css'; document.head.appendChild(l);
  }
  projects.forEach(p => p.icon = getIcon(p));
  grid.innerHTML = projects.map((p,i) => {
    const ic = p.icon.startsWith('devicon-') ? `<i class="${p.icon}"></i>` : `<i class="fas ${p.icon}"></i>`;
    return `<div class="project-card" data-aos="fade-up" data-aos-delay="${i*50}" onclick='openModal(${JSON.stringify(p).replace(/'/g,"&apos;")})'>
      <div class="project-icon">${ic}</div>
      <div class="project-title">${p.name}</div>
      <div class="project-desc">${p.description||''}</div>
      ${p.tags?`<div class="project-tags">${p.tags.map(t=>`<span class="project-tag">${t}</span>`).join('')}</div>`:''}
    </div>`;
  }).join('');
}
function openModal(p) {
  document.getElementById('modalTitle').textContent = p.name;
  document.getElementById('modalDescription').textContent = p.description||'';
  let links = '';
  if (p.links?.github) links += `<a href="${p.links.github}" target="_blank" class="cta-btn primary">GitHub</a>`;
  if (p.links?.drive) links += `<a href="${p.links.drive}" target="_blank" class="cta-btn primary">Drive</a>`;
  document.getElementById('modalLinks').innerHTML = links;
  document.getElementById('projectModal').style.display = 'flex';
}
window.closeModal = () => document.getElementById('projectModal').style.display = 'none';
window.onclick = e => { if (e.target === document.getElementById('projectModal')) closeModal(); };

// ========== CONTACT FORM ==========
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

// ========== NETWORK MONITOR SIMULATION ==========
setInterval(() => {
  document.getElementById('dlSpeed').textContent = (Math.random() * 50 + 10).toFixed(1) + ' Mbps';
  document.getElementById('ulSpeed').textContent = (Math.random() * 20 + 5).toFixed(1) + ' Mbps';
  document.getElementById('latency').textContent = (Math.random() * 80 + 5).toFixed(0) + ' ms';
}, 1500);

// ========== SNAKE GAME ==========
const snakeBtn = document.getElementById('snakeBtn');
const snakeModal = document.getElementById('snakeGameModal');
const snakeClose = document.getElementById('snakeGameCloseBtn');
const snakeWindow = document.getElementById('snakeGameWindow');
const snakeHandle = document.getElementById('snakeDragHandle');
const snakeCanvas = document.getElementById('snakeCanvas');
const ctx = snakeCanvas.getContext('2d');
const scoreSpan = document.getElementById('snakeScore');

let snake, food, direction, nextDirection, score, gameInterval, gameRunning;
const gridSize = 20;
const tileCount = snakeCanvas.width / gridSize;

function initSnake() {
  snake = [{x: 10, y: 10}];
  direction = {x: 1, y: 0}; nextDirection = {x: 1, y: 0};
  score = 0; gameRunning = true;
  placeFood(); updateScore();
}
function placeFood() {
  food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
  while (snake.some(p => p.x === food.x && p.y === food.y)) {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
  }
}
function updateScore() { scoreSpan.textContent = `Score: ${score}`; }
function draw() {
  ctx.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height);
  ctx.fillStyle = '#e74c3c';
  ctx.beginPath();
  ctx.arc(food.x * gridSize + gridSize/2, food.y * gridSize + gridSize/2, gridSize/2 - 2, 0, 2*Math.PI);
  ctx.fill();
  snake.forEach((p, i) => {
    ctx.fillStyle = i === 0 ? '#2ecc71' : '#27ae60';
    ctx.fillRect(p.x * gridSize, p.y * gridSize, gridSize - 2, gridSize - 2);
  });
}
function moveSnake() {
  direction = nextDirection;
  const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
  if (head.x < 0) head.x = tileCount - 1;
  if (head.x >= tileCount) head.x = 0;
  if (head.y < 0) head.y = tileCount - 1;
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
  ctx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
  ctx.fillStyle = 'white';
  ctx.font = '20px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Game Over', snakeCanvas.width/2, snakeCanvas.height/2);
}
function gameLoop() { if (!gameRunning) return; moveSnake(); draw(); }
function startSnakeGame() { if (gameRunning) return; initSnake(); gameInterval = setInterval(gameLoop, 100); }
function stopSnakeGame() { gameRunning = false; clearInterval(gameInterval); }

document.addEventListener('keydown', (e) => {
  if (!gameRunning) return;
  const key = e.key.toLowerCase();
  if (['arrowup','w'].includes(key) && direction.y === 0) nextDirection = {x:0, y:-1};
  if (['arrowdown','s'].includes(key) && direction.y === 0) nextDirection = {x:0, y:1};
  if (['arrowleft','a'].includes(key) && direction.x === 0) nextDirection = {x:-1, y:0};
  if (['arrowright','d'].includes(key) && direction.x === 0) nextDirection = {x:1, y:0};
});
let touchStartX, touchStartY;
snakeCanvas.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; touchStartY = e.touches[0].clientY; });
snakeCanvas.addEventListener('touchend', (e) => {
  if (!touchStartX || !touchStartY) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0 && direction.x === 0) nextDirection = {x:1, y:0};
    else if (dx < 0 && direction.x === 0) nextDirection = {x:-1, y:0};
  } else {
    if (dy > 0 && direction.y === 0) nextDirection = {x:0, y:1};
    else if (dy < 0 && direction.y === 0) nextDirection = {x:0, y:-1};
  }
  touchStartX = null; touchStartY = null;
});

snakeBtn.addEventListener('click', () => { snakeModal.classList.add('active'); startSnakeGame(); });
function closeSnake() { snakeModal.classList.remove('active'); stopSnakeGame(); }
snakeClose.addEventListener('click', closeSnake);
snakeModal.addEventListener('click', (e) => { if (e.target === snakeModal) closeSnake(); });

const isMobile = window.matchMedia('(pointer: coarse)').matches;
if (!isMobile) {
  let offX, offY, dragging = false;
  snakeHandle.addEventListener('mousedown', (e) => {
    dragging = true;
    const rect = snakeWindow.getBoundingClientRect();
    offX = e.clientX - rect.left; offY = e.clientY - rect.top;
    snakeWindow.style.transition = 'none';
  });
  document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    snakeWindow.style.left = e.clientX - offX + 'px';
    snakeWindow.style.top = e.clientY - offY + 'px';
  });
  document.addEventListener('mouseup', () => { dragging = false; snakeWindow.style.transition = ''; });
}

// ========== MUSIC PLAYER (YouTube audio) ==========
const playlist = [
  { id: 'JGwWNGJdvx8', title: 'Shape of You', artist: 'Ed Sheeran' },
  { id: 'fKopy74weus', title: 'Blinding Lights', artist: 'The Weeknd' },
  { id: '9bZkp7q19f0', title: 'Gangnam Style', artist: 'PSY' },
  { id: 'kJQP7kiw5Fk', title: 'Despacito', artist: 'Luis Fonsi' },
  { id: 'RgKAFK5djSk', title: 'See You Again', artist: 'Wiz Khalifa' }
];
let currentTrackIndex = 0;
let player = null;
let isPlaying = false;
let progressInterval;

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

function loadTrack(index) {
  currentTrackIndex = index;
  const track = playlist[index];
  songTitleEl.textContent = track.title;
  songArtistEl.textContent = track.artist;
  if (player && player.loadVideoById) {
    player.loadVideoById(track.id);
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
function initYouTubePlayer() {
  if (player || typeof YT === 'undefined' || !YT.Player) return;
  player = new YT.Player('ytPlayer', {
    height: '0', width: '0',
    videoId: playlist[0].id,
    playerVars: { autoplay: 0, controls: 0, disablekb: 1, fs: 0, iv_load_policy: 3, modestbranding: 1, rel: 0 },
    events: {
      onReady: () => { setVolume(); updateDuration(); progressInterval = setInterval(updateProgress, 500); },
      onStateChange: (e) => {
        if (e.data === YT.PlayerState.PLAYING) { isPlaying = true; playBtn.innerHTML = '<i class="fas fa-pause"></i>'; }
        else if (e.data === YT.PlayerState.PAUSED) { isPlaying = false; playBtn.innerHTML = '<i class="fas fa-play"></i>'; }
        else if (e.data === YT.PlayerState.ENDED) nextTrack();
      }
    }
  });
}
function setVolume() { if (player) player.setVolume(volumeBar.value); }
function updateProgress() {
  if (player && player.getCurrentTime && player.getDuration) {
    const cur = player.getCurrentTime();
    const dur = player.getDuration();
    if (dur) { progressBar.value = (cur / dur) * 100; currentTimeEl.textContent = fmt(cur); durationEl.textContent = fmt(dur); }
  }
}
function updateDuration() { if (player && player.getDuration) { const d = player.getDuration(); if (d) durationEl.textContent = fmt(d); } }
function seekTo(v) { if (player && player.getDuration) player.seekTo((v / 100) * player.getDuration(), true); }
function fmt(s) { const m = Math.floor(s / 60); const sec = Math.floor(s % 60); return m + ':' + (sec < 10 ? '0' : '') + sec; }
function prevTrack() { let idx = currentTrackIndex - 1; if (idx < 0) idx = playlist.length - 1; loadTrack(idx); if (isPlaying) setTimeout(() => player.playVideo(), 500); }
function nextTrack() { let idx = (currentTrackIndex + 1) % playlist.length; loadTrack(idx); if (isPlaying) setTimeout(() => player.playVideo(), 500); }

musicBtn.addEventListener('click', () => {
  musicModal.classList.add('active');
  loadTrack(0);
  if (!player && typeof YT !== 'undefined' && YT.Player) initYouTubePlayer();
});
musicCloseBtn.addEventListener('click', () => { musicModal.classList.remove('active'); });
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', prevTrack);
nextBtn.addEventListener('click', nextTrack);
progressBar.addEventListener('input', () => seekTo(progressBar.value));
volumeBar.addEventListener('input', setVolume);
if (typeof YT !== 'undefined' && YT.Player) initYouTubePlayer();
else window.onYouTubeIframeAPIReady = initYouTubePlayer;

// ========== CURSOR‑FOLLOWING BLOBS ==========
const blobsEls = document.querySelectorAll('.blob');
let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
if (isMobile) {
  window.addEventListener('deviceorientation', (e) => {
    if (e.gamma === null || e.beta === null) return;
    mouseX = (e.gamma + 90) / 180 * window.innerWidth;
    mouseY = (e.beta + 180) / 360 * window.innerHeight;
  });
}
function moveBlobs() {
  const arr = Array.from(blobsEls);
  arr.forEach((blob, i) => {
    const factor = (i + 1) * 0.1;
    const x = (mouseX - window.innerWidth / 2) * factor;
    const y = (mouseY - window.innerHeight / 2) * factor;
    blob.style.transform = `translate(${x}px, ${y}px)`;
  });
  requestAnimationFrame(moveBlobs);
}
moveBlobs();

// ========== 3D EARTH WITH ARCS & SRI LANKA MARKER ==========
function init3D() {
  if (typeof THREE === 'undefined') return;
  const canvas = document.getElementById('bgCanvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 35;

  const earthGroup = new THREE.Group();
  scene.add(earthGroup);

  // Earth sphere
  const geometry = new THREE.SphereGeometry(8, 64, 64);
  const textureLoader = new THREE.TextureLoader();
  const earthTexture = textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
  const material = new THREE.MeshPhongMaterial({ map: earthTexture, shininess: 5 });
  const earth = new THREE.Mesh(geometry, material);
  earthGroup.add(earth);

  // Atmosphere
  const atmosGeom = new THREE.SphereGeometry(8.15, 64, 64);
  const atmosMat = new THREE.MeshPhongMaterial({ color: 0x00aaff, transparent: true, opacity: 0.1, side: THREE.FrontSide });
  const atmosphere = new THREE.Mesh(atmosGeom, atmosMat);
  earthGroup.add(atmosphere);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x404070);
  scene.add(ambientLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 3, 5);
  scene.add(dirLight);

  // Sri Lanka marker (approximately 6.9° N, 79.9° E)
  const lat = 6.9 * (Math.PI / 180);
  const lon = 79.9 * (Math.PI / 180);
  const markerPos = new THREE.Vector3(
    -8 * Math.cos(lat) * Math.cos(lon),
    8 * Math.sin(lat),
    8 * Math.cos(lat) * Math.sin(lon)
  );
  const markerGeom = new THREE.SphereGeometry(0.25, 16, 16);
  const markerMat = new THREE.MeshBasicMaterial({ color: 0xff3333 });
  const marker = new THREE.Mesh(markerGeom, markerMat);
  marker.position.copy(markerPos);
  earthGroup.add(marker);

  // Profile photo sprite at marker
  const spriteCanvas = document.createElement('canvas');
  spriteCanvas.width = 64; spriteCanvas.height = 64;
  const ctx = spriteCanvas.getContext('2d');
  const img = new Image();
  img.src = 'images/nadeeja-profile.jpg';
  img.onload = () => {
    ctx.beginPath();
    ctx.arc(32, 32, 30, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, 2, 2, 60, 60);
    const texture = new THREE.CanvasTexture(spriteCanvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(1.2, 1.2, 1);
    sprite.position.copy(markerPos.clone().multiplyScalar(1.1));
    earthGroup.add(sprite);
  };

  // Network traffic arcs (random destinations from/to Colombo)
  function latLonToPosition(latitude, longitude, radius = 8.2) {
    const phi = (90 - latitude) * (Math.PI / 180);
    const theta = longitude * (Math.PI / 180);
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }

  const arcPairs = [
    { from: [6.9, 79.9], to: [40.7, -74.0] },   // Colombo → New York
    { from: [6.9, 79.9], to: [51.5, -0.1] },    // Colombo → London
    { from: [6.9, 79.9], to: [35.7, 139.7] },   // Colombo → Tokyo
    { from: [6.9, 79.9], to: [-33.9, 151.2] },  // Colombo → Sydney
    { from: [6.9, 79.9], to: [55.8, 37.6] },    // Colombo → Moscow
    { from: [6.9, 79.9], to: [25.2, 55.3] },    // Colombo → Dubai
    { from: [6.9, 79.9], to: [1.3, 103.8] },    // Colombo → Singapore
    { from: [6.9, 79.9], to: [-23.5, -46.6] },  // Colombo → São Paulo
  ];

  const arcsGroup = new THREE.Group();
  earthGroup.add(arcsGroup);

  arcPairs.forEach((pair, i) => {
    const start = latLonToPosition(pair.from[0], pair.from[1]);
    const end = latLonToPosition(pair.to[0], pair.to[1]);
    const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(12);
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const points = curve.getPoints(50);
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    const hue = (i / arcPairs.length) * 0.9;
    const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
    const line = new THREE.Line(geom, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending }));
    arcsGroup.add(line);
  });

  // Rotate around X‑axis (vertical spin)
  function animate() {
    requestAnimationFrame(animate);
    earthGroup.rotation.x += 0.001;
    // Slight side tilt
    earthGroup.rotation.z += 0.0002;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// ========== START EVERYTHING ==========
window.addEventListener('load', () => {
  loadProjects();
  init3D();
});