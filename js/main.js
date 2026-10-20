// Sunucu listesi ve ayarlar js/config.js dosyasındadır.

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

let current; // seçili sunucu (SERVERS içinden)

const addressOf = (s) => `${s.ip}:${s.port}`;
const hasIp = (s) => Boolean(s.ip);

// ---- Konsol ----
const consoleLog = $("#console-log");
function log(msg) {
  const time = new Date().toLocaleTimeString("tr-TR");
  consoleLog.textContent += `[${time}] ${msg}\n`;
  consoleLog.scrollTop = consoleLog.scrollHeight;
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
let remaining = REFRESH_SECONDS;

function showBannerError(msg) {
  banner.hidden = true;
  bannerError.textContent = msg;
  bannerError.hidden = false;
}

function loadBanner() {
  remaining = REFRESH_SECONDS;
  updateCountdown();
  if (!hasIp(current)) {
    banner.removeAttribute("src");
    showBannerError(`${current.name} sunucusunun IP adresi henüz ayarlanmadı (js/config.js).`);
    return;
  }
  // Önbelleği atlatmak için zaman damgası ekle
  const url = `https://cache.gametracker.com/server_info/${addressOf(current)}/b_560_95_1.png`;
  banner.src = `${url}?t=${Date.now()}`;
}

banner.addEventListener("load", () => {
  banner.hidden = false;
  bannerError.hidden = true;
  log(`GameTracker banner güncellendi (${current.name} – ${addressOf(current)})`);
});

banner.addEventListener("error", () => {
  if (!banner.getAttribute("src")) return;
  showBannerError("Banner yüklenemedi. GameTracker'a ulaşılamıyor olabilir.");
  log(`HATA: GameTracker banner yüklenemedi (${current.name})`);
});

function updateCountdown() {
  const active = hasIp(current);
  $("#countdown").textContent = active ? remaining : "--";
  const pct = active ? ((REFRESH_SECONDS - remaining) / REFRESH_SECONDS) * 100 : 0;
  $("#progress-bar").style.width = `${pct}%`;
}

setInterval(() => {
  if (!hasIp(current)) return;
  remaining--;
  if (remaining <= 0) loadBanner();
  else updateCountdown();
}, 1000);

// ---- Oyun seçimi ----
function renderRail() {
  const rail = $("#game-rail");
  SERVERS.forEach((s) => {
    const a = document.createElement("a");
    a.className = "rail-item";
    a.href = `#${s.id}`;
    a.dataset.game = s.id;
    a.title = s.name;
    a.innerHTML = `<span class="rail-short"></span><span class="rail-name"></span>`;
    a.querySelector(".rail-short").textContent = s.short;
    a.querySelector(".rail-name").textContent = s.name;
    rail.appendChild(a);
  });
}

function fillList(el, items) {
  el.innerHTML = "";
  items.forEach((html) => {
    const li = document.createElement("li");
    // howto/rules metinleri config.js'den (site sahibinden) gelir
    li.innerHTML = html.replaceAll("{address}", hasIp(current) ? addressOf(current) : "IP:PORT");
    el.appendChild(li);
  });
}

function selectGame(id) {
  const next = SERVERS.find((s) => s.id === id) || SERVERS[0];
  if (current === next) return;
  current = next;

  document.body.dataset.theme = current.id;
  document.title = `${current.name} Sunucu Durumu`;
  $$(".rail-item").forEach((a) => a.classList.toggle("active", a.dataset.game === current.id));

  const address = hasIp(current) ? addressOf(current) : "IP ayarlanmadı";
  const gtUrl = hasIp(current) ? `https://www.gametracker.com/server_info/${addressOf(current)}/` : "#";
  $("#window-title").textContent = `${current.name} – ${address}`;
  $$(".js-address").forEach((el) => (el.textContent = address));
  $("#game-name").textContent = current.name;
  $("#gt-url").href = gtUrl;
  $("#gt-link").href = gtUrl;

  const connectBtn = $("#btn-connect");
  connectBtn.hidden = !(current.connect === "steam" && hasIp(current));
  connectBtn.href = `steam://connect/${addressOf(current)}`;
  $("#btn-copy").disabled = !hasIp(current);
  $("#btn-refresh").disabled = !hasIp(current);

  fillList($("#rules-list"), current.rules);
  fillList($("#howto-list"), current.howto);

  log(`Oyun değiştirildi: ${current.name}`);
  loadBanner();
}

window.addEventListener("hashchange", () => selectGame(location.hash.slice(1)));

// ---- Sekmeler ----
function showTab(name) {
  $$(".tab").forEach((t) => t.classList.toggle("active", t.dataset.tab === name));
  $$(".tab-content").forEach((c) => c.classList.toggle("active", c.id === `tab-${name}`));
}
$$("[data-tab]").forEach((el) => el.addEventListener("click", () => showTab(el.dataset.tab)));

// ---- IP kopyala ----
async function copyAddress() {
  if (!hasIp(current)) return log(`${current.name} için IP ayarlanmadı.`);
  const address = addressOf(current);
  try {
    await navigator.clipboard.writeText(address);
  } catch {
    // clipboard API yoksa eski yöntem
    const tmp = document.createElement("textarea");
    tmp.value = address;
    document.body.appendChild(tmp);
    tmp.select();
    document.execCommand("copy");
    tmp.remove();
  }
  toast(`IP kopyalandı: ${address}`);
  log(`IP panoya kopyalandı: ${address}`);
}
$("#btn-copy").addEventListener("click", copyAddress);

$("#btn-refresh").addEventListener("click", loadBanner);

$("#btn-connect").addEventListener("click", () => log(`] connect ${addressOf(current)}`));

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
  help: () => log("Komutlar: help, status, games, game <id>, connect, copy, refresh, clear"),
  status: () =>
    log(`${current.name}: ${hasIp(current) ? addressOf(current) : "IP ayarlanmadı"}`),
  games: () => SERVERS.forEach((s) => log(`  ${s.id.padEnd(10)} ${s.name}`)),
  game: (id) => {
    if (!SERVERS.some((s) => s.id === id)) return log("Kullanım: game <id> (liste için: games)");
    location.hash = id;
  },
  connect: () => {
    if (!hasIp(current)) return log(`${current.name} için IP ayarlanmadı.`);
    if (current.connect !== "steam") return log("Bu oyun için 'Nasıl Bağlanırım?' sekmesine bakın.");
    window.location.href = `steam://connect/${addressOf(current)}`;
  },
  copy: copyAddress,
  refresh: loadBanner,
  clear: () => (consoleLog.textContent = ""),
};

$("#console-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = $("#console-cmd");
  const [cmd, arg] = input.value.trim().toLowerCase().split(/\s+/);
  input.value = "";
  if (!cmd) return;
  log(`] ${cmd}${arg ? " " + arg : ""}`);
  (COMMANDS[cmd] || (() => log(`Bilinmeyen komut: ${cmd}`)))(arg);
});

// ---- Başlat ----
log("Sunucu durum paneli yüklendi.");
log("Komut listesi için 'help' yazın.");
renderRail();
showTab("status");
selectGame(location.hash.slice(1));
