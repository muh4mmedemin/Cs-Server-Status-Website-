# Doküman nasıl yazılır?

Bu sitedeki dokümanlar, `docs/` klasöründeki **Markdown** (`.md`) dosyalarıdır.
Cluster'da oyun çalıştırmak için yazdığınız betiklerin ve sistemlerin kurulumunu
anlatmak için yeni bir dosya açıp yazmanız yeterli.

## Yeni doküman ekleme

1. `docs/_sablon.md` dosyasını kopyalayıp yeniden adlandırın:

   ```bash
   $ cp docs/_sablon.md docs/cs16-cluster-kurulum.md
   ```

2. Dosyayı düzenleyin (aşağıdaki yazım kurallarına bakın).
3. `js/config.js` içindeki `DOCS` listesine bir blok ekleyin:

   ```js
   {
     id: "cs16-cluster-kurulum",
     title: "CS 1.6'yı cluster'da çalıştırma",
     file: "docs/cs16-cluster-kurulum.md",
     description: "Kurulum betiği ve ilk ayarlar.",
     game: "cs16",
     tags: ["bash", "cluster"],
     date: "2026-11",
   },
   ```

4. Commit + push. Doküman ana sayfada `$ ls dokumanlar/` altında görünür.

> [!TIP]
> `game` alanını yazarsanız doküman o oyunun rengini alır ve listede oyunun adı görünür.

## Yazım kuralları

### Başlıklar

`##` ile ana bölüm, `###` ile alt bölüm açılır. Sağdaki **İçindekiler** listesi
bu başlıklardan otomatik oluşur. Dosyanın en üstündeki `#` başlık sayfada zaten
göründüğü için tekrar gösterilmez.

### Metin

| Yazılan                          | Görünen                          |
| -------------------------------- | -------------------------------- |
| `**kalın**`                      | **kalın**                        |
| `*eğik*`                         | *eğik*                           |
| `` `komut` ``                    | `komut`                          |
| `[bağlantı](https://github.com)` | [bağlantı](https://github.com)   |

Başka bir dokümana bağlantı vermek için `[şablon](_sablon.md)` gibi dosya adını yazmanız yeterli.

### Kod blokları

Kod bloğu, üç ters tırnakla ve dilin adıyla açılıp üç ters tırnakla kapanır
(örnek aşağıda). Her kod bloğunun sağ üstünde **Kopyala** butonu çıkar. `bash`
bloklarında satır başındaki `$ ` işareti kopyalanmaz, yani okuyan kişi komutu
doğrudan yapıştırabilir.

````markdown
```bash
$ git clone https://github.com/kullanici/proje.git
$ cd proje && ./kurulum.sh
```
````

Görünümü:

```bash
$ git clone https://github.com/kullanici/proje.git
$ cd proje && ./kurulum.sh
```

Renklendirilen bazı diller: `bash`, `sh`, `python`, `js`, `json`, `yaml`, `ini`,
`c`, `cpp`, `makefile`, `dockerfile`.

### Not kutuları

```markdown
> [!NOTE]
> Bilgi notu.

> [!TIP]
> İpucu.

> [!WARNING]
> Uyarı.

> [!CAUTION]
> Dikkat: geri alınamaz işlem.
```

> [!NOTE]
> Bilgi notu.

> [!WARNING]
> Betikleri çalıştırmadan önce içeriğini okuyun.

> [!CAUTION]
> `rm -rf` gibi komutları kopyalarken iki kez kontrol edin.

### Tablolar

```markdown
| Ayar      | Varsayılan | Açıklama            |
| --------- | ---------- | ------------------- |
| `PORT`    | `27015`    | Sunucu portu        |
| `MAXPLAY` | `16`       | En fazla oyuncu     |
```

| Ayar      | Varsayılan | Açıklama            |
| --------- | ---------- | ------------------- |
| `PORT`    | `27015`    | Sunucu portu        |
| `MAXPLAY` | `16`       | En fazla oyuncu     |

### Yapılacaklar listesi

- [x] Betiği yaz
- [ ] Dokümanı ekle

### Görseller

Ekran görüntülerini `docs/img/` klasörüne koyun ve şöyle ekleyin:

```markdown
![Kurulum ekranı](img/kurulum.png)
```

Yol, `.md` dosyasının bulunduğu klasöre göredir.
