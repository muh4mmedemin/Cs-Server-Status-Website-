# Yapımlar klasörü

Haritalarınızı, modlarınızı ve diğer yapımlarınızı buraya koyun; sitede
oyunun **Yapımlar** sekmesinde ve ana sayfada görünürler.

## Klasör düzeni

Her oyun için bir alt klasör kullanın:

```
works/
  cs16/        Counter-Strike 1.6  (ör. de_kulup42.zip, de_kulup42.jpg)
  cs2/         Counter-Strike 2
  minecraft/   Minecraft           (ör. dünya .zip, datapack, skin)
  rust/        Rust                (ör. plugin .cs, harita .map)
  arma3/       Arma 3              (ör. görev .pbo)
```

## Yapım ekleme

1. Dosyayı (ve varsa bir ekran görüntüsünü) ilgili klasöre koyun.
   - Görsel 16:9 olursa en iyi görünür (ör. 1280x720 .jpg / .png).
   - Birden fazla dosyadan oluşan yapımları tek bir `.zip` yapın
     (CS 1.6 haritası için: `.bsp` + varsa `.wad`, `.txt`, `overviews/`, `gfx/env/`).
2. `js/config.js` içindeki `WORKS` listesine bir blok ekleyin:

   ```js
   const WORKS = [
     {
       game: "cs16",
       title: "de_kulup42",
       type: "Harita",
       description: "42 kampüsünden esinlenen 5v5 bomba haritası.",
       image: "works/cs16/de_kulup42.jpg",
       download: "works/cs16/de_kulup42.zip",
       date: "2026-11",
     },
   ];
   ```

3. Commit + push. Hepsi bu.

## Büyük dosyalar

GitHub 100 MB'tan büyük dosyaları kabul etmez (50 MB üstünde uyarı verir).
Büyük yapımları Google Drive, GameBanana, Steam Workshop ya da GitHub
Releases'e yükleyip `download` alanına **linkini** yazın:

```js
download: "https://steamcommunity.com/sharedfiles/filedetails/?id=...",
```

Link `http` ile başlıyorsa butonda "Bağlantıya git ↗" yazar ve yeni sekmede açılır.
