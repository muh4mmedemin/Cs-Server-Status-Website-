// ---- Sunucu ayarları ----
// Her oyun için IP ve portu buradan girin. IP boş ("") bırakılırsa
// o oyunun sayfasında "IP ayarlanmadı" uyarısı gösterilir.
//
// connect: "steam" → Bağlan butonu steam://connect/IP:PORT açar
//          null    → Bağlan butonu gizlenir (oyun içinden bağlanılır)
// howto:   "Nasıl Bağlanırım?" adımları. {address} yazan yere IP:PORT gelir.

const REFRESH_SECONDS = 60; // GameTracker banner'ının yenilenme aralığı

// ---- 42 kulüp sayfası: sitenin ana sayfası (sol üstteki "42" butonu) ----
const CLUB = {
  name: "42 Oyun Kulübü",
  about:
    "42 öğrencilerinin oyun kulübü. Sunucularımız herkese açık; " +
    "cluster'dan çıkınca bir maça bekleriz.",
  // Kulüp linkleri, ör: { label: "Discord", url: "https://discord.gg/..." }
  links: [],
};

// ---- Yapımlar: harita, mod, skin, plugin, build... ----
// Her yapım için listeye bir blok ekleyin; oyunun sayfasındaki "Yapımlar"
// sekmesinde ve ana sayfada kart olarak görünür. Karta tıklayınca yapımın
// kendi sayfası açılır (link: #yapim/<id>). Dosyaları works/<oyun>/ klasörüne
// koyun (ayrıntılar: works/README.md).
//
// game:        hangi oyunun yapımı (aşağıdaki SERVERS içindeki id: cs16, cs2, minecraft, rust, arma3)
// title:       yapımın adı
// id:          sayfa linki, ör. "de_kulup42" → #yapim/de_kulup42 (isteğe bağlı; yoksa addan üretilir)
// type:        kısa etiket, ör. "Harita", "Mod", "Skin", "Plugin", "Build"
// description: kartta ve sayfanın başında görünen kısa açıklama (bir iki cümle)
// image:       kapak görseli (isteğe bağlı; yoksa oyunun arka planı kullanılır)
// gallery:     yapım sayfasındaki fotoğraflar listesi; ilki kapak olur (isteğe bağlı)
// video:       YouTube linki; sayfada oynatıcı olarak görünür (isteğe bağlı)
// details:     yapım sayfasındaki uzun açıklama (isteğe bağlı). Ters tırnak (`) içinde
//              birden fazla satır yazabilirsiniz:
//                boş satır  → yeni paragraf
//                ## Başlık  → ara başlık
//                - madde    → madde işaretli liste
//                **kalın**  → kalın yazı
// specs:       yan paneldeki bilgi tablosu, ör. { "Oyuncu": "5v5", "Mod": "Bomba" } (isteğe bağlı)
// download:    indirme dosyası (works/ altında) ya da harici link (isteğe bağlı)
// date:        "YYYY-AA" biçiminde tarih; ana sayfada yeniden eskiye sıralanır
//
// Örnek (başındaki // işaretlerini kaldırıp düzenleyin):
//   {
//     game: "cs16",
//     title: "de_kulup42",
//     type: "Harita",
//     description: "42 kampüsünden esinlenen 5v5 bomba haritası.",
//     image: "works/cs16/de_kulup42.jpg",
//     gallery: [
//       "works/cs16/de_kulup42.jpg",
//       "works/cs16/de_kulup42-a.jpg",
//       "works/cs16/de_kulup42-b.jpg",
//     ],
//     video: "https://www.youtube.com/watch?v=XXXXXXXXXXX",
//     details: `
//       Haritayı kampüsün koridorlarından esinlenerek yaptık.
//
//       ## Bölgeler
//       - **A bölgesi:** cluster girişi
//       - **B bölgesi:** kafeterya
//
//       ## Kurulum
//       Zip'i açıp içindekileri cstrike klasörüne kopyalayın.
//     `,
//     specs: { "Oyuncu": "5v5", "Mod": "Bomba (de_)", "Boyut": "Orta" },
//     download: "works/cs16/de_kulup42.zip",
//     date: "2026-11",
//   },

const WORKS = [
  {
    game: "cs16",
    title: "istanbul_42",
    type: "Harita",
    description: "Kısa bir açıklama.",
    image: "works/cs16/istanbul_42.jpg",
    download: "works/cs16/istanbul_42.zip",
    date: "2026-11",
  },
];

const SERVERS = [
  {
    id: "cs16",
    name: "Counter-Strike 1.6",
    ip: "45.74.244.214",
    port: 27015,
    connect: "steam",
    rules: [
      "Hile (cheat, script, config hilesi) kullanmak yasaktır.",
      "Küfür, hakaret ve aşağılayıcı söylemler yasaktır.",
      "Takım arkadaşlarına bilerek zarar vermek (team kill/flash) yasaktır.",
      "Mikrofonu spam amaçlı kullanmak yasaktır.",
      "Reklam yapmak yasaktır.",
      "Adminlerin uyarılarına uyunuz.",
    ],
    howto: [
      "Yukarıdaki <b>Bağlan</b> butonuna basın (Steam yüklü olmalı).",
      "Oyunu açın, <b>~</b> tuşuyla konsolu açın ve şunu yazın: <code>connect {address}</code>",
      "<i>Find Servers &rarr; Favorites &rarr; Add a Server</i> ile IP'yi favorilere ekleyin.",
    ],
  },
  {
    id: "cs2",
    name: "Counter-Strike 2",
    ip: "",
    port: 27015,
    connect: "steam",
    rules: [
      "Hile ve üçüncü parti yazılım kullanmak yasaktır.",
      "Küfür, hakaret ve aşağılayıcı söylemler yasaktır.",
      "Bilerek takım arkadaşına hasar vermek yasaktır.",
      "Sesli sohbeti spam amaçlı kullanmak yasaktır.",
      "Adminlerin uyarılarına uyunuz.",
    ],
    howto: [
      "Yukarıdaki <b>Bağlan</b> butonuna basın (Steam yüklü olmalı).",
      "Ayarlardan geliştirici konsolunu açın, <b>~</b> tuşuna basın ve yazın: <code>connect {address}</code>",
    ],
  },
  {
    id: "minecraft",
    name: "Minecraft",
    ip: "",
    port: 25565,
    connect: null,
    rules: [
      "Griefing (başkalarının yapılarını bozmak) yasaktır.",
      "Hile, X-Ray ve hileli istemci kullanmak yasaktır.",
      "Küfür, hakaret ve spam yasaktır.",
      "Bug/dupe açıklarını kullanmak yasaktır; görürseniz yetkililere bildirin.",
      "Yetkililerin uyarılarına uyunuz.",
    ],
    howto: [
      "Minecraft'ı açın ve <b>Çok Oyunculu</b> (Multiplayer) menüsüne girin.",
      "<b>Sunucu Ekle</b> (Add Server) deyin ve adres kısmına yazın: <code>{address}</code>",
      "Kaydedin, listeden sunucuyu seçip <b>Sunucuya Katıl</b> deyin.",
    ],
  },
  {
    id: "rust",
    name: "Rust",
    ip: "",
    port: 28015,
    connect: null,
    rules: [
      "Hile, makro ve script kullanmak yasaktır.",
      "Takım limiti aşılamaz; ittifak yapmak yasaktır.",
      "Irkçılık, küfür ve hakaret yasaktır.",
      "Bug/exploit kullanmak yasaktır.",
      "Yetkililerin uyarılarına uyunuz.",
    ],
    howto: [
      "Rust'ı açın, <b>F1</b> tuşuyla konsolu açın.",
      "Şunu yazıp Enter'a basın: <code>client.connect {address}</code>",
      "Ya da sunucu listesinde aratıp <b>favorilere</b> ekleyin.",
    ],
  },
  {
    id: "arma3",
    name: "Arma 3",
    ip: "",
    port: 2302,
    connect: null,
    rules: [
      "Hile ve script kullanmak yasaktır.",
      "Bilerek dost ateşi (team kill) yasaktır.",
      "Telsiz/sesli sohbet disiplinine uyunuz.",
      "Rol yapma kurallarına (varsa) uyunuz.",
      "Yetkililerin uyarılarına uyunuz.",
    ],
    howto: [
      "Arma 3'ü açın ve <b>Multiplayer &rarr; Server Browser</b> menüsüne girin.",
      "<b>Direct Connect</b> butonuna basın.",
      "Adresi girin: <code>{address}</code> ve bağlanın.",
    ],
  },
];
