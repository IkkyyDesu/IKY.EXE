/* ============================================
   MYSPACE RETRO 8-BIT — script.js
   ============================================ */

"use strict";

/* ── PLAYLIST DATA ── */
const playlists = [
  {
    id: "3vXSleEPoPmZd86xJ1IpUj",
    name: "🎧 CHILL VIBES",
    desc: "lo-fi · ambient · study beats",
  },
  {
    id: "5riPAnv9pNJxRVUwlstLMn",
    name: "🔥 HYPE MIX",
    desc: "energetic · edm · workout",
  },
  {
    id: "5LoPsc58H9G8NJwoQZ93dK",
    name: "🌙 NIGHT DRIVE",
    desc: "synthwave · retro · late night",
  },
  {
    id: "2alBtdff4u7EAIho0mrGEI",
    name: "🎸 ROCK SOLID",
    desc: "alternative · indie · punk",
  },
];

/* ── INJECT PLAYLIST ITEMS ── */
const grid = document.getElementById("playlistGrid");
if (grid) {
  playlists.forEach((pl) => {
    const item = document.createElement("div");
    item.className = "playlist-item";
    item.dataset.id = pl.id;
    item.dataset.name = pl.name;
    item.innerHTML = `
      <span class="pl-icon">${pl.name.match(/^.{1,2}/)?.[0] || "🎵"}</span>
      <div class="pl-info">
        <div class="pl-name">${pl.name}</div>
        <div class="pl-desc">${pl.desc}</div>
      </div>
      <span class="pl-arrow">▶</span>
    `;
    item.addEventListener("click", () => openPlaylistModal(pl.id, pl.name));
    grid.appendChild(item);
  });
}

/* ── MODAL LOGIC ── */
const overlay = document.getElementById("modalOverlay");
const modalIframe = document.getElementById("modalIframe");
const modalTitle = document.getElementById("modalTitle");
const closeBtn = document.getElementById("modalClose");

function openPlaylistModal(playlistId, name) {
  modalTitle.textContent = name || "🎵 PLAYLIST";
  modalIframe.src =
    `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`;
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  overlay.classList.remove("active");
  modalIframe.src = "";
  document.body.style.overflow = "";
}

closeBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

/* ── THEME TOGGLE ── */
const toggle = document.getElementById("themeToggle");
const icon = document.getElementById("themeIcon");
const html = document.documentElement;
let currentTheme = localStorage.getItem("theme") || "dark";
html.setAttribute("data-theme", currentTheme);
updateThemeIcon(currentTheme);

toggle.addEventListener("click", () => {
  const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  icon.textContent = theme === "dark" ? "🌙" : "☀️";
}

/* ── VISITOR COUNTER ── */
(function () {
  const key = "px_visits";
  const stored = parseInt(localStorage.getItem(key) || "4820", 10);
  const next = stored + 1;
  localStorage.setItem(key, next);
  const el = document.getElementById("visitorCount");
  if (el) el.textContent = String(next).padStart(6, "0");
})();

/* ── TYPING EFFECT for status ── */
const statusMessages = [
  "chronically online",
  "vibing to something good",
  "in my own space.",
  "probably making a playlist.",
  "zoning out for no reason.",
];

let currentStatusIdx = 0;
let charIdx = 0;
let isDeleting = false;

function typeStatus() {
  const el = document.getElementById("statusText");
  if (!el) return;
  const fullText = statusMessages[currentStatusIdx];

  if (isDeleting) {
    el.textContent = fullText.substring(0, charIdx--);
    if (charIdx < 0) {
      isDeleting = false;
      currentStatusIdx = (currentStatusIdx + 1) % statusMessages.length;
      charIdx = 0;
      setTimeout(typeStatus, 600);
      return;
    }
    setTimeout(typeStatus, 45);
  } else {
    el.textContent = fullText.substring(0, ++charIdx);
    if (charIdx === fullText.length) {
      isDeleting = true;
      setTimeout(typeStatus, 2800);
      return;
    }
    setTimeout(typeStatus, 70);
  }
}
setTimeout(typeStatus, 2000);

/* ── MOOD ROTATOR ── */
const moods = [
  { emoji: "(´-ω-`)", text: "sleepy" },
  { emoji: "(っ˘ڡ˘ς)", text: "hungry" },
  { emoji: "(*´∀`)~♥", text: "in love with music" },
  { emoji: "(ง •̀_•́)ง", text: "determined" },
  { emoji: "(´∩｀。)", text: "a little sad" },
  { emoji: "( ´ ▽ ` )ﾉ", text: "happy" },
  { emoji: "(´-ω-`)zzz", text: "exhausted" },
  { emoji: "(￣▽￣)ノ", text: "just vibing" },
];

function setMoodByHour() {
  const hour = new Date().getHours();
  const idx = hour % moods.length;
  const mood = moods[idx];
  const emojiEl = document.getElementById("moodEmoji");
  const textEl = document.getElementById("moodText");
  if (emojiEl) emojiEl.textContent = mood.emoji;
  if (textEl) textEl.textContent = mood.text;
}
setMoodByHour();

/* ── PIXEL GLITCH on title hover ── */
const title = document.querySelector(".site-title");
if (title) {
  const original = title.textContent;
  const glitchChars = "█▓▒░#@$%&!?*";
  title.addEventListener("mouseenter", () => {
    let iterations = 0;
    const interval = setInterval(() => {
      title.textContent = original
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (i < iterations) return original[i];
          return glitchChars[Math.floor(Math.random() * glitchChars.length)];
        })
        .join("");
      if (++iterations >= original.length) {
        clearInterval(interval);
        title.textContent = original;
      }
    }, 40);
  });
}

/* ── CARD PIXEL CLICK EFFECT ── */
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("click", function (e) {
    if (
      e.target.closest("a") ||
      e.target.closest("iframe") ||
      e.target.closest(".playlist-item")
    )
      return;
    const flash = document.createElement("div");
    flash.style.cssText = `
      position:absolute;inset:0;background:rgba(255,255,255,0.06);
      pointer-events:none;z-index:10;
    `;
    this.style.position = "relative";
    this.appendChild(flash);
    setTimeout(() => flash.remove(), 120);
  });
});

/* ── CONSOLE EASTER EGG ── */
console.log(
  "%c ✦ MY SPACE ✦",
  "font-family:monospace;font-size:20px;color:#ff00ff;font-weight:bold;",
);
console.log(
  "%c welcome to my page! you found the console :)",
  "font-family:monospace;color:#ffffff;",
);
console.log(
  "%c made with ♥ · html css js · no frameworks",
  "font-family:monospace;color:#888888;",
);

/* ── KONAMI CODE EASTER EGG ── */
const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
let konamiIdx = 0;

document.addEventListener("keydown", (e) => {
  if (e.keyCode === konamiCode[konamiIdx]) {
    konamiIdx++;
    if (konamiIdx === konamiCode.length) {
      konamiIdx = 0;
      activateRainbow();
    }
  } else {
    konamiIdx = 0;
  }
});

function activateRainbow() {
  document.querySelectorAll(".card").forEach((card, i) => {
    setTimeout(() => {
      card.style.borderColor = `hsl(${i * 60},100%,60%)`;
      card.style.boxShadow = `4px 4px 0 hsl(${i * 60 + 30},100%,40%)`;
      setTimeout(() => {
        card.style.borderColor = "";
        card.style.boxShadow = "";
      }, 3000);
    }, i * 80);
  });
  const msg = document.createElement("div");
  msg.textContent = "★ KONAMI CODE ACTIVATED ★";
  msg.style.cssText = `
    position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
    font-family:'Press Start 2P',monospace;font-size:14px;
    color:#fff;background:#000;border:3px solid #ff00ff;
    padding:20px 28px;z-index:99999;
    box-shadow:6px 6px 0 #660066,0 0 30px rgba(255,0,255,0.5);
    text-align:center;letter-spacing:0.1em;
  `;
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 3000);
}

/* ── BUILD CITY SILHOUETTE ── */
(function buildCity() {
  const container = document.getElementById("cityBuildings");
  if (!container) return;
  const count = 40;
  for (let i = 0; i < count; i++) {
    const b = document.createElement("div");
    b.className = "building";
    const height = 30 + Math.random() * 90;
    b.style.height = height + "%";
    b.style.flex = (0.5 + Math.random() * 0.8).toString();
    // windows
    const winCols = Math.floor(2 + Math.random() * 4);
    const winRows = Math.floor(3 + Math.random() * 6);
    for (let r = 0; r < winRows; r++) {
      for (let c = 0; c < winCols; c++) {
        const w = document.createElement("div");
        w.className = "window " + (Math.random() > 0.4 ? "lit" : "dim");
        const wSize = 3 + Math.random() * 3;
        w.style.width = wSize + "px";
        w.style.height = wSize + "px";
        w.style.left = 10 + c * (80 / winCols) + "%";
        w.style.top = 8 + r * (80 / winRows) + "%";
        w.style.opacity = 0.3 + Math.random() * 0.6;
        b.appendChild(w);
      }
    }
    container.appendChild(b);
  }
})();