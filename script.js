// ========== AOS ==========
function initAOS() { if (typeof AOS !== 'undefined') AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true }); else setTimeout(initAOS, 200); }
initAOS();

// ========== THEME ==========
const bodyEl = document.body;
const themeToggle = document.getElementById('themeToggleCheckbox');
let manualMode = false, userOverride = localStorage.getItem('themeOverride');
function updateThemeUI(light) { if (light) { bodyEl.classList.add('light'); themeToggle.checked = true; } else { bodyEl.classList.remove('light'); themeToggle.checked = false; } }
function isDay() { const h = new Date().getHours(); return h >= 6 && h < 18; }
function applyTheme() { let light = manualMode ? userOverride === 'light' : isDay(); updateThemeUI(light); }
themeToggle.addEventListener('change', () => { manualMode = true; userOverride = themeToggle.checked ? 'light' : 'dark'; localStorage.setItem('themeOverride', userOverride); applyTheme(); });
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
function startClock() { if (clockInterval) clearInterval(clockInterval); updateClock(); clockInterval = setInterval(updateClock, 1000); }
function updateClock() { const now = new Date(); const options = { hour: '2-digit', minute: '2-digit', timeZone: visitorTimezone }; document.getElementById('liveClock').textContent = now.toLocaleTimeString('en-US', options); }
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
  tabItems.forEach(tab => { tab.classList.remove('active'); if (tab.getAttribute('href') === `#${current}`) tab.classList.add('active'); });
});

// ========== EXPERIENCE ==========
const expData = [
  { period:'Dec 2024 – Present', title:'IT Manager', company:'FIBC Lanka (Pvt) Ltd, Polonnaruwa', desc:'Managing IT operations, networks, servers, cloud, security, ERP (Tally Prime), HRM (SignHR), CCTV, and hardware/software support. Also creating bag artwork and social media content.' },
  { period:'Jul 2021 – Oct 2023', title:'Computer Aided Design Designer', company:'Brandix, Polonnaruwa', desc:'Designed apparel patterns using Lectra Modaris and AutoCAD, ensuring precision and efficiency in mass production.' }
];
const timeline = document.getElementById('experienceTimeline');
timeline.innerHTML = expData.map((e,i) => `...`).join('');  // same as previous, keep

// ========== SKILLS ==========
const skills = [ ... ]; // same as before
const skillsContainer = document.getElementById('skillsContainer');
skillsContainer.innerHTML = skills.map(c => `...`).join('');

// ========== EDUCATION ==========
const eduData = [ ... ]; // same
const eduTimeline = document.getElementById('educationTimeline');
eduTimeline.innerHTML = eduData.map((e,i) => `...`).join('');

// ========== LINKEDIN ==========
fetch('data/linkedin.json') ... // same as before

// ========== PROJECTS ==========
// ... (keep entire block, same as previous script) ...
async function loadProjects() { ... }

// ========== CONTACT FORM ==========
// ... same

// ========== NETWORK MONITOR SIMULATION ==========
setInterval(() => {
  document.getElementById('dlSpeed').textContent = (Math.random() * 50 + 10).toFixed(1) + ' Mbps';
  document.getElementById('ulSpeed').textContent = (Math.random() * 20 + 5).toFixed(1) + ' Mbps';
  document.getElementById('latency').textContent = (Math.random() * 80 + 5).toFixed(0) + ' ms';
}, 1500);

// ========== SNAKE GAME ==========
// ... full snake game code from previous final version ...

// ========== MUSIC PLAYER (YouTube) ==========
// ... full music player code from previous final version ...

// ========== CURSOR‑FOLLOWING BLOBS ==========
const blobsEls = document.querySelectorAll('.blob');
let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
const isMobile = window.matchMedia('(pointer: coarse)').matches;
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

// ========== 3D EARTH WITH ANIMATED TRAFFIC ==========
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
  scene.add(new THREE.AmbientLight(0x404070));
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 3, 5);
  scene.add(dirLight);

  // Sri Lanka marker
  const lat = 6.9 * (Math.PI / 180), lon = 79.9 * (Math.PI / 180);
  const markerPos = new THREE.Vector3(-8 * Math.cos(lat) * Math.cos(lon), 8 * Math.sin(lat), 8 * Math.cos(lat) * Math.sin(lon));
  const markerGeom = new THREE.SphereGeometry(0.25, 16, 16);
  const marker = new THREE.Mesh(markerGeom, new THREE.MeshBasicMaterial({ color: 0xff3333 }));
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

  // Network traffic arcs (Colombo to major cities)
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

  // Store arcs and traffic dots
  const trafficDots = [];
  arcPairs.forEach((pair, i) => {
    const startPos = latLonToPosition(pair.from[0], pair.from[1], 8.2);
    const endPos = latLonToPosition(pair.to[0], pair.to[1], 8.2);
    const mid = startPos.clone().add(endPos).multiplyScalar(0.5).normalize().multiplyScalar(12);
    const curve = new THREE.QuadraticBezierCurve3(startPos, mid, endPos);
    const points = curve.getPoints(50);
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    const hue = (i / arcPairs.length) * 0.9;
    const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
    const line = new THREE.Line(geom, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending }));
    arcsGroup.add(line);

    // Create traffic dot(s) for this arc
    const dotCount = (i === 0 || i === 1) ? 3 : 1; // more dots for first two arcs (Colombo traffic)
    for (let j = 0; j < dotCount; j++) {
      const dotGeom = new THREE.SphereGeometry(0.12, 8, 8);
      const dotMat = new THREE.MeshBasicMaterial({ color: new THREE.Color().setHSL(hue, 1, 0.7), blending: THREE.AdditiveBlending });
      const dot = new THREE.Mesh(dotGeom, dotMat);
      dot.userData = {
        curve,
        t: Math.random(),
        speed: 0.002 + Math.random() * 0.004,
        direction: Math.random() > 0.5 ? 1 : -1
      };
      arcsGroup.add(dot);
      trafficDots.push(dot);
    }
  });

  // Helper function
  function latLonToPosition(latitude, longitude, radius = 8.2) {
    const phi = (90 - latitude) * (Math.PI / 180);
    const theta = longitude * (Math.PI / 180);
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }

  function animate() {
    requestAnimationFrame(animate);

    // Rotate Earth
    earthGroup.rotation.x += 0.001;
    earthGroup.rotation.z += 0.0002;

    // Animate traffic dots along curves
    trafficDots.forEach(dot => {
      let t = dot.userData.t + dot.userData.speed * dot.userData.direction;
      if (t > 1 || t < 0) {
        dot.userData.direction *= -1;
        t = Math.max(0, Math.min(1, t));
      }
      dot.userData.t = t;
      const point = dot.userData.curve.getPointAt(t);
      dot.position.copy(point);
    });

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