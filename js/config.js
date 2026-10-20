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
