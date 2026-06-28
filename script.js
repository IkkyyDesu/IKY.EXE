/* ===== CITY BUILDER — Tokyo Edition ===== */
function buildCity() {
  const city = document.getElementById('city');

  /* Building data — deliberately varied widths + heights for Tokyo skyline feel */
  const buildings = [
    { w: 44, h: 110, cols: 2, rows: 5 },
    { w: 62, h: 160, cols: 3, rows: 7 },
    { w: 50, h: 130, cols: 2, rows: 6 },
    { w: 78, h: 200, cols: 4, rows: 9, ant: true },
    { w: 55, h: 150, cols: 3, rows: 7 },
    { w: 40, h: 100, cols: 2, rows: 4 },
    { w: 88, h: 230, cols: 4, rows: 11, ant: true, neon: '#E8002D' },
    { w: 60, h: 170, cols: 3, rows: 8 },
    { w: 70, h: 190, cols: 3, rows: 9 },
    /* ←— Tokyo Tower placeholder slot — inserted by JS — */
    { w: 52, h: 145, cols: 2, rows: 6 },
    { w: 95, h: 250, cols: 5, rows: 12, ant: true, neon: '#00C9B1' },
    { w: 64, h: 175, cols: 3, rows: 8 },
    { w: 48, h: 125, cols: 2, rows: 5 },
    { w: 82, h: 215, cols: 4, rows: 10, ant: true },
    { w: 56, h: 155, cols: 3, rows: 7, neon: '#F5A623' },
    { w: 44, h: 115, cols: 2, rows: 5 },
    { w: 72, h: 195, cols: 3, rows: 9 },
    { w: 90, h: 240, cols: 4, rows: 11, ant: true },
    { w: 58, h: 160, cols: 3, rows: 7 },
    { w: 46, h: 120, cols: 2, rows: 5 },
    { w: 80, h: 210, cols: 4, rows: 10, neon: '#C9B8FF' },
    { w: 62, h: 170, cols: 3, rows: 8 },
    { w: 50, h: 135, cols: 2, rows: 6 },
    { w: 76, h: 200, cols: 3, rows: 9, ant: true },
    { w: 42, h: 105, cols: 2, rows: 4 },
    { w: 88, h: 235, cols: 4, rows: 11, ant: true },
    { w: 54, h: 148, cols: 2, rows: 7 },
    { w: 66, h: 178, cols: 3, rows: 8 },
    { w: 100, h: 260, cols: 5, rows: 12, ant: true, neon: '#E8002D' },
    { w: 48, h: 128, cols: 2, rows: 6 },
  ];

  /* --- Helper: build one generic building --- */
  function makeBuilding(b) {
    const bEl = document.createElement('div');
    bEl.className = 'building';

    /* Two-tone building colours — alternate between city-wall variants */
    const useAlt = Math.random() > 0.6;
    bEl.style.cssText = `
      width:${b.w}px;
      height:${b.h}px;
      background: ${useAlt ? 'var(--city-wall2)' : 'var(--city-wall)'};
    `;

    /* Antenna */
    if (b.ant) {
      const ant = document.createElement('div');
      ant.className = 'antenna';
      bEl.appendChild(ant);
    }

    /* Neon strip */
    if (b.neon) {
      const strip = document.createElement('div');
      strip.className = 'neon-strip';
      strip.style.cssText = `top: ${20 + Math.random() * 40}%; background: ${b.neon};`;
      bEl.appendChild(strip);
    }

    /* Window grid */
    const winGrid = document.createElement('div');
    winGrid.className = 'windows';
    winGrid.style.cssText = `
      grid-template-columns: repeat(${b.cols}, 1fr);
      grid-template-rows: repeat(${b.rows}, 1fr);
    `;

    for (let i = 0; i < b.cols * b.rows; i++) {
      const win = document.createElement('div');
      const lit = Math.random() > 0.45;
      win.className = 'win' + (lit ? ' lit' : '');
      win.style.animation = 'none';

      /* Mix window colours: teal / gold / white */
      if (lit) {
        const r = Math.random();
        if (r < 0.5)       win.style.background = 'var(--city-window)';      /* teal */
        else if (r < 0.75) win.style.background = 'var(--city-window-lit)';  /* gold */
        else               win.style.background = '#FFE0CC';                   /* warm white */
      }
      winGrid.appendChild(win);
    }

    bEl.appendChild(winGrid);
    return bEl;
  }

  /* --- Tokyo Tower (pixel-art SVG) --- */
  function makeTokyoTower() {
    const wrapper = document.createElement('div');
    wrapper.className = 'tokyo-tower';
    /*
     * KEY FIX:
     * .city-layer uses align-items:flex-end so children align to bottom.
     * The SVG must have NO extra whitespace below its last drawn pixel —
     * we set height="340" and draw the ground bar at y=334 (last 6px),
     * so the tower bottom sits flush with the flex baseline.
     * align-self:flex-end + no margin-bottom = touches ground.
     */
    wrapper.style.cssText = `
      align-self: flex-end;
      margin: 0 6px;
      flex-shrink: 0;
      display: block;
      line-height: 0;
    `;

    wrapper.innerHTML = `
      <svg width="90" height="340" viewBox="0 0 90 340"
           xmlns="http://www.w3.org/2000/svg"
           style="display:block; image-rendering:pixelated; vertical-align:bottom;">

        <!-- === SPIRE === -->
        <rect x="42" y="0"  width="6" height="4"  fill="#FFE566"/>  <!-- beacon base -->
        <rect x="41" y="4"  width="8" height="28" fill="#E8002D"/>
        <rect x="42" y="32" width="6" height="18" fill="#E8002D"/>

        <!-- === UPPER NARROW SHAFT === -->
        <rect x="39" y="50" width="12" height="4"  fill="#F5A623"/>  <!-- collar -->
        <rect x="38" y="54" width="14" height="32" fill="#E8002D"/>

        <!-- === UPPER OBSERVATION DECK === -->
        <rect x="30" y="86" width="30" height="7"  fill="#F5A623"/>

        <!-- === UPPER TRUSS (two columns) === -->
        <rect x="33" y="93" width="9"  height="62" fill="#E8002D"/>  <!-- left col -->
        <rect x="48" y="93" width="9"  height="62" fill="#E8002D"/>  <!-- right col -->
        <!-- cross braces -->
        <rect x="33" y="103" width="24" height="4" fill="#F5A623"/>
        <rect x="33" y="122" width="24" height="4" fill="#F5A623"/>
        <rect x="33" y="141" width="24" height="4" fill="#F5A623"/>

        <!-- === MAIN OBSERVATION DECK === -->
        <rect x="24" y="155" width="42" height="8"  fill="#F5A623"/>

        <!-- === LOWER TRUSS (wider) === -->
        <rect x="26" y="163" width="38" height="4"  fill="#E8002D"/>  <!-- top cap -->
        <rect x="24" y="167" width="12" height="82" fill="#E8002D"/>   <!-- left col -->
        <rect x="54" y="167" width="12" height="82" fill="#E8002D"/>   <!-- right col -->
        <!-- cross braces -->
        <rect x="24" y="183" width="42" height="4"  fill="#F5A623"/>
        <rect x="24" y="208" width="42" height="4"  fill="#F5A623"/>
        <rect x="24" y="233" width="42" height="4"  fill="#F5A623"/>

        <!-- === BASE LEGS (spread outward) === -->
        <!-- left leg -->
        <rect x="12" y="249" width="24" height="6"  fill="#E8002D"/>
        <rect x="7"  y="255" width="29" height="6"  fill="#E8002D"/>
        <rect x="2"  y="261" width="34" height="6"  fill="#E8002D"/>
        <rect x="0"  y="267" width="34" height="7"  fill="#C0392B"/>
        <!-- right leg -->
        <rect x="54" y="249" width="24" height="6"  fill="#E8002D"/>
        <rect x="54" y="255" width="29" height="6"  fill="#E8002D"/>
        <rect x="54" y="261" width="34" height="6"  fill="#E8002D"/>
        <rect x="56" y="267" width="34" height="7"  fill="#C0392B"/>

        <!-- === BASE PLATFORM (touches ground — last pixels of viewBox) === -->
        <rect x="0"  y="274" width="90" height="8"  fill="#1B2A6B"/>
        <rect x="0"  y="282" width="90" height="6"  fill="#0F1A45"/>
        <!-- fill to very bottom so no gap -->
        <rect x="4"  y="288" width="82" height="52" fill="#0F1A45"/>

        <!-- === BEACON (blink) === -->
        <rect x="42" y="0" width="6" height="4" fill="#FFE566"
              style="animation:towerBlink 1.2s step-end infinite;"/>

        <!-- === DECK WINDOWS === -->
        <!-- upper deck -->
        <rect x="33" y="89" width="5" height="4" fill="#00C9B1" opacity="0.95"/>
        <rect x="41" y="89" width="5" height="4" fill="#00C9B1" opacity="0.95"/>
        <rect x="49" y="89" width="5" height="4" fill="#00C9B1" opacity="0.95"/>
        <!-- main deck -->
        <rect x="27" y="158" width="5" height="4" fill="#F5A623" opacity="0.95"/>
        <rect x="35" y="158" width="5" height="4" fill="#F5A623" opacity="0.95"/>
        <rect x="43" y="158" width="5" height="4" fill="#F5A623" opacity="0.95"/>
        <rect x="52" y="158" width="5" height="4" fill="#F5A623" opacity="0.95"/>

        <style>
          @keyframes towerBlink {
            0%,49%  { opacity: 1; }
            50%,100%{ opacity: 0; }
          }
        </style>
      </svg>
    `;
    return wrapper;
  }

  /* --- Assemble the skyline --- */
  /* insertTowerAt=18 puts the tower in the right-center area of the skyline,
     clear of the page panels which sit above the left/center portion */
  const insertTowerAt = 5;

  buildings.forEach((b, idx) => {
    city.appendChild(makeBuilding(b));
    if (idx === insertTowerAt) {
      city.appendChild(makeTokyoTower());
    }
  });
}

/* ===== STARS BUILDER ===== */
function buildStars() {
  const starsEl = document.getElementById('stars');
  for (let i = 0; i < 200; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const size = Math.random() > 0.82 ? 4 : 2;
    s.style.cssText = `
      width:${size}px; height:${size}px;
      top:${Math.random() * 65}%;
      left:${Math.random() * 100}%;
    `;
    starsEl.appendChild(s);
  }
}

/* ===== CLOUDS BUILDER ===== */
function buildClouds() {
  const cloudsEl = document.getElementById('clouds');
  for (let i = 0; i < 6; i++) {
    const cloud = document.createElement('div');
    cloud.className = 'cloud';
    const w = 80 + Math.random() * 120;
    const h = 28 + Math.random() * 18;
    cloud.style.cssText = `
      width:${w}px; height:${h}px;
      top:${5 + Math.random() * 28}%;
      left:${100 + Math.random() * 100}%;
      animation-duration: ${38 + Math.random() * 28}s;
      animation-delay: ${-(Math.random() * 45)}s;
      border-radius: 0;
      box-shadow:
        -${w*0.3}px 0 0 ${h*0.2}px white,
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
  const icon  = document.getElementById('toggle-icon');
  const label = document.getElementById('toggle-label');
  if (mode === 'dark') {
    icon.textContent  = '🌙';
    label.textContent = 'DARK MODE';
  } else {
    icon.textContent  = '☀️';
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
  document.getElementById('modal-pl-desc').textContent  = desc;
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
    win.style.top  = (e.clientY - oy) + 'px';
  });

  document.addEventListener('mouseup', () => { dragging = false; });
})();

/* ===== DYNAMIC MOOD ===== */
function updateMood() {
  const moodSpan = document.getElementById('current-mood');
  if (!moodSpan) return;
  const h = new Date().getHours();
  let moodText = '';
  if      (h >= 0  && h < 5)  moodText = 'deep sleep (￣o￣) . z Z';
  else if (h >= 5  && h < 8)  moodText = 'woke up (｡-_-｡)';
  else if (h >= 8  && h < 12) moodText = 'IRL grinding (ง •̀_•́)ง';
  else if (h >= 12 && h < 13) moodText = 'lunch break (っ˘ڡ˘ς)';
  else if (h >= 13 && h < 17) moodText = 'chilling ( ¯꒳¯ )';
  else if (h >= 17 && h < 20) moodText = 'dinner time (っˆڡˆς)';
  else if (h >= 20 && h < 23) moodText = 'otaku time (☆ω☆)';
  else                         moodText = 'doom scrolling (눈_눈)';
  moodSpan.textContent = moodText;
}

/* ===== MASCOT ===== */
document.addEventListener('DOMContentLoaded', () => {
  const mascotImg   = document.getElementById('mascot-img');
  const speechBubble = document.getElementById('speech-bubble');
  if (mascotImg && speechBubble) {
    mascotImg.addEventListener('click', () => {
      speechBubble.classList.add('show');
      setTimeout(() => speechBubble.classList.remove('show'), 3000);
    });
  }
});

/* ===== LAMPPOST BUILDER ===== */
function buildLampposts() {
  const container = document.getElementById('lampposts');
  const count = 8;
  for (let i = 0; i < count; i++) {
    const post  = document.createElement('div');
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