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
  const indicator = document.createElement("span");
  indicator.className = "rail-indicator";
  rail.appendChild(indicator);
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

// Sol menüde seçili öğe; gösterge yeni öğeye kayarak gider
function setRailActive(id) {
  $$(".rail-item").forEach((a) => a.classList.toggle("active", a.dataset.game === id));
  updateRailIndicator();
}

function updateRailIndicator() {
  const item = $(".rail-item.active");
  const ind = $(".rail-indicator");
  if (!ind) return;
  ind.style.opacity = item ? 1 : 0;
  if (!item) return;
  ind.style.top = `${item.offsetTop}px`;
  ind.style.left = `${item.offsetLeft}px`;
  ind.style.width = `${item.offsetWidth}px`;
  ind.style.height = `${item.offsetHeight}px`;
  item.scrollIntoView({ block: "nearest", inline: "nearest" });
}

// Kartlar fareye doğru hafifçe eğilir, ışık imleci takip eder
const canHover = window.matchMedia("(hover: hover)");
function addTilt(el, max = 7) {
  el.addEventListener("pointermove", (e) => {
    if (!canHover.matches || reduceMotion.matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
    el.style.setProperty("--rx", `${(0.5 - y) * max}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * max}deg`);
  });
  el.addEventListener("pointerleave", () => {
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  });
}

// Kaydırınca görünür olan bölümler yumuşakça belirir
const revealer = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        revealer.unobserve(e.target);
      }
    }),
  { threshold: 0.12 }
);

// Animasyonu baştan oynat (aynı öğede sınıfı kaldırıp geri ekleyerek)
function replay(el, cls) {
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
}

function renderClub() {
  $("#club-name").textContent = CLUB.name;
  $("#club-about").textContent = CLUB.about;

  const cards = $("#club-servers");
  cards.innerHTML = "";
  SERVERS.forEach((s, i) => {
    const card = document.createElement("a");
    card.className = "game-card";
    card.style.setProperty("--i", i);
    addTilt(card);
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

// ---- Yapımlar (WORKS, js/config.js) ----
const isExternal = (url) => /^https?:\/\//.test(url);
const WORK_PREFIX = "yapim/";
const TR_CHARS = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u" };
const slugify = (t) =>
  t
    .toLocaleLowerCase("tr-TR")
    .replace(/[çğıöşü]/g, (c) => TR_CHARS[c])
    .replace(/[^a-z0-9_]+/g, "-")
    .replace(/^-+|-+$/g, "");
const workId = (w) => w.id || slugify(w.title);
const workHref = (w) => `#${WORK_PREFIX}${workId(w)}`;
const workImages = (w) => (w.gallery && w.gallery.length ? w.gallery : w.image ? [w.image] : []);
const fallbackImg = (img, game) =>
  img.addEventListener("error", () => (img.src = `img/bg/${game}.svg`), { once: true });

function setDownload(a, w) {
  if (!w.download) return a.remove();
  a.href = w.download;
  if (isExternal(w.download)) {
    a.textContent = "Bağlantıya git ↗";
    a.target = "_blank";
    a.rel = "noopener";
  } else {
    a.textContent = "İndir";
    a.setAttribute("download", "");
  }
}

function workCard(w, showGame) {
  const game = SERVERS.find((s) => s.id === w.game);
  const card = document.createElement("article");
  card.className = "work-card";
  card.dataset.game = w.game;
  card.innerHTML = `
    <div class="work-img"><img alt="" loading="lazy"></div>
    <div class="work-body">
      <div class="work-meta"><span class="work-type"></span><span class="work-game"></span></div>
      <h3 class="work-title"><a></a></h3>
      <p class="work-desc"></p>
      <a class="vbtn primary work-dl"></a>
    </div>`;
  const img = card.querySelector("img");
  img.src = workImages(w)[0] || `img/bg/${w.game}.svg`;
  fallbackImg(img, w.game);
  card.querySelector(".work-type").textContent = w.type || "Yapım";
  card.querySelector(".work-game").textContent = showGame && game ? game.name : w.date || "";
  const title = card.querySelector(".work-title a");
  title.textContent = w.title;
  title.href = workHref(w);
  card.querySelector(".work-desc").textContent = w.description || "";
  setDownload(card.querySelector(".work-dl"), w);
  // kartın herhangi bir yerine tıklayınca detay sayfası (indirme butonu hariç)
  card.addEventListener("click", (e) => {
    if (!e.target.closest("a")) location.hash = workHref(w);
  });
  return card;
}

function renderWorks() {
  const list = $("#works-list");
  list.innerHTML = "";
  const mine = WORKS.filter((w) => w.game === current.id);
  mine.forEach((w) => list.appendChild(workCard(w, false)));
  $("#works-empty").hidden = mine.length > 0;
  $('.tab[data-tab="works"]').textContent = mine.length ? `Yapımlar (${mine.length})` : "Yapımlar";
}

function renderHomeWorks() {
  const known = WORKS.filter((w) => SERVERS.some((s) => s.id === w.game));
  $("#home-works").hidden = known.length === 0;
  const list = $("#home-works-list");
  list.innerHTML = "";
  [...known]
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .forEach((w) => list.appendChild(workCard(w, true)));
}

// Uzun açıklama (details): boş satırla paragraf, "## " başlık, "- " madde, **kalın**
function formatDetails(text) {
  const esc = (t) => t.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const inline = (t) => esc(t).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  return text
    .trim()
    .split(/\n\s*\n/)
    .map((block) => {
      const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
      const out = [];
      if (lines[0].startsWith("## ")) out.push(`<h3>${inline(lines.shift().slice(3))}</h3>`);
      if (!lines.length) return out.join("");
      if (lines.every((l) => l.startsWith("- ")))
        out.push(`<ul>${lines.map((l) => `<li>${inline(l.slice(2))}</li>`).join("")}</ul>`);
      else out.push(`<p>${lines.map(inline).join("<br>")}</p>`);
      return out.join("");
    })
    .join("");
}

function youtubeEmbed(url) {
  const m = url.match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/)([\w-]{11})/);
  return m ? `https://www.youtube-nocookie.com/embed/${m[1]}` : null;
}

let galleryImages = [];
let galleryIndex = 0;

function showGalleryImage(i) {
  galleryIndex = (i + galleryImages.length) % galleryImages.length;
  const img = $("#wp-hero-img");
  img.src = galleryImages[galleryIndex];
  replay(img, "swap");
  $$(".wp-thumb").forEach((t, n) => t.classList.toggle("active", n === galleryIndex));
}

function showWork(w) {
  const game = SERVERS.find((s) => s.id === w.game);
  current = null;
  banner.removeAttribute("src");
  document.body.dataset.theme = "club42";
  document.title = `${w.title} – ${CLUB.name}`;
  setRailActive(w.game);
  showView("work");

  const page = $("#work-page");
  page.dataset.game = w.game;
  $("#wp-game-link").textContent = game.id;
  $("#wp-game-link").href = `#${game.id}`;
  $("#wp-slug").textContent = workId(w);
  $("#wp-type").textContent = w.type || "Yapım";
  $("#wp-title").textContent = w.title;
  $("#wp-lead").textContent = w.description || "";

  // galeri
  galleryImages = workImages(w);
  if (!galleryImages.length) galleryImages = [`img/bg/${w.game}.svg`];
  const heroImg = $("#wp-hero-img");
  heroImg.alt = w.title;
  heroImg.onerror = () => (heroImg.src = `img/bg/${w.game}.svg`);
  const thumbs = $("#wp-thumbs");
  thumbs.innerHTML = "";
  if (galleryImages.length > 1)
    galleryImages.forEach((src, i) => {
      const b = document.createElement("button");
      b.className = "wp-thumb";
      b.type = "button";
      b.setAttribute("aria-label", `Görsel ${i + 1}`);
      b.innerHTML = `<img alt="" loading="lazy">`;
      b.querySelector("img").src = src;
      fallbackImg(b.querySelector("img"), w.game);
      b.addEventListener("click", () => showGalleryImage(i));
      thumbs.appendChild(b);
    });
  showGalleryImage(0);

  // video
  const video = $("#wp-video");
  video.innerHTML = "";
  video.hidden = !w.video;
  if (w.video) {
    const embed = youtubeEmbed(w.video);
    if (embed) {
      const f = document.createElement("iframe");
      f.src = embed;
      f.title = `${w.title} videosu`;
      f.allow = "accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen";
      f.loading = "lazy";
      video.appendChild(f);
    } else {
      const a = document.createElement("a");
      a.href = w.video;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = "Videoyu izle ↗";
      video.appendChild(a);
    }
  }

  $("#wp-details").innerHTML = w.details ? formatDetails(w.details) : "";

  // yan panel: indirme + özellikler
  const side = $(".wp-side");
  const oldDl = $("#wp-dl");
  const dl = document.createElement("a");
  dl.className = "home-btn primary wp-dl";
  dl.id = "wp-dl";
  if (oldDl) oldDl.replaceWith(dl);
  else side.prepend(dl);
  setDownload(dl, w);

  const specs = $("#wp-specs");
  specs.innerHTML = "";
  const rows = { Oyun: game.name, Tür: w.type || "Yapım", ...(w.date ? { Tarih: w.date } : {}), ...(w.specs || {}) };
  Object.entries(rows).forEach(([k, v]) => {
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = k;
    dd.textContent = v;
    specs.append(dt, dd);
  });
  $("#wp-server").textContent = `${game.name} sunucusu →`;
  $("#wp-server").href = `#${game.id}`;

  log(`~/${CLUB_ID}/yapimlar $ cat ${workId(w)}`);
}

// ---- Tam ekran görüntüleyici ----
const lightbox = $("#lightbox");
function openLightbox(i) {
  galleryIndex = i;
  lightbox.hidden = false;
  updateLightbox();
}
function updateLightbox() {
  $("#lb-img").src = galleryImages[galleryIndex];
  replay($("#lb-img"), "swap");
  $("#lb-count").textContent = `${galleryIndex + 1} / ${galleryImages.length}`;
  const many = galleryImages.length > 1;
  $("#lb-prev").hidden = !many;
  $("#lb-next").hidden = !many;
}
function stepLightbox(d) {
  showGalleryImage(galleryIndex + d);
  updateLightbox();
}
$("#wp-hero").addEventListener("click", () => openLightbox(galleryIndex));
$("#lb-close").addEventListener("click", () => (lightbox.hidden = true));
$("#lb-prev").addEventListener("click", () => stepLightbox(-1));
$("#lb-next").addEventListener("click", () => stepLightbox(1));
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) lightbox.hidden = true;
});
document.addEventListener("keydown", (e) => {
  if (lightbox.hidden) return;
  if (e.key === "Escape") lightbox.hidden = true;
  else if (e.key === "ArrowLeft") stepLightbox(-1);
  else if (e.key === "ArrowRight") stepLightbox(1);
});

function showView(name) {
  $("#club-home").hidden = name !== "club";
  $("#server-window").hidden = name !== "game";
  $("#work-page").hidden = name !== "work";
  lightbox.hidden = true;
  window.scrollTo(0, 0);
}

function showClub() {
  current = null;
  banner.removeAttribute("src");
  document.body.dataset.theme = "club42";
  document.title = `${CLUB.name} – Sunucular`;
  setRailActive(CLUB_ID);
  showView("club");
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

// Linkler: #<oyun> → oyun sayfası, #yapim/<id> → yapım sayfası,
// boş ya da bilinmeyen link → ana sayfa (42 kulüp sayfası)
function parseRoute(hash) {
  hash = decodeURIComponent(hash);
  if (hash.startsWith(WORK_PREFIX)) {
    const work = WORKS.find((w) => workId(w) === hash.slice(WORK_PREFIX.length));
    if (work && SERVERS.some((s) => s.id === work.game)) return { key: hash, work };
  }
  if (SERVERS.some((s) => s.id === hash)) return { key: hash, game: hash };
  return { key: CLUB_ID };
}

let activeKey = null;

function route(hash) {
  const r = parseRoute(hash);
  if (r.key === activeKey) return;
  activeKey = r.key;
  if (r.work) showWork(r.work);
  else if (r.game) selectGame(r.game);
  else showClub();
}

function selectGame(id) {
  const fromOtherView = !current;
  current = SERVERS.find((s) => s.id === id);
  if (fromOtherView) {
    showView("game");
    showTab("status");
  }

  document.body.dataset.theme = current.id;
  document.title = `${current.name} Sunucu Durumu`;
  setRailActive(current.id);

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
  renderWorks();

  log(`Oyun değiştirildi: ${current.name}`);
  loadBanner();
}

// Sayfa geçişi: ekran kararır, tema değişir, yeni sayfa belirir
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let switchTimer;

function navigate(hash) {
  if (parseRoute(hash).key === activeKey) return;
  clearTimeout(switchTimer);
  if (reduceMotion.matches) return route(hash);
  document.body.classList.add("switching");
  switchTimer = setTimeout(() => {
    route(hash);
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
  updateRailIndicator();
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
renderHomeWorks();
showTab("status");
route(location.hash.slice(1));
$$(".reveal").forEach((el) => revealer.observe(el));
document.fonts.ready.then(updateRailIndicator);
requestAnimationFrame(() => document.body.classList.add("ready"));
