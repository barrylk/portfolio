// ========== AOS ==========
AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true });

// ========== LOADER ==========
window.addEventListener('load', () => document.body.classList.add('loaded'));

// ========== THEME ==========
const body = document.body;
const toggleBtn = document.getElementById('themeToggleBtnSmall');
const toggleIcon = document.getElementById('toggleIconSmall');
let manualMode = false, userOverride = localStorage.getItem('themeOverride');

function updateThemeUI(dark) {
  if (dark) {
    body.classList.add('dark');
    toggleIcon.className = 'fas fa-sun';
  } else {
    body.classList.remove('dark');
    toggleIcon.className = 'fas fa-moon';
  }
}
function isNight() { const h = new Date().getHours(); return h < 6 || h >= 18; }
function applyTheme() {
  const dark = manualMode ? userOverride === 'dark' : isNight();
  updateThemeUI(dark);
}
toggleBtn.addEventListener('click', () => {
  manualMode = true;
  userOverride = body.classList.contains('dark') ? 'light' : 'dark';
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

// ========== VISITOR FLAG & TIME (IP‑based) ==========
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

// ========== EXPERIENCE ==========
const expData = [
  { period:'2024 – Present', title:'IT Manager', company:'FIBC Lanka Pvt Ltd', desc:'Network uptime, graphic design, social media.' },
  { period:'2021 – 2024', title:'CAD Designer', company:'Brandix Apparel', desc:'3D patterns, Gerber/Lectra.' },
  { period:'2020 – 2021', title:'Network Engineer Intern', company:'Dialog Axiata', desc:'ISP networking, fiber.' }
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
  { cat:'Network & SysAdmin', items:[{n:'TCP/IP & DNS',p:90},{n:'Windows Server',p:85},{n:'Fortinet',p:80},{n:'VLAN',p:88}] },
  { cat:'Design', items:[{n:'Illustrator',p:92},{n:'Photoshop',p:88},{n:'InDesign',p:85},{n:'CorelDRAW',p:90}] },
  { cat:'Video', items:[{n:'Premiere Pro',p:85},{n:'After Effects',p:75},{n:'DaVinci',p:80},{n:'Social Media',p:90}] }
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

// ========== LINKEDIN ==========
fetch('data/linkedin.json')
  .then(r => r.json()).then(d => {
    document.getElementById('linkedinHeadline').textContent = d.headline || 'IT Manager at FIBC Lanka';
  }).catch(() => document.getElementById('linkedinHeadline').textContent = 'IT Manager at FIBC Lanka');

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
  if (p.links?.github) links += `<a href="${p.links.github}" target="_blank" class="cta-btn">GitHub</a>`;
  if (p.links?.drive) links += `<a href="${p.links.drive}" target="_blank" class="cta-btn">Drive</a>`;
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

// ========== LIGHT BEAM & PARALLAX ==========
const beam = document.getElementById('lightBeam');
const isMobile = window.matchMedia('(pointer: coarse)').matches;

function moveBeam(xPercent, yPercent) {
  beam.style.transform = `translate(${xPercent - 50}%, ${yPercent - 50}%)`;
}
function moveShapesAndDevices(dx, dy) {
  document.querySelectorAll('.shape').forEach((s, i) => {
    const speed = (i+1)*0.4;
    s.style.transform = `translate(${dx*speed}px, ${dy*speed}px)`;
  });
  document.querySelectorAll('.floating-device').forEach((d, i) => {
    const speed = (i+2)*0.3;
    d.style.transform = `translate(${dx*speed}px, ${dy*speed}px)`;
  });
}

if (isMobile) {
  window.addEventListener('deviceorientation', (e) => {
    if (e.gamma === null || e.beta === null) return;
    const x = (e.gamma + 90) / 180 * 100;
    const y = (e.beta + 180) / 360 * 100;
    moveBeam(x, y);
    const dx = (x - 50) * 0.3;
    const dy = (y - 50) * 0.3;
    moveShapesAndDevices(dx, dy);
  });
} else {
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    moveBeam(x, y);
    const dx = (e.clientX / window.innerWidth - 0.5) * 14;
    const dy = (e.clientY / window.innerHeight - 0.5) * 14;
    moveShapesAndDevices(dx, dy);
  });
}

// ========== 🏏 CRICKET MINI-GAME ==========
const canvas = document.getElementById('cricketCanvas');
const ctx = canvas.getContext('2d');
const cricketBtn = document.getElementById('cricketBtn');
let gameActive = false;
let gameInterval;
let score = 0;
let balls = [];

// Game constants
const BALL_RADIUS = 15;
const BAT_WIDTH = 120;
const BAT_HEIGHT = 20;
let batX = 0;
const GAME_WIDTH = canvas.width;
const GAME_HEIGHT = canvas.height;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  batX = canvas.width / 2 - BAT_WIDTH / 2;
}
window.addEventListener('resize', resizeCanvas);

function initGame() {
  score = 0;
  balls = [];
  // Spawn balls gradually
  spawnBall();
  gameActive = true;
  canvas.style.display = 'block';
  cricketBtn.style.display = 'none'; // hide button while playing
  resizeCanvas();
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(updateGame, 16);
}

function spawnBall() {
  // Random position from top, or left side
  const fromLeft = Math.random() < 0.5;
  let x, y, dx, dy;
  if (fromLeft) {
    x = -BALL_RADIUS;
    y = Math.random() * canvas.height * 0.6 + canvas.height * 0.2; // middle area
    dx = (Math.random() * 4 + 2);
    dy = (Math.random() - 0.5) * 3;
  } else {
    x = canvas.width + BALL_RADIUS;
    y = Math.random() * canvas.height * 0.6 + canvas.height * 0.2;
    dx = -(Math.random() * 4 + 2);
    dy = (Math.random() - 0.5) * 3;
  }
  balls.push({ x, y, dx, dy });
}

function updateGame() {
  if (!gameActive) return;
  // Move balls
  for (let i = balls.length - 1; i >= 0; i--) {
    const b = balls[i];
    b.x += b.dx;
    b.y += b.dy;
    // Boundary removal
    if (b.x < -BALL_RADIUS || b.x > canvas.width + BALL_RADIUS ||
        b.y < -BALL_RADIUS || b.y > canvas.height + BALL_RADIUS) {
      balls.splice(i, 1);
    }
  }
  // Spawn new balls occasionally
  if (Math.random() < 0.02) {
    spawnBall();
  }
  // Collision detection with bat (if mouse pressed?)
  // We'll handle click/tap separately in event listener
  drawGame();
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw pitch (green gradient)
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#2d5a27');
  grad.addColorStop(0.5, '#4caf50');
  grad.addColorStop(1, '#2d5a27');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Pitch markings
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 10]);
  ctx.beginPath();
  ctx.moveTo(0, canvas.height * 0.75);
  ctx.lineTo(canvas.width, canvas.height * 0.75);
  ctx.stroke();
  ctx.setLineDash([]);
  // Batsman area
  ctx.fillStyle = '#8d6e63';
  ctx.fillRect(canvas.width/2 - 50, canvas.height * 0.75 - 10, 100, 20);
  // Draw balls
  balls.forEach(b => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = '#f44336';
    ctx.fill();
    ctx.strokeStyle = '#b71c1c';
    ctx.lineWidth = 2;
    ctx.stroke();
    // seam
    ctx.beginPath();
    ctx.moveTo(b.x - BALL_RADIUS/2, b.y - BALL_RADIUS/2);
    ctx.lineTo(b.x + BALL_RADIUS/2, b.y + BALL_RADIUS/2);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.stroke();
  });
  // Bat (moves with mouse/touch)
  ctx.fillStyle = '#d4a373';
  ctx.fillRect(batX, canvas.height * 0.75 - BAT_HEIGHT, BAT_WIDTH, BAT_HEIGHT);
  ctx.fillStyle = '#a97c50';
  ctx.fillRect(batX + 10, canvas.height * 0.75 - BAT_HEIGHT - 5, 10, 5);
  // Score
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 2rem Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`Score: ${score}`, canvas.width / 2, 50);
  // Instructions
  ctx.font = '1rem Inter, sans-serif';
  ctx.fillText('Click or tap to hit the ball', canvas.width/2, canvas.height - 30);
}

// Hit detection
function attemptHit(x, y) {
  if (!gameActive) return;
  for (let i = balls.length - 1; i >= 0; i--) {
    const b = balls[i];
    // Check if ball is near bat
    const batY = canvas.height * 0.75 - BAT_HEIGHT;
    if (b.y + BALL_RADIUS > batY && b.y - BALL_RADIUS < batY + BAT_HEIGHT &&
        b.x + BALL_RADIUS > batX && b.x - BALL_RADIUS < batX + BAT_WIDTH) {
      // Hit! Increase score, remove ball, spawn new one
      score += Math.floor(Math.random() * 6) + 1;
      balls.splice(i, 1);
      spawnBall();
      return;
    }
  }
}

// Mouse/Touch handlers
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  attemptHit(x, y);
});
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const x = e.touches[0].clientX - rect.left;
  const y = e.touches[0].clientY - rect.top;
  attemptHit(x, y);
});
// Move bat with mouse
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  batX = e.clientX - rect.left - BAT_WIDTH/2;
  if (batX < 0) batX = 0;
  if (batX > canvas.width - BAT_WIDTH) batX = canvas.width - BAT_WIDTH;
});
canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  batX = e.touches[0].clientX - rect.left - BAT_WIDTH/2;
  if (batX < 0) batX = 0;
  if (batX > canvas.width - BAT_WIDTH) batX = canvas.width - BAT_WIDTH;
});

// Close game button: add a floating close button inside canvas
function closeGame() {
  gameActive = false;
  canvas.style.display = 'none';
  cricketBtn.style.display = 'flex';
  if (gameInterval) clearInterval(gameInterval);
}
// Add a close button on canvas
const closeBtn = document.createElement('button');
closeBtn.innerHTML = '✕ Close Game';
closeBtn.style.position = 'fixed';
closeBtn.style.top = '20px';
closeBtn.style.right = '20px';
closeBtn.style.zIndex = '301';
closeBtn.style.background = 'rgba(255,255,255,0.9)';
closeBtn.style.border = 'none';
closeBtn.style.padding = '10px 20px';
closeBtn.style.borderRadius = '30px';
closeBtn.style.fontFamily = 'Inter, sans-serif';
closeBtn.style.fontWeight = '600';
closeBtn.style.cursor = 'pointer';
closeBtn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
closeBtn.addEventListener('click', closeGame);
document.body.appendChild(closeBtn);
closeBtn.style.display = 'none'; // hidden by default

// Open game via button
cricketBtn.addEventListener('click', () => {
  initGame();
  closeBtn.style.display = 'block';
});
// Also hide close button when game closed
function closeGame() {
  gameActive = false;
  canvas.style.display = 'none';
  cricketBtn.style.display = 'flex';
  if (gameInterval) clearInterval(gameInterval);
  closeBtn.style.display = 'none';
}

// Start projects
window.addEventListener('load', () => loadProjects());