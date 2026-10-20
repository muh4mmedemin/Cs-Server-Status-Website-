// ---- Ayarlar ----
const CONFIG = {
  ip: "45.74.244.214",
  port: 27015,
  refreshSeconds: 60, // GameTracker banner'ının yenilenme aralığı
};

const ADDRESS = `${CONFIG.ip}:${CONFIG.port}`;
const GT_URL = `https://www.gametracker.com/server_info/${ADDRESS}/`;
const GT_BANNER = `https://cache.gametracker.com/server_info/${ADDRESS}/b_560_95_1.png`;
const STEAM_CONNECT = `steam://connect/${ADDRESS}`;

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ---- Statik alanları doldur ----
$$(".js-address").forEach((el) => (el.textContent = ADDRESS));
$$(".js-gt-url").forEach((el) => (el.href = GT_URL));
$("#gt-link").href = GT_URL;
$("#btn-connect").href = STEAM_CONNECT;

// ---- Konsol ----
const consoleLog = $("#console-log");
function log(msg) {
  const time = new Date().toLocaleTimeString("tr-TR");
  consoleLog.textContent += `[${time}] ${msg}\n`;
  consoleLog.scrollTop = consoleLog.scrollHeight;
}

function setStatus(msg) {
  $("#status-text").textContent = msg;
}

let toastTimer;
function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (el.hidden = true), 2000);
}

// ---- GameTracker banner + otomatik yenileme ----
const banner = $("#gt-banner");
const bannerError = $("#gt-error");
let remaining = CONFIG.refreshSeconds;

function loadBanner() {
  // Önbelleği atlatmak için zaman damgası ekle
  banner.src = `${GT_BANNER}?t=${Date.now()}`;
  remaining = CONFIG.refreshSeconds;
  updateCountdown();
  setStatus("GameTracker'dan veri alınıyor...");
}

banner.addEventListener("load", () => {
  banner.hidden = false;
  bannerError.hidden = true;
  setStatus("Sunucu durumu güncellendi.");
  log(`GameTracker banner güncellendi (${ADDRESS})`);
});

banner.addEventListener("error", () => {
  banner.hidden = true;
  bannerError.hidden = false;
  setStatus("Banner yüklenemedi.");
  log("HATA: GameTracker banner yüklenemedi");
});

function updateCountdown() {
  $("#countdown").textContent = remaining;
  const pct = ((CONFIG.refreshSeconds - remaining) / CONFIG.refreshSeconds) * 100;
  $("#progress-bar").style.width = `${pct}%`;
}

setInterval(() => {
  remaining--;
  if (remaining <= 0) loadBanner();
  else updateCountdown();
}, 1000);

// ---- Saat ----
function tickClock() {
  $("#clock").textContent = new Date().toLocaleString("tr-TR");
}
setInterval(tickClock, 1000);
tickClock();

// ---- Sekmeler ----
function showTab(name) {
  $$(".tab").forEach((t) => t.classList.toggle("active", t.dataset.tab === name));
  $$(".tab-content").forEach((c) => c.classList.toggle("active", c.id === `tab-${name}`));
}
$$("[data-tab]").forEach((el) => el.addEventListener("click", () => showTab(el.dataset.tab)));

// ---- IP kopyala ----
async function copyAddress() {
  try {
    await navigator.clipboard.writeText(ADDRESS);
  } catch {
    // clipboard API yoksa eski yöntem
    const tmp = document.createElement("textarea");
    tmp.value = ADDRESS;
    document.body.appendChild(tmp);
    tmp.select();
    document.execCommand("copy");
    tmp.remove();
  }
  toast(`IP kopyalandı: ${ADDRESS}`);
  log(`IP panoya kopyalandı: ${ADDRESS}`);
}
$("#btn-copy").addEventListener("click", copyAddress);

$("#btn-refresh").addEventListener("click", loadBanner);

$("#btn-connect").addEventListener("click", () => log(`] connect ${ADDRESS}`));

// ---- Konsol penceresi ----
const consoleWindow = $("#console-window");
const consoleTab = $("#tab-console");
let consolePlaced = false;

function setConsoleOpen(open) {
  consoleWindow.hidden = !open;
  consoleTab.classList.toggle("open", open);
  if (!open) return;
  if (!consolePlaced) {
    // İlk açılışta sağ alta yerleştir
    const r = consoleWindow.getBoundingClientRect();
    moveConsole(window.innerWidth - r.width - 16, window.innerHeight - r.height - 16);
    consolePlaced = true;
  }
  $("#console-cmd").focus();
}

function moveConsole(x, y) {
  const r = consoleWindow.getBoundingClientRect();
  // Pencere ekran dışına taşmasın
  x = Math.min(Math.max(0, x), Math.max(0, window.innerWidth - r.width));
  y = Math.min(Math.max(0, y), Math.max(0, window.innerHeight - r.height));
  consoleWindow.style.left = `${x}px`;
  consoleWindow.style.top = `${y}px`;
}

consoleTab.addEventListener("click", () => setConsoleOpen(consoleWindow.hidden));
$("#console-close").addEventListener("click", () => setConsoleOpen(false));

// Başlık çubuğundan mouse (veya dokunmatik) ile sürükleme
const consoleTitle = consoleWindow.querySelector(".title-bar");
consoleTitle.addEventListener("pointerdown", (e) => {
  if (e.target.closest("button")) return;
  const r = consoleWindow.getBoundingClientRect();
  const dx = e.clientX - r.left;
  const dy = e.clientY - r.top;
  consoleTitle.setPointerCapture(e.pointerId);
  const onMove = (ev) => moveConsole(ev.clientX - dx, ev.clientY - dy);
  const onUp = () => {
    consoleTitle.removeEventListener("pointermove", onMove);
    consoleTitle.removeEventListener("pointerup", onUp);
  };
  consoleTitle.addEventListener("pointermove", onMove);
  consoleTitle.addEventListener("pointerup", onUp);
});

window.addEventListener("resize", () => {
  if (!consoleWindow.hidden) {
    const r = consoleWindow.getBoundingClientRect();
    moveConsole(r.left, r.top);
  }
});

// "~" tuşu ile konsol aç/kapa (oyundaki gibi)
document.addEventListener("keydown", (e) => {
  if ((e.key === "`" || e.key === "~" || e.key === '"') && e.target.tagName !== "INPUT") {
    e.preventDefault();
    setConsoleOpen(consoleWindow.hidden);
  }
});

const COMMANDS = {
  help: () => log("Komutlar: help, status, connect, copy, refresh, clear"),
  status: () => log(`Sunucu: ${ADDRESS} | GameTracker: ${GT_URL}`),
  connect: () => {
    log(`] connect ${ADDRESS}`);
    window.location.href = STEAM_CONNECT;
  },
  copy: copyAddress,
  refresh: loadBanner,
  clear: () => (consoleLog.textContent = ""),
};

$("#console-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = $("#console-cmd");
  const cmd = input.value.trim().toLowerCase().split(/\s+/)[0];
  input.value = "";
  if (!cmd) return;
  log(`] ${cmd}`);
  (COMMANDS[cmd] || (() => log(`Bilinmeyen komut: ${cmd}`)))();
});

// ---- Başlat ----
log("Counter-Strike 1.6 sunucu durum paneli yüklendi.");
log("Komut listesi için 'help' yazın.");
showTab("status");
loadBanner();
