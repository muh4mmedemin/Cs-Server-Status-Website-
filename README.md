# Oyun Sunucu Durumu Sitesi

Oyun sunucularının GameTracker üzerindeki anlık durumunu, her oyunun kendi
arayüzüne benzeyen temalarla gösteren statik web sitesi.

- Oyunlar: **Counter-Strike 1.6**, **Counter-Strike 2**, **Minecraft**, **Rust**, **Arma 3**
- Soldaki geçiş çubuğundan oyun seçilir (mobilde üstte). Her oyunun kendi linki vardır:
  `#cs16`, `#cs2`, `#minecraft`, `#rust`, `#arma3`
- GameTracker banner'ı her 60 saniyede otomatik yenilenir
- **Bağlan** butonu (`steam://connect/...`), **IP Kopyala**, kurallar ve bağlanma rehberi
- **Konsol** sekmesi veya `~` / `"` tuşuyla açılan, fareyle sürüklenebilir ayrı konsol penceresi (`help`, `status`, `games`, `game <id>`, `connect`, `copy`, `refresh`, `clear`)

## GitHub Codespaces ile çalıştırma

1. Depo sayfasında **Code → Codespaces → Create codespace on main** deyin.
2. Codespace açılınca site otomatik olarak **8080** portunda başlar ve
   tarayıcıda açılır (açılmazsa alttaki **Ports** sekmesinden 8080'e tıklayın).
3. Otomatik başlamazsa terminalde:

   ```bash
   ./start.sh
   ```

> Siteyi başkalarıyla paylaşmak için **Ports** sekmesinde 8080'e sağ tıklayıp
> **Port Visibility → Public** yapın.

## Sunucu adreslerini değiştirme

Tüm sunucular `js/config.js` dosyasındaki `SERVERS` listesindedir. Her oyun için
`ip` ve `port` değerlerini girin; IP boş bırakılırsa o oyunun sayfasında
"IP ayarlanmadı" yazar. Kurallar (`rules`) ve bağlanma adımları (`howto`) da
aynı dosyadadır.

```js
{
  id: "rust",
  name: "Rust",
  ip: "1.2.3.4",   // ← buraya
  port: 28015,
  ...
}
```

## Dosyalar

```
index.html                     Ana sayfa
css/style.css                  Ortak düzen + oyun temaları
js/config.js                   Sunucu IP/port, kurallar, bağlanma adımları
js/main.js                     Oyun geçişi, banner yenileme, sekmeler, konsol
start.sh                       Yerel sunucu (python3 http.server, port 8080)
.devcontainer/devcontainer.json Codespaces ayarı
```
