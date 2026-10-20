// Sunucu listesi ve ayarlar js/config.js dosyasındadır.

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const CLUB_ID = "42";
let current; // seçili sunucu (SERVERS içinden); kulüp sayfasında null

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
  if (!current) return;
  banner.hidden = false;
  bannerError.hidden = true;
  log(`GameTracker banner güncellendi (${current.name} – ${addressOf(current)})`);
});

banner.addEventListener("error", () => {
  if (!current || !banner.getAttribute("src")) return;
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
  if (!current || !hasIp(current)) return;
  remaining--;
  if (remaining <= 0) loadBanner();
  else updateCountdown();
}, 1000);

// ---- Oyun seçimi ----
function renderRail() {
  const rail = $("#game-rail");
  const club = document.createElement("a");
  club.className = "rail-item rail-club";
  club.href = `#${CLUB_ID}`;
  club.dataset.game = CLUB_ID;
  club.title = CLUB.name;
  club.innerHTML = `<span class="rail-short">42</span>`;
  rail.appendChild(club);
  SERVERS.forEach((s) => {
    const a = document.createElement("a");
    a.className = "rail-item";
    a.href = `#${s.id}`;
    a.dataset.game = s.id;
    a.title = s.name;
    a.innerHTML = `<span class="rail-name"></span>`;
    a.querySelector(".rail-name").textContent = s.name;
    rail.appendChild(a);
  });
}

function renderClub() {
  $("#club-name").textContent = CLUB.name;
  $("#club-about").textContent = CLUB.about;

  const cards = $("#club-servers");
  cards.innerHTML = "";
  SERVERS.forEach((s) => {
    const card = document.createElement("a");
    card.className = "game-card";
    card.href = `#${s.id}`;
    card.dataset.game = s.id;
    card.innerHTML = `
      <span class="card-art"></span>
      <span class="card-body">
        <span class="card-state"></span>
        <span class="card-name"></span>
        <span class="card-addr"></span>
      </span>`;
    card.querySelector(".card-art").style.backgroundImage = `url("img/bg/${s.id}.svg")`;
    card.querySelector(".card-name").textContent = s.name;
    card.querySelector(".card-addr").textContent = hasIp(s) ? addressOf(s) : "IP ayarlanmadı";
    const state = card.querySelector(".card-state");
    state.textContent = hasIp(s) ? "● açık" : "○ yakında";
    state.classList.toggle("on", hasIp(s));
    cards.appendChild(card);
  });

  const links = $("#club-links");
  CLUB.links.forEach((l) => {
    const a = document.createElement("a");
    a.className = "home-btn primary";
    a.href = l.url;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = l.label;
    links.insertBefore(a, $("#home-console"));
  });
}

let onClub = false;

function showClub() {
  onClub = true;
  current = null;
  banner.removeAttribute("src");
  document.body.dataset.theme = "club42";
  document.title = `${CLUB.name} – Sunucular`;
  $$(".rail-item").forEach((a) => a.classList.toggle("active", a.dataset.game === CLUB_ID));
  $("#server-window").hidden = true;
  $("#club-home").hidden = false;
  log(`~/${CLUB_ID} $ cd kulup`);
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

// Bilinmeyen ya da boş link → ana sayfa (42 kulüp sayfası)
const resolveId = (id) => (SERVERS.some((s) => s.id === id) ? id : CLUB_ID);
const activeId = () => (current ? current.id : CLUB_ID);

function selectGame(id) {
  id = resolveId(id);
  if (id === CLUB_ID) {
    if (!onClub) showClub();
    return;
  }
  const next = SERVERS.find((s) => s.id === id);
  if (current === next) return;
  const fromClub = !current;
  onClub = false;
  current = next;
  if (fromClub) {
    $("#club-home").hidden = true;
    $("#server-window").hidden = false;
    showTab("status");
  }

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

// Sayfa geçişi: ekran kararır, tema değişir, yeni sayfa belirir
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let switchTimer;

function navigate(id) {
  if (resolveId(id) === activeId()) return;
  clearTimeout(switchTimer);
  if (reduceMotion.matches) return selectGame(id);
  document.body.classList.add("switching");
  switchTimer = setTimeout(() => {
    selectGame(id);
    requestAnimationFrame(() => document.body.classList.remove("switching"));
  }, 220);
}

window.addEventListener("hashchange", () => navigate(location.hash.slice(1)));

// ---- Sekmeler ----
function showTab(name) {
  $$(".tab").forEach((t) => t.classList.toggle("active", t.dataset.tab === name));
  $$(".tab-content").forEach((c) => c.classList.toggle("active", c.id === `tab-${name}`));
}
$$("[data-tab]").forEach((el) => el.addEventListener("click", () => showTab(el.dataset.tab)));

// ---- IP kopyala ----
async function copyAddress() {
  if (!current) return log("Önce bir oyun seçin (games).");
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
const refresh = () => (current ? loadBanner() : log("Önce bir oyun seçin (games)."));

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
$("#home-console").addEventListener("click", () => setConsoleOpen(consoleWindow.hidden));
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
  help: () => log("Komutlar: help, status, games, game <id>, connect, copy, refresh, clear, 42, norminette"),
  status: () =>
    current
      ? log(`${current.name}: ${hasIp(current) ? addressOf(current) : "IP ayarlanmadı"}`)
      : SERVERS.forEach((s) => log(`  ${s.name}: ${hasIp(s) ? addressOf(s) : "IP ayarlanmadı"}`)),
  games: () => {
    log(`  ${CLUB_ID.padEnd(10)} ${CLUB.name}`);
    SERVERS.forEach((s) => log(`  ${s.id.padEnd(10)} ${s.name}`));
  },
  game: (id) => {
    if (id !== CLUB_ID && !SERVERS.some((s) => s.id === id))
      return log("Kullanım: game <id> (liste için: games)");
    location.hash = id;
  },
  connect: () => {
    if (!current) return log("Önce bir oyun seçin (games).");
    if (!hasIp(current)) return log(`${current.name} için IP ayarlanmadı.`);
    if (current.connect !== "steam") return log("Bu oyun için 'Nasıl Bağlanırım?' sekmesine bakın.");
    window.location.href = `steam://connect/${addressOf(current)}`;
  },
  copy: copyAddress,
  refresh,
  clear: () => (consoleLog.textContent = ""),
  42: () => {
    log(`${CLUB.name} – ${CLUB.about}`);
    location.hash = CLUB_ID;
  },
  norminette: () => {
    log("index.html: OK!");
    log("js/main.js: OK!");
    log("Error: TOO_MANY_HOURS_IN_GAME  (line: 42, col: 1)");
  },
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
renderClub();
showTab("status");
selectGame(location.hash.slice(1));
requestAnimationFrame(() => document.body.classList.add("ready"));
