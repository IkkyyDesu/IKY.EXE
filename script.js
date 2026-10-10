/* modern life is lonely — vanilla JS, no libraries */
(() => {
  'use strict';

  /* Add image filenames here if your server doesn't expose folder listings.
     Only list files that really exist in IMG/. */
  const CONFIG = { images: [] };


  /* Your favorite albums (top friends list). For each one:
       url   = the album's Spotify link, e.g. https://open.spotify.com/album/xxxxxxxx
       cover = filename of the cover you put in IMG/, e.g. 'my-album.jpg'
     Until a cover is set, a numbered tile is shown. Add or remove rows freely. */
 /* Your favorite albums (top friends list). For each one:
       url   = the album's Spotify link, e.g. https://open.spotify.com/album/xxxxxxxx
       cover = filename of the cover you put in IMG/, e.g. 'my-album.jpg'
     Until a cover is set, a numbered tile is shown. Add or remove rows freely. */
  const ALBUMS = [
    { title: 'Nurture', artist: 'Porter Robinson', url: 'https://open.spotify.com/album/3QITXlmmt93E176jzVqKUb?si=VZaus-fCTGyxVUrnGeGxGw', cover: 'IMG/album/nurture.jpg' },
    { title: 'Magic', artist: 'Tayori', url: 'https://open.spotify.com/album/3ebXAhCFDo1PNsQA2RlFOd?si=A5RMWLlfTYO1DQCKNUYvVw', cover: 'IMG/album/magic.jpg' },
    { title: 'Modern Life is Lonely', artist: 'Holding Absence', url: 'https://open.spotify.com/album/12qyF8VYd8ceuwyHpGGgw2?si=VZlJ3beFQMmBq7coirWLWQ', cover: 'IMG/album/MLIL.jpg' },
    { title: 'Heavener', artist: 'Invent Animate', url: 'https://open.spotify.com/album/0T0XW3kREbbHdNyqbZAd99?si=DrHAIlagQsqZruz55Zt5qg', cover: 'IMG/album/heavener.jpg' },
    { title: 'Even In Arcadia', artist: 'Sleep Token', url: 'https://open.spotify.com/album/1lS7FeRcSUuIGqyg99UGpj?si=60fd596b898545ea', cover: 'IMG/album/EIA.jpg' },
    { title: 'POST HUMAN: Nex GEn', artist: 'Bring Me The Horizon', url: 'https://open.spotify.com/album/1k7OXnGQPV4zF3seDwRroD?si=gSMOQTzGQx-DnQDL-RIgvA', cover: 'IMG/album/PH.jpg' }
  ];

  /* Your 4 Spotify playlists. Paste each playlist link into `url`
     (e.g. https://open.spotify.com/playlist/xxxxxxxx) and rename the title. */
  const PLAYLISTS = [
    { title: 'UPLOAD', note: '', url: 'https://open.spotify.com/playlist/3vXSleEPoPmZd86xJ1IpUj', cover: 'IMG/PLAYLIST/VEIL.jpeg'},
    { title: 'COMPILE', note: '', url: 'https://open.spotify.com/playlist/5riPAnv9pNJxRVUwlstLMn', cover: 'IMG/PLAYLIST/LURE.jpeg'},
    { title: 'EXECUTE', note: '', url: 'https://open.spotify.com/playlist/5LoPsc58H9G8NJwoQZ93dK', cover: 'IMG/PLAYLIST/VAST.jpeg'},
    { title: 'OVERRIDE', note: '', url: 'https://open.spotify.com/playlist/2alBtdff4u7EAIho0mrGEI', cover: 'IMG/PLAYLIST/WANE.jpeg'}
  ];

  /* Your character sheet ("player stats"). Everything on that card comes from this block.
       name / cls / title = the text next to the LV badge      level = the number in the badge
       bars  = vitals. `max` is the full value, `color` is hp, mp or xp (bar colour).
               `now` is either one number, or { dawn, dusk, midnight } so the bar changes
               when someone presses the Day-night cycle buttons. Under 30% an HP-style bar blinks.
       attrs = [name, 0-10]. Each point lights up one of the 10 segments (10 shows MAX).
       gear  = [label, text, one-character icon]. Your old "favorites" list lives here now.
       buffs = small tags. Start with "+" for a buff (green) or "-" for a debuff (red). */
  const STATS = {
    name: 'IKY', cls: 'Otaku Bard', title: 'Keeper of Unfinished Quests', level: 22,
    bars: [
      { key: 'HP', label: 'Health',               color: 'hp', max: 100, now: { dawn: 78, dusk: 64, midnight: 21 } },
      { key: 'MP', label: 'Mana (anime reserves)', color: 'mp', max: 100, now: { dawn: 52, dusk: 80, midnight: 100 } },
      { key: 'XP', label: 'Next level',           color: 'xp', max: 100, now: 73 }
    ],
    attrs: [['Melancholy', 9], ['Otaku', 10], ['Night Owl', 9], ['Nostalgia', 8], ['Backlog', 10], ['Sleep', 2]],
    gear: [
      ['Aura',       'rain on the window, like a quiet cutscene', '\u2602'],
      ['Peak hour',  'the one right after sunset, when the credits feel close', '\u263E'],
      ['Consumable', 'konbini melon bread, eaten between boss fights', '\u25D5'],
      ['Accessory',  'cherry blossom, obviously: the prettiest thing that never lasts', '\u273F'],
      ['BGM',        'the hush right before the title screen music', '\u266A']
    ],
    buffs: ['+ Headphones On', '+ Sakura Aura', '- 3 a.m. Thoughts', '- One More Episode']
  };

  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };
  const rnd = (a, b) => a + Math.random() * (b - a);

  /* ---------- find real files (folder listing), never guess names ---------- */
  async function listDir(dir, re) {
    try {
      const r = await fetch(dir + '/', { cache: 'no-store' });
      if (!r.ok) return [];
      const doc = new DOMParser().parseFromString(await r.text(), 'text/html');
      return [...doc.querySelectorAll('a')]
        .map(a => decodeURIComponent((a.getAttribute('href') || '').split('?')[0]))
        .filter(h => re.test(h))
        .map(h => dir + '/' + h.split('/').pop());
    } catch (e) { return []; }
  }
  const uniq = a => [...new Set(a)];

  /* ---------- petals ---------- */
  const petalBox = $('#petals');
  function makePetal() {
    const p = document.createElement('span');
    p.className = 'petal';
    p.style.setProperty('--s', rnd(10, 20).toFixed(0) + 'px');
    p.style.setProperty('--l', rnd(0, 100) + '%');
    p.style.setProperty('--x', rnd(-120, 120) + 'px');
    p.style.setProperty('--d', rnd(12, 22) + 's');
    p.style.setProperty('--dl', -rnd(0, 20) + 's');
    petalBox.appendChild(p);
  }
  if (!reduce) for (let i = 0; i < (innerWidth < 700 ? 9 : 16); i++) makePetal();

  /* ---------- player stats (character sheet) ---------- */
  const cs = $('#charSheet'), csBars = [];
  $('#csLevel').textContent = STATS.level;
  $('#csName').textContent = STATS.name;
  $('#csClass').textContent = STATS.cls + ' \u00B7 ' + STATS.title;
  STATS.bars.forEach(b => {
    const li = mk('li', 'bar ' + b.color), top = mk('div', 'bar-top'), val = mk('span', 'bar-val');
    const track = mk('div', 'track'), fill = mk('i', 'fill');
    top.append(mk('b', '', b.key), mk('span', 'bar-lbl', b.label), val);
    track.append(fill); li.append(top, track); $('#csBars').append(li);
    csBars.push({ b, li, fill, val });
  });
  STATS.attrs.forEach(([name, n]) => {
    n = Math.max(0, Math.min(10, n));
    const li = mk('li', n === 10 ? 'max' : ''), seg = mk('span', 'seg');
    for (let i = 0; i < 10; i++) { const k = mk('i', i < n ? 'on' : ''); k.style.setProperty('--i', i); seg.append(k); }
    li.append(mk('span', '', name), seg, mk('em', '', n === 10 ? 'MAX' : n + '/10'));
    $('#csAttrs').append(li);
  });
  STATS.gear.forEach(([label, text, icon]) => {
    const row = mk('div'); row.dataset.g = icon;
    row.append(mk('dt', '', label), mk('dd', '', text)); $('#csGear').append(row);
  });
  STATS.buffs.forEach(t => $('#csBuffs').append(mk('li', /^[-\u2212]/.test(t.trim()) ? 'deb' : 'buf', t)));
  function paintStats(m) { /* called on load and whenever the Day-night cycle changes */
    csBars.forEach(({ b, li, fill, val }) => {
      const now = typeof b.now === 'object' ? (b.now[m] ?? b.now.dusk) : b.now;
      const pct = Math.max(0, Math.min(100, now / b.max * 100));
      fill.style.setProperty('--v', pct); val.textContent = now + ' / ' + b.max;
      li.classList.toggle('low', pct < 30);
    });
  }
  new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { cs.classList.add('in'); o.disconnect(); } }), { threshold: 0.2 }).observe(cs);

  /* ---------- profile: clock, visits, mood ---------- */
  const clock = $('#clock');
  const tick = () => { clock.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); };
  tick(); setInterval(tick, 20000);
  const visits = store.get('wod-visits', 0) + 1; store.set('wod-visits', visits); $('#visits').textContent = visits;

  const statuses = { dawn: 'one more quest before the sun comes up', dusk: 'idle in the lobby, rain on the window', midnight: 'past 3 a.m., credits rolling, still awake' };
  function setMood(m) {
    document.documentElement.dataset.mood = m;
    $('#statusText').textContent = statuses[m];
    $$('.moods button').forEach(b => b.classList.toggle('on', b.dataset.mood === m));
    store.set('wod-mood', m);
    paintStats(m);
  }
  $$('.moods button').forEach(b => b.addEventListener('click', () => setMood(b.dataset.mood)));
  setMood(store.get('wod-mood', 'dusk'));

  /* active nav link */
  const links = $$('#nav a');
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + en.target.id));
  }), { rootMargin: '-40% 0px -55% 0px' });
  $$('main [id]').forEach(s => io.observe(s));

  /* the hero is gone, so Home and the logo just scroll back to the top */
  $$('a[href="#home"]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault(); scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  }));

  /* ---------- favorite albums (tap = open on Spotify) ---------- */
  const tints = ['#7fc8ea', '#f6b9ac', '#ffe0d6', '#a9d6f0', '#f3a6b8', '#8fb8e8'];
  const spotifyLink = u => {
    const t = String(u || '').trim(), m = t.match(/^spotify:(album|playlist|artist|track):([A-Za-z0-9]+)/);
    return m ? 'https://open.spotify.com/' + m[1] + '/' + m[2] : (/^https?:\/\//i.test(t) ? t : '');
  };
  ALBUMS.forEach((a, i) => {
    const li = mk('li'), url = spotifyLink(a.url), card = mk(url ? 'a' : 'span', 'al');
    if (url) {
      card.href = url; card.target = '_blank'; card.rel = 'noopener';
      card.setAttribute('aria-label', a.title + (a.artist ? ' by ' + a.artist : '') + ' on Spotify');
    }
    const art = mk('b', '', String(i + 1));
    art.style.setProperty('--c', tints[i % tints.length]);
    if (a.cover) { /* swap in the cover only once it has loaded; otherwise the numbered tile stays */
      const im = new Image(); im.alt = '';
      im.addEventListener('load', () => { art.textContent = ''; art.append(im); });
      im.src = 'IMG/' + a.cover.replace(/^IMG\//, '');
    }
    card.append(art, mk('span', 't', a.title), mk('small', '', a.artist || (url ? '▶ play on Spotify' : 'add a link in script.js')));
    li.append(card); $('#albumList').append(li);
  });

  /* ---------- profile song: waveform + 30-second clip ---------- */
  const cfg = $('#music').dataset; /* song settings are the data-* attributes in index.html */
  const CLIP = Math.max(1, +cfg.length || 30);
  const el = id => document.getElementById(id);
  const au = new Audio(); au.preload = 'metadata';
  let song = null, start = 0, len = CLIP, raf = 0, vol = .7, peaks = null;
  au.volume = vol;
  const cv = el('wave'), cx = cv.getContext('2d');
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const fmt = s => isFinite(s) ? Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0') : '0:00';
  const nice = p => decodeURIComponent(p.split('/').pop()).replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ');
  const playerEl = $('#music');
  /* ambient glow behind the cover: a blurred copy of the same picture */
  const coverImg = document.querySelector('#disc img');
  if (coverImg) $('#disc').style.setProperty('--cover', 'url("' + coverImg.getAttribute('src') + '")');
  const total = () => isFinite(au.duration) ? au.duration : CLIP;
  const maxStart = () => isFinite(au.duration) ? Math.max(0, Math.floor(au.duration - Math.min(CLIP, au.duration))) : 3600;

  /* waveform: whole song as bars, the chosen clip lit up, a glowing playhead */
  function draw() {
    const dpr = devicePixelRatio || 1, w = cv.clientWidth, h = cv.clientHeight;
    if (!w) return;
    if (cv.width !== Math.round(w * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
    cx.setTransform(dpr, 0, 0, dpr, 0, 0); cx.clearRect(0, 0, w, h);
    const bloom = css('--bloom') || '#f6b9ac', sky = css('--sky') || '#3b8fc6';
    const n = peaks ? peaks.length : 96, bw = w / n, d = total();
    const x0 = start / d * w, x1 = Math.min(w, (start + len) / d * w), t = (au.currentTime || 0) / d * w;
    const bar = (x, y, bw2, bh2) => { cx.beginPath(); cx.roundRect ? cx.roundRect(x, y, bw2, bh2, bw2 / 2) : cx.rect(x, y, bw2, bh2); cx.fill(); };
    for (let i = 0; i < n; i++) {
      const x = i * bw, mid = x + bw / 2, p = peaks ? peaks[i] : .12 + .06 * Math.sin(i / 2);
      const bh = Math.max(4, p * h * .84), inClip = mid >= x0 && mid <= x1;
      cx.fillStyle = inClip ? bloom : sky;
      cx.globalAlpha = inClip ? (mid <= t ? 1 : .55) : .22;
      bar(x + .5, (h - bh) / 2, Math.max(1.5, bw - 1.5), bh);
    }
    /* viewfinder corners around the clip, like a frame on a contact sheet */
    cx.fillStyle = bloom; cx.globalAlpha = .08; cx.fillRect(x0, 0, x1 - x0, h);
    cx.strokeStyle = bloom; cx.globalAlpha = .35; cx.lineWidth = 1;
    cx.beginPath(); cx.moveTo(x0, .5); cx.lineTo(x1, .5); cx.moveTo(x0, h - .5); cx.lineTo(x1, h - .5); cx.stroke();
    cx.globalAlpha = 1; cx.lineWidth = 2;
    [[x0 + 1, 1, 1, 1], [x1 - 1, 1, -1, 1], [x0 + 1, h - 1, 1, -1], [x1 - 1, h - 1, -1, -1]].forEach(([px, py, dx, dy]) => {
      cx.beginPath(); cx.moveTo(px + dx * 10, py); cx.lineTo(px, py); cx.lineTo(px, py + dy * 10); cx.stroke();
    });
    if (t >= x0 && t <= x1) { /* glowing playhead with a soft halo and a notch */
      cx.fillStyle = bloom; cx.globalAlpha = .1; cx.fillRect(t - 9, 0, 18, h); cx.globalAlpha = .18; cx.fillRect(t - 3, 0, 6, h);
      cx.globalAlpha = 1; cx.fillStyle = '#fff'; cx.shadowColor = bloom; cx.shadowBlur = 12; cx.fillRect(t - 1, 0, 2, h); cx.shadowBlur = 0;
      cx.beginPath(); cx.moveTo(t - 5, 0); cx.lineTo(t + 5, 0); cx.lineTo(t, 6); cx.fill();
    }
    cx.globalAlpha = 1;
  }

  async function loadPeaks(s) {
    const n = 160;
    try {
      const ab = await fetch(s.src).then(r => { if (!r.ok) throw 0; return r.arrayBuffer(); });
      const AC = window.AudioContext || window.webkitAudioContext, ctx = new AC();
      const ch = (await ctx.decodeAudioData(ab)).getChannelData(0); if (ctx.close) ctx.close();
      const step = Math.floor(ch.length / n) || 1, out = []; let max = 0;
      for (let i = 0; i < n; i++) {
        let m = 0; for (let j = i * step; j < (i + 1) * step; j += Math.max(1, step >> 6)) m = Math.max(m, Math.abs(ch[j] || 0));
        out.push(m); max = Math.max(max, m);
      }
      if (song === s) peaks = out.map(v => Math.pow(v / (max || 1), .7));
    } catch (e) { /* can't decode (e.g. opened from file://): draw a decorative wave instead */
      if (song === s) peaks = Array.from({ length: n }, (_, i) => .2 + .55 * Math.abs(Math.sin(i * .37) * Math.cos(i * .11)));
    }
    draw();
  }

  /* keep every readout in sync with the chosen start point */
  function syncClip() {
    len = isFinite(au.duration) ? Math.min(CLIP, Math.max(1, au.duration - start)) : CLIP;
    el('dur').textContent = fmt(len); el('seek').max = len;
    el('clipRange').textContent = fmt(start) + ' – ' + fmt(start + len);
    draw();
  }
  function setStart(s, jump) {
    start = Math.max(0, Math.min(isNaN(s) ? 0 : Math.round(s), maxStart()));
    syncClip();
    if (jump && song) au.currentTime = start;
  }

  function loadSong(s) {
    song = s; peaks = null;
    au.src = s.src;
    el('songTitle').textContent = s.name;
    el('songSub').textContent = [s.artist, s.album].filter(Boolean).join(' · ') || 'main theme · ' + CLIP + ' sec loop';
    el('empty').hidden = true;
    start = +cfg.start || 0;
    el('seek').value = 0; el('cur').textContent = '0:00';
    syncClip(); loadPeaks(s);
  }
  au.addEventListener('loadedmetadata', () => setStart(start, true));

  /* the clip loop, with a soft fade in/out at the edges so it never clicks */
  function frame() {
    const t = au.currentTime - start;
    if (t >= len - .03 || t < -.5) au.currentTime = start;
    const c = Math.max(0, Math.min(len, au.currentTime - start));
    au.volume = vol * Math.max(0, Math.min(1, c / .8, (len - c) / .8));
    el('cur').textContent = fmt(c); el('seek').value = c; el('seek').style.setProperty('--p', c / len * 100 + '%');
    draw(); raf = requestAnimationFrame(frame);
  }
  function toggle() {
    if (!song) { el('songSub').textContent = 'No disc inserted. Set data-src in index.html'; return; }
    if (!au.paused) return au.pause();
    if (au.currentTime < start || au.currentTime >= start + len) au.currentTime = start;
    au.play().catch(() => { el('songSub').textContent = 'tap play to press start'; });
  }
  el('play').addEventListener('click', toggle);
  el('vol').addEventListener('input', e => { vol = au.volume = +e.target.value; e.target.style.setProperty('--p', e.target.value * 100 + '%'); });
  el('seek').addEventListener('input', e => { au.currentTime = start + +e.target.value; e.target.style.setProperty('--p', e.target.value / len * 100 + '%'); draw(); });
  au.addEventListener('play', () => {
    playerEl.classList.add('playing'); el('play').textContent = '❚❚'; el('play').setAttribute('aria-label', 'Pause');
    cancelAnimationFrame(raf); frame();
  });
  au.addEventListener('pause', () => {
    cancelAnimationFrame(raf); au.volume = vol; draw();
    playerEl.classList.remove('playing'); el('play').textContent = '▶'; el('play').setAttribute('aria-label', 'Play');
  });
  au.addEventListener('ended', () => { au.currentTime = start; au.play().catch(() => {}); });
  au.addEventListener('error', () => { if (au.src) el('songSub').textContent = "This disc won't spin. The file couldn't be played"; });

  addEventListener('resize', draw);
  $$('.moods button').forEach(b => b.addEventListener('click', () => setTimeout(draw, 60)));


  /* ---------- spotify playlists (popup embed) ---------- */
  const dlg = $('#plDialog'), plBody = $('#plBody');
  const crops = ['20% 20%', '70% 8%', '88% 55%', '45% 75%'];
  const spotifyId = u => {
    const t = String(u || '').trim();
    const m = t.match(/playlist[\/:]([A-Za-z0-9]{10,})/) || t.match(/^([A-Za-z0-9]{22})$/);
    return m ? m[1] : '';
  };
  function mk(tag, cls, text) { const n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; }

  PLAYLISTS.forEach((p, i) => {
    const li = mk('li'), b = mk('button', 'pl'), im = new Image();
    b.type = 'button'; b.style.setProperty('--pos', p.cover ? '50% 50%' : crops[i % crops.length]);
    b.setAttribute('aria-label', 'Open ' + p.title);
    im.alt = ''; im.addEventListener('error', () => im.remove());
    im.src = 'IMG/' + (p.cover ? p.cover.replace(/^IMG\//, '') : 'Cover.jpg');
    b.append(im, mk('em', '', String(i + 1).padStart(2, '0')), mk('strong', '', p.title), mk('small', '', p.note || '▶ load & listen'));
    b.addEventListener('click', () => openPlaylist(i));
    li.append(b); $('#plGrid').append(li);
  });

  function openPlaylist(i) {
    const p = PLAYLISTS[i], id = spotifyId(p.url);
    $('#plTitle').textContent = p.title;
    plBody.textContent = '';
    if (id) {
      const f = mk('iframe');
      f.src = 'https://open.spotify.com/embed/playlist/' + id + '?utm_source=generator';
      f.title = p.title + ' on Spotify';
      f.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
      const a = mk('a', 'open', 'continue on Spotify ↗');
      a.href = 'https://open.spotify.com/playlist/' + id; a.target = '_blank'; a.rel = 'noopener';
      plBody.append(f, a);
    } else {
      plBody.append(mk('p', 'empty', "Empty slot. Paste this playlist's Spotify URL into PLAYLISTS at the top of script.js."));
    }
    au.pause(); /* don't talk over the embedded player */
    dlg.showModal ? dlg.showModal() : dlg.setAttribute('open', '');
  }
  $('#plClose').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', () => { plBody.textContent = ''; }); /* removing the iframe stops playback */

  /* ---------- social frames: open in a new tab; a broken picture becomes a blank film frame ---------- */
  $$('#frames a').forEach(a => { a.target = '_blank'; a.rel = 'noopener noreferrer'; });
  $$('#frames figure').forEach(fig => {
    const im = fig.querySelector('img');
    if (!im) return;
    const blank = () => { fig.classList.add('blank'); im.remove(); };
    im.addEventListener('error', blank);
    if (im.complete && !im.naturalWidth) blank();
  });

  /* ---------- boot: discover SONG/ and IMG/ ---------- */
  (async () => {
    const [songs, imgs] = await Promise.all([
      listDir('SONG', /\.(mp3|ogg|wav|m4a|flac|opus|aac)$/i),
      listDir('IMG', /\.(gif|png|jpe?g|webp)$/i)
    ]);
    const src = cfg.src || songs[0] || '';
    if (src) loadSong({ src, name: cfg.title || nice(src), artist: cfg.artist || '', album: cfg.album || '' });
    else el('empty').hidden = false;

    /* extra images/GIFs in IMG/ float as polaroids (album covers and Cover.jpg are skipped) */
    const used = ALBUMS.filter(a => a.cover).map(a => 'IMG/' + a.cover.replace(/^IMG\//, ''));
    const extra = uniq([...CONFIG.images.map(s => 'IMG/' + s.replace(/^IMG\//, '')), ...imgs])
      .filter(p => !/Cover\.jpg$/i.test(p) && !used.includes(p));
    extra.slice(0, 8).forEach((p, i) => {
      const im = new Image(); im.src = p; im.alt = ''; im.loading = 'lazy';
      im.style.cssText = `top:${rnd(12, 80)}%;${i % 2 ? 'right' : 'left'}:${rnd(0, 3)}%;--r:${rnd(-8, 8)}deg;animation-delay:${-rnd(0, 8)}s`;
      $('#floaters').appendChild(im);
    });
  })();
})();