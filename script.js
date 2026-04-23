// AOS Animation Init
AOS.init({ duration: 800, once: true });

// ========== THEME TOGGLE (Auto Day/Night) ==========
const body = document.body;
const modeIcon = document.getElementById('modeIcon');
const modeText = document.getElementById('modeText');
const toggleBtn = document.getElementById('themeToggleBtn');
const toggleIcon = document.getElementById('toggleIcon');
const toggleText = document.getElementById('toggleText');
let userOverride = localStorage.getItem('themeOverride');
let manualMode = userOverride !== null;

function updateUI(isDark) {
  if (isDark) {
    body.classList.add('dark');
    modeIcon.className = 'fas fa-moon';
    modeText.textContent = manualMode ? 'Manual · Dark' : 'Auto · Night';
    toggleIcon.className = 'fas fa-sun';
    toggleText.textContent = 'Switch to Light';
  } else {
    body.classList.remove('dark');
    modeIcon.className = 'fas fa-sun';
    modeText.textContent = manualMode ? 'Manual · Light' : 'Auto · Day';
    toggleIcon.className = 'fas fa-moon';
    toggleText.textContent = 'Switch to Dark';
  }
}

function isNightTime() {
  const hour = new Date().getHours();
  return hour < 6 || hour >= 18;
}

function applyTheme() {
  const useDark = manualMode ? userOverride === 'dark' : isNightTime();
  updateUI(useDark);
}

toggleBtn.addEventListener('click', () => {
  const currentIsDark = body.classList.contains('dark');
  userOverride = currentIsDark ? 'light' : 'dark';
  manualMode = true;
  localStorage.setItem('themeOverride', userOverride);
  applyTheme();
});

document.querySelector('.mode-indicator').addEventListener('click', () => {
  userOverride = null;
  manualMode = false;
  localStorage.removeItem('themeOverride');
  applyTheme();
});

applyTheme();
setInterval(() => { if (!manualMode) applyTheme(); }, 60000);

// ========== AUTO AGE ==========
function calculateAge(birthDate) {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}
const birthDate = new Date('2000-06-29');
document.getElementById('ageDisplay').textContent = calculateAge(birthDate);
document.getElementById('currentYear').textContent = new Date().getFullYear();

// ========== EXPERIENCE DATA ==========
const experienceData = [
  { period: '2024 – Present', title: 'IT Manager', company: 'FIBC Lanka Pvt Ltd, Polonnaruwa', desc: 'Industrial network uptime · In‑house graphic design · Social media content · Reduced external agency costs.' },
  { period: '2021 – 2024', title: 'CAD Designer', company: 'Brandix Apparel Solutions', desc: '3D simulation & pattern engineering · Gerber/Lectra precision.' },
  { period: '2020 – 2021 (8 mos)', title: 'Network Engineer Intern', company: 'Dialog Axiata, Kandy', desc: 'ISP-grade networking · VLANs, fiber troubleshooting · SLA support.' }
];

function renderExperience() {
  const container = document.getElementById('experienceTimeline');
  container.innerHTML = experienceData.map((item, i) => `
    <div class="timeline-item" data-aos="fade-up" data-aos-delay="${i*100}">
      <div class="timeline-dot"></div>
      <div class="timeline-content glass">
        <span class="timeline-date"><i class="far fa-calendar"></i> ${item.period}</span>
        <h3 class="timeline-title">${item.title}</h3>
        <div class="timeline-company">${item.company}</div>
        <p>${item.desc}</p>
      </div>
    </div>
  `).join('');
}
renderExperience();

// ========== SKILLS ==========
const skillsData = [
  { category: 'Network & SysAdmin', skills: [
    { name: 'TCP/IP & DNS', percent: 90 }, { name: 'Windows Server', percent: 85 },
    { name: 'Fortinet Firewall', percent: 80 }, { name: 'VLAN/Subnetting', percent: 88 }
  ]},
  { category: 'Design & Print', skills: [
    { name: 'Adobe Illustrator', percent: 92 }, { name: 'Photoshop', percent: 88 },
    { name: 'InDesign', percent: 85 }, { name: 'CorelDRAW', percent: 90 }
  ]},
  { category: 'Video & Motion', skills: [
    { name: 'Premiere Pro', percent: 85 }, { name: 'After Effects', percent: 75 },
    { name: 'DaVinci Resolve', percent: 80 }, { name: 'Social Media Content', percent: 90 }
  ]}
];

function renderSkills() {
  const container = document.getElementById('skillsContainer');
  container.innerHTML = skillsData.map(cat => `
    <div class="skill-category glass" data-aos="flip-left">
      <h4><i class="fas fa-code"></i> ${cat.category}</h4>
      ${cat.skills.map(skill => `
        <div class="skill-bar-item">
          <div class="skill-info"><span>${skill.name}</span><span>${skill.percent}%</span></div>
          <div class="skill-progress"><div class="skill-progress-fill" style="width:${skill.percent}%"></div></div>
        </div>
      `).join('')}
    </div>
  `).join('');
}
renderSkills();

// ========== LOAD LINKEDIN DATA (from local JSON) ==========
fetch('data/linkedin.json')
  .then(res => res.json())
  .then(data => {
    if (data.headline) {
      document.getElementById('linkedinHeadline').textContent = data.headline;
      document.getElementById('currentJobTitle').textContent = data.headline.split(' at ')[0] || 'IT Manager';
    }
  })
  .catch(() => {
    document.getElementById('linkedinHeadline').textContent = 'IT Manager at FIBC Lanka Pvt Ltd';
  });

// ========== PROJECTS: GitHub Repos + JSON Projects ==========
async function loadProjects() {
  const grid = document.getElementById('projectsGrid');
  grid.innerHTML = '<div class="loader">Loading projects...</div>';
  
  let projects = [];
  
  // 1. Load manual projects from JSON
  try {
    const res = await fetch('data/projects.json');
    const jsonProjects = await res.json();
    projects = [...jsonProjects];
  } catch (e) { console.log('No projects.json found, using GitHub only'); }
  
  // 2. Fetch GitHub repos for barrylk
  try {
    const ghRes = await fetch('https://api.github.com/users/barrylk/repos?sort=updated&per_page=6');
    const repos = await ghRes.json();
    const ghProjects = repos.map(repo => ({
      name: repo.name,
      description: repo.description || 'GitHub Repository',
      tags: [repo.language].filter(Boolean),
      links: { github: repo.html_url },
      icon: 'fab fa-github',
      image: null
    }));
    projects = [...projects, ...ghProjects];
  } catch (e) { console.warn('GitHub fetch failed'); }
  
  // Render projects
  if (projects.length === 0) {
    grid.innerHTML = '<p>No projects to display yet.</p>';
    return;
  }
  
  grid.innerHTML = projects.map((proj, i) => `
    <div class="project-card glass" data-aos="zoom-in" data-aos-delay="${i*50}" onclick='openModal(${JSON.stringify(proj).replace(/'/g, "&apos;")})'>
      <div class="project-icon"><i class="fas ${proj.icon || 'fa-diagram-project'}"></i></div>
      <h3 class="project-title">${proj.name}</h3>
      <p class="project-desc">${proj.description || ''}</p>
      ${proj.tags ? `<div class="project-tags">${proj.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}</div>` : ''}
    </div>
  `).join('');
}

function openModal(project) {
  document.getElementById('modalTitle').textContent = project.name;
  document.getElementById('modalDescription').textContent = project.description || '';
  const linksDiv = document.getElementById('modalLinks');
  let linksHtml = '';
  if (project.links) {
    if (project.links.github) linksHtml += `<a href="${project.links.github}" target="_blank" class="badge"><i class="fab fa-github"></i> GitHub</a>`;
    if (project.links.drive) linksHtml += `<a href="${project.links.drive}" target="_blank" class="badge"><i class="fab fa-google-drive"></i> Drive</a>`;
    if (project.links.live) linksHtml += `<a href="${project.links.live}" target="_blank" class="badge"><i class="fas fa-external-link"></i> Live Demo</a>`;
  }
  linksDiv.innerHTML = linksHtml;
  document.getElementById('projectModal').style.display = 'flex';
}

function closeModal() { document.getElementById('projectModal').style.display = 'none'; }
window.onclick = (e) => { if (e.target == document.getElementById('projectModal')) closeModal(); };

// Initialize projects after page load
window.addEventListener('load', loadProjects);