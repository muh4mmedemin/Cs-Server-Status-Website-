# Oyun Sunucu Durumu Sitesi

Oyun sunucularının GameTracker üzerindeki anlık durumunu, her oyunun kendi
arayüzüne benzeyen temalarla gösteren statik web sitesi.

- Oyunlar: **Counter-Strike 1.6**, **Counter-Strike 2**, **Minecraft**, **Rust**, **Arma 3**
- Soldaki menüden oyun seçilir (mobilde üstte). Her oyunun kendi linki vardır:
  `#cs16`, `#cs2`, `#minecraft`, `#rust`, `#arma3`
- Her oyunun kendine ait çizim arka planı var (`img/bg/`)
- **Ana sayfa 42 kulüp sayfasıdır** (sol üstteki **42** butonu, `#42`): oyun pencerelerinden
  bağımsız, tam sayfa bir açılış; büyük 42 başlığı, kulüp tanıtımı ve her oyun için kendi sahnesini
  gösteren tıklanabilir kartlar. Kulüp adı, açıklaması ve linkleri
  (Discord vb.) `js/config.js` içindeki `CLUB` bloğundan değiştirilir.
- Sayfalar arası geçişler yumuşak (kararma + pencere animasyonu); sistemde "hareketi azalt"
  açıksa animasyonsuz geçer.
- GameTracker banner'ı her 60 saniyede otomatik yenilenir
- **Bağlan** butonu (`steam://connect/...`), **IP Kopyala**, kurallar ve bağlanma rehberi
- Kurulum rehberleri için **Dokümanlar** bölümü (Markdown, kod kopyalama, içindekiler)
- **Konsol** sekmesi veya `~` / `"` tuşuyla açılan, fareyle sürüklenebilir ayrı konsol penceresi (`help`, `status`, `games`, `game <id>`, `connect`, `copy`, `refresh`, `clear`, `42`, `norminette`)

## GitHub Codespaces ile çalıştırma

1. Depo sayfasında **Code** butonuna basıp **Codespaces** sekmesinde **Create codespace on main** deyin.
2. Codespace açılınca site otomatik olarak **8080** portunda başlar ve
   tarayıcıda açılır (açılmazsa alttaki **Ports** sekmesinden 8080'e tıklayın).
3. Otomatik başlamazsa terminalde:

   ```bash
   ./start.sh
   ```

   Site zaten çalışıyorsa betik bunu söyler ve çıkar (ikinci kopya başlatmaz).
   Yeniden başlatmak için: `./start.sh --restart`

> Siteyi başkalarıyla paylaşmak için **Ports** sekmesinde 8080'e sağ tıklayıp
> **Port Visibility** ayarını **Public** yapın.

## Sunucu adreslerini değiştirme

Tüm sunucular `js/config.js` dosyasındaki `SERVERS` listesindedir. Her oyun için
`ip` ve `port` değerlerini girin; IP boş bırakılırsa o oyunun sayfasında
"IP ayarlanmadı" yazar. Kurallar (`rules`) ve bağlanma adımları (`howto`) da
aynı dosyadadır.

```js
{
  id: "rust",
  name: "Rust",
  ip: "1.2.3.4",   // IP'yi buraya yazın
  port: 28015,
  ...
}
```

## Yapım ekleme (harita, mod, build...)

1. Dosyayı ve varsa ekran görüntüsünü `works/<oyun>/` klasörüne koyun (ör. `works/cs16/`).
2. `js/config.js` içindeki `WORKS` listesine bir blok ekleyin (dosyada örnek var).
3. Commit + push. Yapım, oyunun **Yapımlar** sekmesinde ve ana sayfada görünür.
   Karta tıklayınca yapımın kendi sayfası açılır: fotoğraf galerisi, video, uzun açıklama,
   özellik tablosu ve indirme butonu (`gallery`, `video`, `details`, `specs` alanları).

Ayrıntılar ve büyük dosyalar için: [`works/README.md`](works/README.md)

## Doküman ekleme (kurulum rehberleri, cluster betikleri...)

Dokümanlar `docs/` klasöründeki Markdown (`.md`) dosyalarıdır; ana sayfada
`$ ls dokumanlar/` altında listelenir, her biri kendi sayfasında açılır
(`#dokuman/<id>`): kod renklendirme, kod bloklarında **Kopyala** butonu,
not kutuları, tablolar ve otomatik içindekiler.

1. `docs/_sablon.md` dosyasını kopyalayın: `cp docs/_sablon.md docs/yeni.md`
2. Yazın (kurallar: sitedeki **Doküman nasıl yazılır?** sayfası / `docs/dokuman-yazma.md`).
3. `js/config.js` içindeki `DOCS` listesine ekleyin, commit + push.

## Dosyalar

```
index.html                     Ana sayfa
css/style.css                  Ortak düzen + oyun temaları
js/config.js                   Kulüp bilgisi, yapımlar, sunucu IP/port, kurallar, bağlanma adımları
works/<oyun>/                  Yapım dosyaları ve görselleri
docs/*.md, docs/img/           Dokümanlar ve görselleri (docs/_sablon.md: şablon)
js/vendor/                     Markdown ve kod renklendirme kütüphaneleri (marked, highlight.js)
js/main.js                     Oyun geçişi, banner yenileme, sekmeler, konsol
img/bg/*.svg                   Arka planlar (Dust2, Mirage, Minecraft, Rust, Altis, oyun oynanan 42 cluster)
tools/gen-backgrounds.py       Arka plan SVG'lerini üreten betik
start.sh                       Yerel sunucu (python3 http.server, port 8080)
.devcontainer/devcontainer.json Codespaces ayarı
```
