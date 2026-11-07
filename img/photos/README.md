# Sunucu sayfası fotoğrafları

Bir oyunun sunucu sayfası her açıldığında, o oyunun klasöründeki fotoğraflardan
biri rastgele seçilip arka plana konur. Fotoğraf yoksa oyunun normal arka planı
(`img/bg/<oyun>.svg`) görünür.

## Klasör düzeni

```
img/photos/
  cs16/        Counter-Strike 1.6
  cs2/         Counter-Strike 2
  minecraft/   Minecraft
  rust/        Rust
  arma3/       Arma 3
  squad/       Squad
```

## Fotoğraf ekleme

1. Fotoğrafı oyunun klasörüne koyun, ör. `img/photos/cs16/kampus.jpg`.
2. `js/config.js` içindeki `BACKGROUNDS` listesinde o oyunun satırına dosya adını
   yazın:

   ```js
   const BACKGROUNDS = {
     cs16: ["kampus.jpg", "lan-gecesi.jpg", "dust2.jpg"],
     cs2: [],
     minecraft: [],
     rust: [],
     arma3: [],
     squad: [],
   };
   ```

3. Commit + push.

Site statik olduğu için klasörün içini kendisi göremez. Listeye yazılmayan
fotoğraf görünmez.

## Fotoğraf önerileri

- Yatay ve en az 1920x1080 olsun.
- Dosya adını büyük/küçük harfiyle listedeki gibi yazın. Site GitHub Pages gibi
  bir yerde çalışıyorsa `Kampus.jpg` ile `kampus.jpg` farklı dosyalardır.
- Adlarda Türkçe karakter ve boşluk kullanmayın, ör. `lan-gecesi.jpg`.
- `.jpg` ya da `.webp` tercih edin ve her dosyayı yaklaşık 500 KB altında tutun.
  Büyük fotoğraflar sayfayı yavaşlatır.
- Fotoğraf pencerenin arkasında kalır ve okunabilirlik için hafifçe karartılır.
  Önemli kısmı ortada olan fotoğraflar en iyi görünür.
