# CS 1.6 Sunucu Durumu Sitesi

Counter-Strike 1.6 arayüzüne (VGUI) benzeyen, ana sayfasında sunucunun
GameTracker üzerindeki anlık durumunu gösteren statik web sitesi.

- Sunucu: `45.74.244.214:27015`
- GameTracker banner'ı her 60 saniyede otomatik yenilenir
- **Bağlan** butonu (`steam://connect/...`), **IP Kopyala**, kurallar ve bağlanma rehberi
- Oyundaki gibi `~` / `"` tuşuyla açılan konsol (`help`, `status`, `connect`, `copy`, `refresh`, `clear`)

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

## Sunucu adresini değiştirme

`js/main.js` dosyasının en üstündeki `CONFIG` bloğunu düzenleyin:

```js
const CONFIG = {
  ip: "45.74.244.214",
  port: 27015,
  refreshSeconds: 60,
};
```

Kurallar metni `index.html` içindeki `tab-rules` bölümündedir.

## Dosyalar

```
index.html                     Ana sayfa
css/style.css                  CS 1.6 teması
js/main.js                     Banner yenileme, sekmeler, konsol
start.sh                       Yerel sunucu (python3 http.server, port 8080)
.devcontainer/devcontainer.json Codespaces ayarı
```
