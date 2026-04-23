// ========== CONFIGURATION ==========
const GEMINI_API_KEY = 'AIzaSyDgNDTqE5Su0DL4WeQTeo1hVjLRHKuuZVo'; // ✅ Your key

// ========== AOS Animation Init ==========
AOS.init({ duration: 800, once: true });

// ========== THEME TOGGLE ==========
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

// ========== LOAD LINKEDIN DATA ==========
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

// ========== AUTOMATIC ICON DETECTION (with Gemini AI) ==========

// Language → Devicon mapping
const LANGUAGE_ICON_MAP = {
  'JavaScript': 'devicon-javascript-plain',
  'Python': 'devicon-python-plain',
  'HTML': 'devicon-html5-plain',
  'CSS': 'devicon-css3-plain',
  'Java': 'devicon-java-plain',
  'C++': 'devicon-cplusplus-plain',
  'C#': 'devicon-csharp-plain',
  'PHP': 'devicon-php-plain',
  'Ruby': 'devicon-ruby-plain',
  'Go': 'devicon-go-plain',
  'Rust': 'devicon-rust-plain',
  'Swift': 'devicon-swift-plain',
  'Kotlin': 'devicon-kotlin-plain',
  'TypeScript': 'devicon-typescript-plain',
  'Dart': 'devicon-dart-plain',
  'Shell': 'devicon-bash-plain',
  'PowerShell': 'devicon-powershell-plain'
};

// Keyword → Font Awesome (fallback before AI)
const KEYWORD_MAP = {
    'network': 'fa-network-wired', 'dashboard': 'fa-chart-line', 'monitor': 'fa-eye',
    'catalogue': 'fa-book-open', 'catalog': 'fa-book', 'design': 'fa-paint-brush',
    'video': 'fa-video', 'film': 'fa-film', 'motion': 'fa-clapperboard',
    'graphic': 'fa-pen-nib', 'illustrator': 'fa-paintbrush', 'cad': 'fa-cube',
    '3d': 'fa-cubes', 'pattern': 'fa-ruler-combined', 'resilience': 'fa-shield-halved',
    'uptime': 'fa-server', 'security': 'fa-shield', 'firewall': 'fa-shield-virus',
    'api': 'fa-code', 'web': 'fa-globe', 'app': 'fa-mobile-screen',
    'mobile': 'fa-mobile-screen-button', 'social': 'fa-hashtag', 'instagram': 'fa-instagram',
    'youtube': 'fa-youtube', 'linkedin': 'fa-linkedin', 'github': 'fa-github',
    'drive': 'fa-google-drive', 'database': 'fa-database', 'sql': 'fa-database',
    'bot': 'fa-robot', 'chat': 'fa-comment', 'whatsapp': 'fa-whatsapp',
    'portfolio': 'fa-briefcase', 'drivethtu': 'fa-car', 'website': 'fa-globe',
    'secret': 'fa-lock', 'container': 'fa-box', 'ephemeral': 'fa-clock'
};

const DEFAULT_ICON = 'fa-code';

// Cache for AI suggestions (saved in localStorage)
let iconCache = JSON.parse(localStorage.getItem('iconCache')) || {};

async function getAIIconSuggestion(project) {
  const name = project.name || '';
  const description = project.description || '';
  const cacheKey = name.toLowerCase().trim();
  
  // Return cached if exists
  if (iconCache[cacheKey]) {
    return iconCache[cacheKey];
  }

  try {
    const prompt = `Suggest a single Font Awesome 6 icon name (without 'fa-' prefix) for a project named "${name}" with description "${description}". Return only the icon name, e.g., "diagram-project". If unsure, return "code".`;
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 20 }
      })
    });
    
    if (!response.ok) throw new Error('Gemini API error');
    
    const data = await response.json();
    let iconName = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'code';
    iconName = iconName.replace('fa-', '').replace(/[^a-z0-9-]/g, '');
    
    const finalIcon = 'fa-' + iconName;
    iconCache[cacheKey] = finalIcon;
    localStorage.setItem('iconCache', JSON.stringify(iconCache));
    return finalIcon;
  } catch (error) {
    console.warn('AI icon suggestion failed:', error);
    return DEFAULT_ICON;
  }
}

async function getIconForProject(project) {
  // 1. Manual override
  if (project.icon) return project.icon;

  // 2. Use language from GitHub API
  const language = project.language || (project.tags && project.tags[0]);
  if (language && LANGUAGE_ICON_MAP[language]) {
    return LANGUAGE_ICON_MAP[language];
  }

  // 3. Keyword matching
  const combined = (project.name + ' ' + (project.description || '')).toLowerCase();
  for (const [keyword, icon] of Object.entries(KEYWORD_MAP)) {
    if (combined.includes(keyword)) return icon;
  }

  // 4. Ask Gemini AI
  return await getAIIconSuggestion(project);
}

async function loadProjects() {
  const grid = document.getElementById('projectsGrid');
  grid.innerHTML = '<div class="loader">Analyzing projects & generating icons...</div>';
  
  let projects = [];
  
  // 1. Load manual projects from JSON
  try {
    const res = await fetch('data/projects.json');
    if (res.ok) {
      const jsonProjects = await res.json();
      projects = [...jsonProjects];
    }
  } catch (e) {
    console.warn('Could not load projects.json:', e);
  }
  
  // 2. Fetch GitHub repos with language data
  try {
    const ghRes = await fetch('https://api.github.com/users/barrylk/repos?sort=updated&per_page=6');
    if (ghRes.ok) {
      const repos = await ghRes.json();
      const repoPromises = repos.map(async repo => {
        let language = repo.language;
        return {
          name: repo.name,
          description: repo.description || 'GitHub Repository',
          tags: language ? [language] : [],
          language: language,
          links: { github: repo.html_url }
        };
      });
      const ghProjects = await Promise.all(repoPromises);
      projects = [...projects, ...ghProjects];
    }
  } catch (e) {
    console.warn('GitHub fetch failed:', e);
  }
  
  // Fallback if still no projects
  if (projects.length === 0) {
    projects = [{
      name: 'Network Resilience Dashboard',
      description: 'Real-time monitoring for FIBC Lanka manufacturing network.',
      tags: ['Python'],
      language: 'Python',
      links: { github: '#' }
    }, {
      name: 'FIBC Product Catalogue 2025',
      description: 'Designed full B2B catalogue, saved LKR 200k+',
      tags: ['Design'],
      links: { drive: '#' }
    }];
  }
  
  // Load Devicon CSS dynamically
  if (!document.querySelector('link[href*="devicon"]')) {
    const deviconLink = document.createElement('link');
    deviconLink.rel = 'stylesheet';
    deviconLink.href = 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.15.1/devicon.min.css';
    document.head.appendChild(deviconLink);
  }
  
  // Get icons (some may be async AI calls)
  const iconPromises = projects.map(async proj => {
    proj.icon = await getIconForProject(proj);
    return proj;
  });
  
  const projectsWithIcons = await Promise.all(iconPromises);
  
  // Render
  grid.innerHTML = projectsWithIcons.map((proj, i) => {
    const iconClass = proj.icon;
    const isDevicon = iconClass.startsWith('devicon-');
    const iconHtml = isDevicon 
      ? `<i class="${iconClass}"></i>` 
      : `<i class="fas ${iconClass}"></i>`;
    
    return `
      <div class="project-card glass" data-aos="zoom-in" data-aos-delay="${i*50}" onclick='openModal(${JSON.stringify(proj).replace(/'/g, "&apos;")})'>
        <div class="project-icon">${iconHtml}</div>
        <h3 class="project-title">${proj.name}</h3>
        <p class="project-desc">${proj.description || ''}</p>
        ${proj.tags && proj.tags.length ? `<div class="project-tags">${proj.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}</div>` : ''}
      </div>
    `;
  }).join('');
  
  console.log('✅ Projects loaded with AI-powered icons!');
}

// ========== MODAL FUNCTIONS ==========
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
  linksDiv.innerHTML = linksHtml || '<p>No external links provided.</p>';
  document.getElementById('projectModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('projectModal').style.display = 'none';
}

window.onclick = function(event) {
  const modal = document.getElementById('projectModal');
  if (event.target === modal) closeModal();
};

// ========== START ==========
window.addEventListener('load', () => {
  loadProjects();
});