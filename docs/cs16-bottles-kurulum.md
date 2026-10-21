# Bottles ile CS 1.6 kurulumu

Bu rehber, 42 cluster bilgisayarlarında (Linux, `sudo` yetkisi olmadan)
**Bottles** üzerinden Windows Steam'i ve **Counter-Strike 1.6**'yı kurup
kulübün sunucusuna bağlanmayı anlatır.

> [!NOTE]
> Bottles, Windows programlarını Linux'ta Wine ile çalıştıran bir uygulamadır.
> Flatpak ile kullanıcı hesabına kurulduğu için yönetici yetkisi gerekmez.

## Gereksinimler

- Cluster'da açılmış bir oturum ve terminal
- `flatpak` komutu (çoğu 42 kampüsünde kurulu gelir, `flatpak --version` ile kontrol edin)
- Steam hesabı ve hesapta **Counter-Strike** (CS 1.6) oyunu
- Boş alan: Bottles + Steam + CS 1.6 için yaklaşık **3–4 GB**

> [!WARNING]
> Home klasörünüzün kotası küçüktür. Flatpak verilerini olduğu gibi home'a
> kurarsanız kota dolar ve oturumunuz sorun çıkarabilir. Aşağıdaki adımda
> verileri `goinfre`'ye yönlendiriyoruz.

## 1. Verileri goinfre'ye yönlendirme

`goinfre` her bilgisayarın kendi diskindeki geniş, kotasız alandır
(genellikle `/goinfre/$USER`). Flatpak'in uygulama ve veri klasörlerini oraya
yönlendirmek için:

```bash
$ GOINFRE="/goinfre/$USER"
$ mkdir -p "$GOINFRE/flatpak" "$GOINFRE/var-app" ~/.local/share ~/.var
$ ln -sfn "$GOINFRE/flatpak" ~/.local/share/flatpak
$ ln -sfn "$GOINFRE/var-app" ~/.var/app
```

> [!CAUTION]
> `~/.local/share/flatpak` veya `~/.var/app` önceden **gerçek bir klasör**
> olarak varsa `ln` onun yerini almaz, bağlantıyı klasörün içine oluşturur.
> Önce kontrol edin:
>
> ```bash
> $ ls -ld ~/.local/share/flatpak ~/.var/app
> ```
>
> Satır `d` ile başlıyorsa (klasörse) içindekileri yedekleyip kenara alın,
> ör. `mv ~/.var/app ~/.var/app.yedek`, sonra yukarıdaki komutları tekrar
> çalıştırın. Doğru kurulumda satırlar `l` ile başlar ve `-> /goinfre/...` gösterir.

> [!TIP]
> `goinfre`'nin yolu ve ne zaman temizlendiği kampüse göre değişebilir. Emin
> değilseniz `ls -ld /goinfre/$USER` ile kontrol edin ya da staff'a sorun.

## 2. Bottles'ı kurma

Flathub deposunu kullanıcı hesabınıza ekleyip Bottles'ı kurun:

```bash
$ flatpak remote-add --user --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
$ flatpak install --user -y flathub com.usebottles.bottles
```

Kurulum birkaç dakika sürebilir. Bittiğinde Bottles'ı açın:

```bash
$ flatpak run com.usebottles.bottles
```

İlk açılışta Bottles, Wine çalıştırıcısını (runner) ve gerekli bileşenleri
indirir. **İleri** diyerek kurulumu tamamlayın.

## 3. CS 1.6 için bottle oluşturma

1. Bottles'ta **+** (Yeni Bottle) butonuna basın.
2. Ad: `cs16`
3. Ortam (Environment): **Gaming**
4. **Oluştur** deyin ve hazırlanmasını bekleyin.

## 4. Steam'i kurma

1. `cs16` bottle'ını açın.
2. **Programları Yükle** (Install Programs) bölümüne girin.
3. Listeden **Steam**'i bulup **Yükle** deyin.
4. Kurulum bitince bottle'ın **Programlar** listesinde Steam görünür; **▶** ile başlatın.
5. Steam hesabınızla giriş yapın.

> [!TIP]
> Steam penceresi siyah ya da boş açılırsa: Programlar listesinde Steam'in
> yanındaki **⋮ → Değiştir** (Change Launch Options) menüsüne girip komut
> satırı argümanlarına `-no-cef-sandbox` ekleyin ve Steam'i yeniden başlatın.

## 5. Counter-Strike 1.6'yı kurma

1. Steam'de **Kütüphane**'ye gidin.
2. **Counter-Strike**'ı seçip **Yükle** deyin.
3. Kurulum klasörü olarak varsayılanı bırakın (bottle'ın içi, yani `goinfre`).
4. İndirme bitince **Oyna** deyin.

### Önerilen oyun ayarları

Oyun açıldıktan sonra **Options → Video**:

| Ayar         | Öneri                     |
| ------------ | ------------------------- |
| Renderer     | OpenGL                    |
| Çözünürlük   | Ekranın kendi çözünürlüğü |
| Wait for VSync | Kapalı                  |

Konsol (`~`) üzerinden:

```cfg
fps_max 100
cl_cmdrate 101
cl_updaterate 101
rate 25000
```

## 6. Kulüp sunucusuna bağlanma

Oyun içinde `~` tuşuyla konsolu açıp yazın:

```cfg
connect 45.74.244.214:27015
```

Ya da **Find Servers → Favorites → Add a Server** ile adresi favorilere ekleyin.

### Oyunu doğrudan sunucuya bağlanarak açma

Steam'de **Counter-Strike → Özellikler → Başlatma seçenekleri** kutusuna:

```cfg
+connect 45.74.244.214:27015
```

Bundan sonra **Oyna** dediğinizde oyun doğrudan sunucuya bağlanır.

## 7. Masaüstü kısayolu

Bottles'ta Steam'in yanındaki **⋮ → Masaüstü girdisi ekle** (Add Desktop Entry)
ile uygulama menüsüne kısayol ekleyebilirsiniz. Terminalden açmak için:

```bash
$ flatpak run com.usebottles.bottles
```

## Başka bilgisayara geçince

`goinfre` bilgisayara özeldir: başka bir cluster bilgisayarına oturduğunuzda
kurulum orada olmaz ve bazı kampüslerde `goinfre` belirli aralıklarla
temizlenir. Yeni bilgisayarda **1. ve 2. adımları** tekrar çalıştırmanız,
ardından bottle'ı yeniden oluşturmanız gerekir.

> [!TIP]
> Bottles'ın **Yedekler** (Backups) özelliğiyle bottle'ı tek dosya olarak
> dışa aktarıp `sgoinfre`'ye koyabilirsiniz. Yeni bilgisayarda **İçe aktar**
> ile Steam'i ve oyunu tekrar indirmeden geri yükleyebilirsiniz (`sgoinfre`
> kotası ve hızı kampüse göre değişir).

## Kaldırma

```bash
$ flatpak uninstall --user -y com.usebottles.bottles
$ rm -rf "/goinfre/$USER/var-app/com.usebottles.bottles"
```

> [!CAUTION]
> İkinci komut tüm bottle'ları (Steam ve oyun dahil) siler.

## Sorun giderme

### "Disk quota exceeded" hatası

Flatpak verileri home'a yazılıyor demektir. **1. adımı** kontrol edin:

```bash
$ ls -l ~/.local/share/flatpak ~/.var/app
```

Her iki satırda da `-> /goinfre/...` görmelisiniz.

### `flatpak: command not found`

Bilgisayarda Flatpak kurulu değil. Başka bir cluster bilgisayarı deneyin ya da
staff'a sorun.

### Oyun açılıyor ama çok yavaş

- **Options → Video → Renderer** ayarını **OpenGL** yapın.
- Bottles'ta bottle ayarlarından **Ayrık GPU** (Discrete GPU) seçeneği varsa açın.
- `fps_max 100` ayarlı olduğundan emin olun.

### Ses yok

Bottle ayarlarında **Ses** bölümünden ses sürücüsünü değiştirip (ör. PulseAudio)
oyunu yeniden başlatın.

### Sunucuya bağlanamıyorum

Sunucunun açık olduğunu sitenin **Counter-Strike 1.6** sayfasındaki
GameTracker kartından kontrol edin. Kampüs ağında oyun portları kapalıysa
bağlantı kurulamaz; bu durumda staff'a danışın.
