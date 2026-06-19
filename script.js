/* ===== CITY BUILDER ===== */
function buildCity() {
  const city = document.getElementById('city');
  const buildings = [
    { w: 60, h: 180, cols: 3, rows: 8 },
    { w: 80, h: 220, cols: 4, rows: 10 },
    { w: 50, h: 140, cols: 3, rows: 6 },
    { w: 100, h: 260, cols: 5, rows: 12, ant: true },
    { w: 70, h: 190, cols: 3, rows: 9 },
    { w: 55, h: 160, cols: 2, rows: 7 },
    { w: 90, h: 240, cols: 4, rows: 11, ant: true },
    { w: 65, h: 170, cols: 3, rows: 8 },
    { w: 75, h: 200, cols: 4, rows: 9 },
    { w: 50, h: 150, cols: 2, rows: 7 },
    { w: 85, h: 230, cols: 4, rows: 10, ant: true },
    { w: 60, h: 180, cols: 3, rows: 8 },
    { w: 40, h: 120, cols: 2, rows: 5 },
    { w: 95, h: 250, cols: 5, rows: 12 },
  ];

  buildings.forEach(b => {
    const bEl = document.createElement('div');
    bEl.className = 'building';
    bEl.style.cssText = `width:${b.w}px; height:${b.h}px; background:var(--city-wall);`;

    if (b.ant) {
      const ant = document.createElement('div');
      ant.className = 'antenna';
      bEl.appendChild(ant);
    }

    const winGrid = document.createElement('div');
    winGrid.className = 'windows';
    winGrid.style.cssText = `grid-template-columns: repeat(${b.cols}, 1fr); grid-template-rows: repeat(${b.rows}, 1fr);`;

    for (let i = 0; i < b.cols * b.rows; i++) {
      const win = document.createElement('div');
      win.className = 'win' + (Math.random() > 0.5 ? ' lit' : '');
      
      // Mengubah lampu gedung menjadi statis (mematikan animasi berkedip)
      win.style.animation = 'none'; 
      
      winGrid.appendChild(win);
    }

    bEl.appendChild(winGrid);
    city.appendChild(bEl);
  });
}

/* ===== STARS BUILDER ===== */
function buildStars() {
  const starsEl = document.getElementById('stars');
  for (let i = 0; i < 180; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const size = Math.random() > 0.8 ? 4 : 2;
    s.style.cssText = `
      width:${size}px; height:${size}px;
      top:${Math.random() * 65}%;
      left:${Math.random() * 100}%;
    `; // Efek kedipan bintang sudah dibuat statis di sini
    starsEl.appendChild(s);
  }
}

/* ===== CLOUDS BUILDER ===== */
function buildClouds() {
  const cloudsEl = document.getElementById('clouds');
  const cloudShapes = [
    [[8,4],[16,8],[8,4]],
    [[12,6],[20,10],[12,6]],
    [[6,3],[14,7],[6,3]],
  ];

  for (let i = 0; i < 5; i++) {
    const cloud = document.createElement('div');
    cloud.className = 'cloud';
    const w = 80 + Math.random() * 120;
    const h = 30 + Math.random() * 20;
    cloud.style.cssText = `
      width:${w}px; height:${h}px;
      top:${5 + Math.random() * 30}%;
      left:${100 + Math.random() * 100}%;
      animation-duration: ${35 + Math.random() * 30}s;
      animation-delay: ${-(Math.random() * 40)}s;
      border-radius: 0;
      box-shadow: -${w*0.3}px 0 0 ${h*0.2}px white,
                  ${w*0.2}px ${h*0.1}px 0 ${h*0.15}px white,
                  ${w*0.1}px -${h*0.2}px 0 ${h*0.1}px white;
    `;
    cloudsEl.appendChild(cloud);
  }
}

/* ===== THEME TOGGLE ===== */
function initTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  setTheme(saved);
}

function setTheme(mode) {
  document.documentElement.setAttribute('data-theme', mode);
  const icon = document.getElementById('toggle-icon');
  const label = document.getElementById('toggle-label');
  if (mode === 'dark') {
    icon.textContent = '🌙';
    label.textContent = 'DARK MODE';
  } else {
    icon.textContent = '☀️';
    label.textContent = 'LIGHT MODE';
  }
  localStorage.setItem('theme', mode);
}

document.getElementById('theme-toggle').addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

/* ===== MODAL ===== */
function openPlaylist(num, title, genre, desc, embedUrl) {
  document.getElementById('modal-pl-title').textContent = `// PL-${num} — ${title}`;
  document.getElementById('modal-pl-desc').textContent = desc;
  document.getElementById('modal-title-text').textContent = `🎵 ${title}.mp3`;
  document.getElementById('spotify-iframe').src = embedUrl + '?utm_source=generator';
  document.getElementById('modal-overlay').classList.add('active');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('active');
  document.getElementById('spotify-iframe').src = '';
}

document.getElementById('modal-overlay').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

/* ===== DRAGGABLE MODAL ===== */
(function() {
  const win = document.getElementById('modal-window');
  const bar = document.getElementById('modal-title-bar');
  let dragging = false, ox = 0, oy = 0;

  bar.addEventListener('mousedown', e => {
    dragging = true;
    const r = win.getBoundingClientRect();
    ox = e.clientX - r.left;
    oy = e.clientY - r.top;
    win.style.position = 'fixed';
    win.style.margin = '0';
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    win.style.left = (e.clientX - ox) + 'px';
    win.style.top = (e.clientY - oy) + 'px';
  });

  document.addEventListener('mouseup', () => { dragging = false; });
})();

/* ===== DYNAMIC MOOD BUILDER ===== */
function updateMood() {
  const moodSpan = document.getElementById('current-mood');
  if (!moodSpan) return;

  const currentHour = new Date().getHours();
  let moodText = "";

  if (currentHour >= 0 && currentHour < 5) {
    moodText = "deep sleep (￣o￣) . z Z"; 
  } else if (currentHour >= 5 && currentHour < 8) {
    moodText = "woke up (｡-_-｡)"; 
  } else if (currentHour >= 8 && currentHour < 12) {
    moodText = "IRL grinding (ง •̀_•́)ง"; 
  } else if (currentHour >= 12 && currentHour < 13) {
    moodText = "lunch break (っ˘ڡ˘ς)"; 
  } else if (currentHour >= 13 && currentHour < 17) {
    moodText = "chilling ( ¯꒳¯ )"; 
  } else if (currentHour >= 17 && currentHour < 20) {
    moodText = "dinner time (っˆڡˆς)"; 
  } else if (currentHour >= 20 && currentHour < 23) {
    moodText = "otaku time (☆ω☆)"; 
  } else {
    moodText = "doom scrolling (눈_눈)"; 
  }

  moodSpan.textContent = moodText;
}

// ===== MASCOT INTERACTION =====
document.addEventListener('DOMContentLoaded', () => {
  const mascotImg = document.getElementById('mascot-img');
  const speechBubble = document.getElementById('speech-bubble');

  if (mascotImg && speechBubble) {
    mascotImg.addEventListener('click', () => {
      speechBubble.classList.add('show');
      setTimeout(() => {
        speechBubble.classList.remove('show');
      }, 3000);
    });
  }
});

/* ===== LAMPPOST BUILDER ===== */
function buildLampposts() {
  const container = document.getElementById('lampposts');
  const count = 6;

  for (let i = 0; i < count; i++) {
    const post = document.createElement('div');
    post.className = 'lamppost';
    
    const light = document.createElement('div');
    light.className = 'lamp-light';
    
    post.appendChild(light);
    container.appendChild(post);
  }
}

/* ===== INIT ===== */
buildCity();
buildStars();
buildClouds();
initTheme();
updateMood();
buildLampposts();