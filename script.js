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
let visitorTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone; // fallback
let clockInterval = null;

async function fetchGeoData() {
  // Try ipapi.co first
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

  // Fallback to ip-api.com
  try {
    const res = await fetch('https://ip-api.com/json/?fields=status,message,countryCode,timezone');
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

  // Total failure: show globe and use device timezone
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

// ========== LIGHT BEAM ==========
const beam = document.getElementById('lightBeam');
const isMobile = window.matchMedia('(pointer: coarse)').matches;

function moveBeam(xPercent, yPercent) {
  beam.style.transform = `translate(${xPercent - 50}%, ${yPercent - 50}%)`;
}

if (isMobile) {
  window.addEventListener('deviceorientation', (e) => {
    if (e.gamma === null || e.beta === null) return;
    const x = (e.gamma + 90) / 180 * 100;
    const y = (e.beta + 180) / 360 * 100;
    moveBeam(x, y);
  });
} else {
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    moveBeam(x, y);
  });
}

// ========== EASTER EGG: 999 Meme Found ==========
const memeOverlay = document.getElementById('memeOverlay');
const memeCountdownEl = document.getElementById('memeCountdown');
let shakeActive = false;
const SHAKE_DURATION = 2000;

function triggerMeme() {
  if (memeOverlay.classList.contains('active')) return;
  memeOverlay.classList.add('active');
  let count = 12;
  memeCountdownEl.textContent = count;
  const interval = setInterval(() => {
    count--;
    memeCountdownEl.textContent = count;
    if (count <= 0) {
      clearInterval(interval);
      location.reload();
    }
  }, 1000);
}

if (isMobile) {
  window.addEventListener('devicemotion', (e) => {
    const acc = e.accelerationIncludingGravity;
    if (!acc) return;
    const magnitude = Math.sqrt(acc.x*acc.x + acc.y*acc.y + acc.z*acc.z);
    if (magnitude > 15) {
      if (!shakeActive) {
        shakeActive = true;
        setTimeout(() => {
          if (shakeActive) triggerMeme();
        }, SHAKE_DURATION);
      }
    } else {
      shakeActive = false;
    }
  });
} else {
  let fastMouseTimer = null;
  let fastMouseStart = 0;
  const SPEED_THRESHOLD = 300;
  let lastMouse = { x:0, y:0, time: Date.now() };

  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    const dt = (now - lastMouse.time) / 1000;
    if (dt === 0) return;
    const dx = e.clientX - lastMouse.x;
    const dy = e.clientY - lastMouse.y;
    const speed = Math.sqrt(dx*dx + dy*dy) / dt;
    lastMouse = { x: e.clientX, y: e.clientY, time: now };

    if (speed > SPEED_THRESHOLD) {
      if (!fastMouseStart) {
        fastMouseStart = now;
        fastMouseTimer = setTimeout(() => {
          triggerMeme();
          fastMouseStart = 0;
        }, SHAKE_DURATION);
      }
    } else {
      fastMouseStart = 0;
      if (fastMouseTimer) {
        clearTimeout(fastMouseTimer);
        fastMouseTimer = null;
      }
    }
  });
}

// Parallax shapes (desktop only)
document.addEventListener('mousemove', (e) => {
  if (isMobile) return;
  const x = (e.clientX / window.innerWidth - 0.5) * 14;
  const y = (e.clientY / window.innerHeight - 0.5) * 14;
  document.querySelectorAll('.shape').forEach((s, i) => {
    const speed = (i+1)*0.4;
    s.style.transform = `translate(${x*speed}px, ${y*speed}px)`;
  });
});

// Start projects
window.addEventListener('load', () => loadProjects());
