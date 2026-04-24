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

// ========== VISITOR FLAG & TIME (IP-based) ==========
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

// ========== EXPERIENCE (from CV) ==========
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

// ========== SKILLS (from CV) ==========
const skills = [
  { cat:'IT & ERP', items:[
    {n:'Tally ERP / SignHR',p:85},
    {n:'Network & Security',p:90},
    {n:'Cloud & Server Admin',p:80},
    {n:'CCTV & Hardware Support',p:88}
  ]},
  { cat:'Graphic & CAD Design', items:[
    {n:'Adobe Photoshop',p:92},
    {n:'Modaris',p:85},
    {n:'AutoCAD',p:80},
    {n:'CorelDRAW',p:88}
  ]}
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

// ========== EDUCATION (from CV) ==========
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

// ========== CRICKET GAME MODAL (2048-Cricket via iframe) ==========
const cricketBtn = document.getElementById('cricketBtn');
const gameModal = document.getElementById('gameModal');
const gameCloseBtn = document.getElementById('gameCloseBtn');
const gameWindow = document.getElementById('gameWindow');
const gameDragHandle = document.getElementById('gameDragHandle');

cricketBtn.addEventListener('click', () => {
  gameModal.classList.add('active');
});
function closeCricket() {
  gameModal.classList.remove('active');
}
gameCloseBtn.addEventListener('click', closeCricket);
gameModal.addEventListener('click', (e) => {
  if (e.target === gameModal) closeCricket();
});

// Draggable on desktop only
if (!isMobile) {
  let offsetX, offsetY, isDragging = false;
  gameDragHandle.addEventListener('mousedown', (e) => {
    isDragging = true;
    const rect = gameWindow.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    gameWindow.style.transition = 'none';
  });
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    gameWindow.style.left = e.clientX - offsetX + 'px';
    gameWindow.style.top = e.clientY - offsetY + 'px';
  });
  document.addEventListener('mouseup', () => {
    isDragging = false;
    gameWindow.style.transition = '';
  });
}

// Start projects
window.addEventListener('load', () => loadProjects());