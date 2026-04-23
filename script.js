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

// Custom keyword → icon mapping (add more as you like)
const KEYWORD_MAP = {
    'network': 'fa-network-wired',
    'dashboard': 'fa-chart-line',
    'monitor': 'fa-eye',
    'catalogue': 'fa-book-open',
    'catalog': 'fa-book',
    'design': 'fa-paint-brush',
    'video': 'fa-video',
    'film': 'fa-film',
    'motion': 'fa-clapperboard',
    'graphic': 'fa-pen-nib',
    'illustrator': 'fa-paintbrush',
    'cad': 'fa-cube',
    '3d': 'fa-cubes',
    'pattern': 'fa-ruler-combined',
    'resilience': 'fa-shield-halved',
    'uptime': 'fa-server',
    'security': 'fa-shield',
    'firewall': 'fa-shield-virus',
    'api': 'fa-code',
    'web': 'fa-globe',
    'app': 'fa-mobile-screen',
    'mobile': 'fa-mobile-screen-button',
    'social': 'fa-hashtag',
    'instagram': 'fa-instagram',
    'youtube': 'fa-youtube',
    'linkedin': 'fa-linkedin',
    'github': 'fa-github',
    'drive': 'fa-google-drive',
    'database': 'fa-database',
    'sql': 'fa-database',
    'python': 'fa-python',
    'javascript': 'fa-js',
    'react': 'fa-react',
    'node': 'fa-node',
    'docker': 'fa-docker',
    'cloud': 'fa-cloud',
    'aws': 'fa-aws',
    'azure': 'fa-microsoft',
    'linux': 'fa-linux',
    'windows': 'fa-windows',
    'apple': 'fa-apple',
    'android': 'fa-android',
    'frontend': 'fa-laptop-code',
    'backend': 'fa-terminal',
    'fullstack': 'fa-layer-group',
    'devops': 'fa-infinity',
    'testing': 'fa-flask',
    'ci': 'fa-arrows-spin',
    'cd': 'fa-rocket',
    'automation': 'fa-robot',
    'bot': 'fa-robot',
    'ai': 'fa-brain',
    'machine': 'fa-microchip',
    'learning': 'fa-graduation-cap',
    'data': 'fa-chart-bar',
    'analytics': 'fa-chart-pie',
    'visualization': 'fa-chart-scatter',
    'report': 'fa-file-lines',
    'document': 'fa-file',
    'pdf': 'fa-file-pdf',
    'image': 'fa-image',
    'photo': 'fa-camera',
    'portrait': 'fa-user',
    'landscape': 'fa-mountain',
    'travel': 'fa-plane',
    'food': 'fa-utensils',
    'recipe': 'fa-book',
    'fitness': 'fa-heart-pulse',
    'health': 'fa-notes-medical',
    'medical': 'fa-hospital',
    'finance': 'fa-coins',
    'bank': 'fa-building-columns',
    'payment': 'fa-credit-card',
    'shopping': 'fa-cart-shopping',
    'ecommerce': 'fa-store',
    'store': 'fa-store',
    'shop': 'fa-shop',
    'cart': 'fa-cart-shopping',
    'product': 'fa-box',
    'inventory': 'fa-boxes-stacked',
    'warehouse': 'fa-warehouse',
    'logistics': 'fa-truck',
    'shipping': 'fa-ship',
    'delivery': 'fa-truck-fast',
    'tracking': 'fa-map-location-dot',
    'map': 'fa-map',
    'location': 'fa-location-dot',
    'address': 'fa-address-card',
    'contact': 'fa-envelope',
    'email': 'fa-envelope',
    'phone': 'fa-phone',
    'chat': 'fa-comment',
    'message': 'fa-message',
    'messaging': 'fa-comments',
    'forum': 'fa-users',
    'community': 'fa-people-group',
    'social media': 'fa-share-nodes',
    'share': 'fa-share',
    'like': 'fa-thumbs-up',
    'follow': 'fa-user-plus',
    'subscribe': 'fa-bell',
    'notification': 'fa-bell',
    'alert': 'fa-exclamation-triangle',
    'warning': 'fa-triangle-exclamation',
    'error': 'fa-circle-exclamation',
    'success': 'fa-circle-check',
    'check': 'fa-check',
    'close': 'fa-xmark',
    'delete': 'fa-trash',
    'edit': 'fa-pen',
    'add': 'fa-plus',
    'remove': 'fa-minus',
    'upload': 'fa-upload',
    'download': 'fa-download',
    'export': 'fa-file-export',
    'import': 'fa-file-import',
    'sync': 'fa-rotate',
    'refresh': 'fa-arrows-rotate',
    'reload': 'fa-rotate-right',
    'update': 'fa-pen-to-square',
    'upgrade': 'fa-arrow-up',
    'settings': 'fa-gear',
    'config': 'fa-sliders',
    'options': 'fa-ellipsis-vertical',
    'menu': 'fa-bars',
    'home': 'fa-house',
    'dashboard': 'fa-gauge-high',
    'profile': 'fa-id-card',
    'account': 'fa-circle-user',
    'user': 'fa-user',
    'users': 'fa-users',
    'team': 'fa-people-group',
    'group': 'fa-user-group',
    'role': 'fa-tag',
    'permission': 'fa-lock',
    'privacy': 'fa-user-secret',
    'terms': 'fa-file-signature',
    'policy': 'fa-file-contract',
    'legal': 'fa-gavel',
    'law': 'fa-scale-balanced',
    'help': 'fa-circle-question',
    'support': 'fa-headset',
    'info': 'fa-circle-info',
    'about': 'fa-address-card',
    'faq': 'fa-question',
    'guide': 'fa-book',
    'tutorial': 'fa-chalkboard-user',
    'course': 'fa-graduation-cap',
    'education': 'fa-school',
    'school': 'fa-school',
    'university': 'fa-building-columns',
    'college': 'fa-graduation-cap',
    'student': 'fa-user-graduate',
    'teacher': 'fa-chalkboard-user',
    'research': 'fa-flask',
    'science': 'fa-atom',
    'math': 'fa-calculator',
    'physics': 'fa-magnet',
    'chemistry': 'fa-flask',
    'biology': 'fa-dna',
    'engineering': 'fa-gears',
    'architecture': 'fa-draw-polygon',
    'construction': 'fa-helmet-safety',
    'manufacturing': 'fa-industry',
    'factory': 'fa-industry',
    'industrial': 'fa-industry',
    'fibc': 'fa-box',
    'bulk bag': 'fa-box',
    'packaging': 'fa-cube',
    'weaving': 'fa-vector-square',
    'loom': 'fa-vector-square',
    'extrusion': 'fa-arrow-right-long',
    'printing': 'fa-print',
    'sewing': 'fa-scissors',
    'textile': 'fa-shirt',
    'apparel': 'fa-shirt',
    'garment': 'fa-vest',
    'brandix': 'fa-industry',
    'dialog': 'fa-tower-cell',
    'isp': 'fa-tower-cell',
    'telecom': 'fa-tower-broadcast',
    'fiber': 'fa-fiber',
    'optic': 'fa-eye',
    'cable': 'fa-plug',
    'router': 'fa-wifi',
    'switch': 'fa-code-branch',
    'cisco': 'fa-network-wired',
    'juniper': 'fa-network-wired',
    'arista': 'fa-network-wired',
    'huawei': 'fa-network-wired',
    'mikrotik': 'fa-wifi',
    'ubiquiti': 'fa-wifi'
};

// Fallback icon when nothing matches
const DEFAULT_ICON = 'fa-diagram-project';

// Cache for AI suggestions (saved in localStorage)
let iconCache = JSON.parse(localStorage.getItem('iconCache')) || {};

/**
 * Finds the best Font Awesome icon for a project
 */
function getIconForProject(project) {
    const name = project.name || '';
    const description = project.description || '';
    const combined = (name + ' ' + description).toLowerCase();

    // If project already has a custom icon, use it
    if (project.icon) return project.icon;

    // 1. Try exact keyword matches (prioritize longer matches)
    const keywords = Object.keys(KEYWORD_MAP);
    // Sort by length (longer = more specific)
    keywords.sort((a, b) => b.length - a.length);
    
    for (const keyword of keywords) {
        if (combined.includes(keyword.toLowerCase())) {
            return KEYWORD_MAP[keyword];
        }
    }

    // 2. Check localStorage cache
    const cacheKey = name.toLowerCase().trim();
    if (iconCache[cacheKey]) {
        return iconCache[cacheKey];
    }

    // 3. If nothing found, ask AI (async)
    getAISuggestion(project).then(icon => {
        iconCache[cacheKey] = icon;
        localStorage.setItem('iconCache', JSON.stringify(iconCache));
        // Re-render just this project? We'll handle in loadProjects()
    });

    return DEFAULT_ICON;
}

/**
 * Ask free AI service for icon suggestion
 * Uses Google's Gemini API (free tier - just need a key)
 * If no API key, returns DEFAULT_ICON
 */
async function getAISuggestion(project) {
    const name = project.name || '';
    const description = project.description || '';
    
    // You can get a free Gemini API key from: https://aistudio.google.com/
    const GEMINI_API_KEY = 'AIzaSyDgNDTqE5Su0DL4WeQTeo1hVjLRHKuuZVo'; // 👈 Replace with your key
    
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'AIzaSyDgNDTqE5Su0DL4WeQTeo1hVjLRHKuuZVo') {
        console.log('No Gemini API key set - using keyword matching only');
        return DEFAULT_ICON;
    }

    try {
        const prompt = `Given a project named "${name}" with description "${description}", suggest a single Font Awesome 6 icon name (without the 'fa-' prefix). Return ONLY the icon name, e.g., "diagram-project". If unsure, return "diagram-project".`;
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.1,
                    maxOutputTokens: 20
                }
            })
        });
        
        const data = await response.json();
        let iconName = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || DEFAULT_ICON.replace('fa-', '');
        
        // Clean up the response
        iconName = iconName.replace('fa-', '').replace(/[^a-z0-9-]/g, '');
        
        return 'fa-' + iconName;
    } catch (error) {
        console.warn('AI icon suggestion failed:', error);
        return DEFAULT_ICON;
    }
}

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
    }));
    projects = [...projects, ...ghProjects];
  } catch (e) { console.warn('GitHub fetch failed'); }
  
  // Assign icons to all projects
  for (let proj of projects) {
    proj.icon = getIconForProject(proj);
  }
  
  // Render projects
  if (projects.length === 0) {
    grid.innerHTML = '<p>No projects to display yet.</p>';
    return;
  }
  
  grid.innerHTML = projects.map((proj, i) => `
    <div class="project-card glass" data-aos="zoom-in" data-aos-delay="${i*50}" onclick='openModal(${JSON.stringify(proj).replace(/'/g, "&apos;")})'>
      <div class="project-icon"><i class="fas ${proj.icon || DEFAULT_ICON}"></i></div>
      <h3 class="project-title">${proj.name}</h3>
      <p class="project-desc">${proj.description || ''}</p>
      ${proj.tags ? `<div class="project-tags">${proj.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}</div>` : ''}
    </div>
  `).join('');
}