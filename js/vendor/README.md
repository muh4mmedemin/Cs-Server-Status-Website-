# Harici kütüphaneler

Dokümanlar sayfası için, internet bağlantısına (CDN) ihtiyaç duymadan
çalışsın diye repoya konmuş hazır dosyalar. Elle düzenlemeyin.

| Dosya              | Kütüphane                                          | Sürüm   | Lisans       |
| ------------------ | -------------------------------------------------- | ------- | ------------ |
| `marked.min.js`    | [marked](https://github.com/markedjs/marked) (Markdown → HTML) | 12.0.2  | MIT          |
| `highlight.min.js` | [highlight.js](https://highlightjs.org/) (kod renklendirme)    | 11.9.0  | BSD-3-Clause |

Güncellemek için: `npm pack marked@<sürüm>` / `@highlightjs/cdn-assets@<sürüm>`
paketlerindeki `marked.min.js` ve `highlight.min.js` dosyalarını buraya kopyalayın.
