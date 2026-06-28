// ─── Sabit Veriler ───
const berberler = [
  {
    id: "B01", ad: "Maestro Barber", ilce: "Beşiktaş",
    adres: "Sinanpaşa Mah. Çırağan Cad. No:12", telefon: "0212 555 01 01",
    puan: 4.8, yorumSayisi: 124,
    uzmanlik: ["klasik tıraş", "fade", "sakal şekillendirme"],
    aciklama: "Beşiktaş'ın en köklü berberlerinden biri. Klasik ve modern kesimlerde 15 yıllık deneyim.",
    resim: null, calisma: { baslangic: 9, bitis: 20, araMola: [] },
    seans: 30, fiyat: 150, renk: "#1a1a2e"
  },
  {
    id: "B02", ad: "Vintage Cut", ilce: "Kadıköy",
    adres: "Moda Cad. No:45", telefon: "0216 444 02 02",
    puan: 4.6, yorumSayisi: 89,
    uzmanlik: ["undercut", "pompadour", "sakal", "boya"],
    aciklama: "Moda'nın retro ruhunu yansıtan butik berber salonu. Pompadour ve undercut uzmanı.",
    resim: null, calisma: { baslangic: 10, bitis: 21, araMola: [] },
    seans: 45, fiyat: 200, renk: "#2d4a22"
  },
  {
    id: "B03", ad: "The Gentleman", ilce: "Şişli",
    adres: "Halaskargazi Cad. No:78", telefon: "0212 333 03 03",
    puan: 4.9, yorumSayisi: 201,
    uzmanlik: ["klasik kesim", "çocuk kesimi", "düz kesim"],
    aciklama: "Şişli'nin en yüksek puanlı berberi. Aile dostu ortam, çocuk kesiminde uzman ekip.",
    resim: null, calisma: { baslangic: 8, bitis: 19, araMola: [13] },
    seans: 30, fiyat: 120, renk: "#1a3a4a"
  },
  {
    id: "B04", ad: "BarberKing", ilce: "Üsküdar",
    adres: "Büyük Hamam Sok. No:3", telefon: "0216 222 04 04",
    puan: 4.5, yorumSayisi: 67,
    uzmanlik: ["fade", "dreadlocks", "boya", "keratin"],
    aciklama: "Üsküdar'ın trend berberi. Dreadlocks, keratin ve renk işlemlerinde İstanbul'un en iyilerinden.",
    resim: null, calisma: { baslangic: 9, bitis: 20, araMola: [] },
    seans: 60, fiyat: 250, renk: "#3a1a2e"
  },
  {
    id: "B05", ad: "Klasik Usta", ilce: "Fatih",
    adres: "Aksaray Mah. İnönü Cad. No:22", telefon: "0212 111 05 05",
    puan: 4.7, yorumSayisi: 155,
    uzmanlik: ["klasik tıraş", "jilet tıraş", "sakal"],
    aciklama: "Fatih'in geleneksel berber kültürünü yaşatan usta işletme. Jilet tıraşta eşsiz deneyim.",
    resim: null, calisma: { baslangic: 8, bitis: 18, araMola: [12] },
    seans: 30, fiyat: 100, renk: "#2a2a1a"
  },
  {
    id: "B06", ad: "Modern Blade", ilce: "Sarıyer",
    adres: "Yeniköy Cad. No:8", telefon: "0212 777 06 06",
    puan: 4.4, yorumSayisi: 43,
    uzmanlik: ["modern kesim", "fade", "highlight"],
    aciklama: "Sarıyer'in modern berber deneyimi. Highlight ve fade konusunda genç ve dinamik ekip.",
    resim: null, calisma: { baslangic: 10, bitis: 20, araMola: [] },
    seans: 45, fiyat: 180, renk: "#1a2a3a"
  }
];

// Yerel tarih formatı (UTC kayması olmadan)
function yerelTarihStr(tarih) {
  const d = tarih || new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const g = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${g}`;
}

// Demo randevuları bugünden itibaren dinamik tarihlerle oluştur
function demoTarih(gunEkle) {
  const d = new Date();
  d.setDate(d.getDate() + gunEkle);
  return yerelTarihStr(d);
}

const BASLANGIC_RANDEVULAR = [
  { id: "R001", berberId: "B01", tarih: demoTarih(1), saat: "10:00", musteriAd: "Ahmet Yılmaz", telefon: "0532 100 0001", islem: "Saç + Sakal" },
  { id: "R002", berberId: "B01", tarih: demoTarih(1), saat: "10:30", musteriAd: "Mert Kaya", telefon: "0533 100 0002", islem: "Fade" },
  { id: "R003", berberId: "B01", tarih: demoTarih(1), saat: "14:00", musteriAd: "Can Demir", telefon: "0535 100 0003", islem: "Klasik Kesim" },
  { id: "R004", berberId: "B02", tarih: demoTarih(1), saat: "11:00", musteriAd: "Emre Şahin", telefon: "0536 100 0004", islem: "Undercut" },
  { id: "R005", berberId: "B02", tarih: demoTarih(2), saat: "10:00", musteriAd: "Ali Öztürk", telefon: "0537 100 0005", islem: "Pompadour" },
  { id: "R006", berberId: "B03", tarih: demoTarih(1), saat: "09:00", musteriAd: "Burak Çelik", telefon: "0538 100 0006", islem: "Klasik Kesim" },
  { id: "R007", berberId: "B03", tarih: demoTarih(1), saat: "09:30", musteriAd: "Kemal Aydın", telefon: "0539 100 0007", islem: "Çocuk Kesimi" },
  { id: "R008", berberId: "B04", tarih: demoTarih(3), saat: "11:00", musteriAd: "Hasan Arslan", telefon: "0541 100 0008", islem: "Boya" }
];

const adminler = [
  { kullaniciAdi: "maestro",    sifre: "1234", berberId: "B01" },
  { kullaniciAdi: "vintage",    sifre: "1234", berberId: "B02" },
  { kullaniciAdi: "gentleman",  sifre: "1234", berberId: "B03" },
  { kullaniciAdi: "barberking", sifre: "1234", berberId: "B04" },
  { kullaniciAdi: "klasik",     sifre: "1234", berberId: "B05" },
  { kullaniciAdi: "modern",     sifre: "1234", berberId: "B06" }
];

const YORUMLAR = [
  { berberId: "B01", ad: "Serkan T.", puan: 5, metin: "Fade mükemmeldi, çok memnun kaldım." },
  { berberId: "B01", ad: "Oğuz K.", puan: 5, metin: "Profesyonel ekip, temiz ortam." },
  { berberId: "B03", ad: "Mehmet A.", puan: 5, metin: "Oğlumu götürdüm, çok sabırlılar." },
  { berberId: "B02", ad: "Deniz Y.", puan: 4, metin: "Pompadour harika oldu, tavsiye ederim." },
  { berberId: "B05", ad: "Hakan B.", puan: 5, metin: "Jilet tıraş efsane, her ay geliyorum." }
];

// Sayfalar arası veri paylaşımı (localStorage — tarayıcı kapanana kadar kalıcı)
const RANDEVU_KEY = "berberbul_randevular";

function randevulariYukle() {
  try {
    const kayit = localStorage.getItem(RANDEVU_KEY);
    if (kayit) {
      const liste = JSON.parse(kayit);
      if (Array.isArray(liste)) return liste;
    }
    // Eski sessionStorage verisini taşı
    const eski = sessionStorage.getItem("berberbul_randevular");
    if (eski) {
      const liste = JSON.parse(eski);
      if (Array.isArray(liste)) {
        localStorage.setItem(RANDEVU_KEY, eski);
        sessionStorage.removeItem("berberbul_randevular");
        return liste;
      }
    }
  } catch (e) {
    console.warn("Randevu verisi okunamadı:", e);
  }
  const baslangic = [...BASLANGIC_RANDEVULAR];
  localStorage.setItem(RANDEVU_KEY, JSON.stringify(baslangic));
  return baslangic;
}

function randevulariKaydet(liste) {
  localStorage.setItem(RANDEVU_KEY, JSON.stringify(liste));
  // Diğer sekmelerdeki admin panelini güncelle
  window.dispatchEvent(new CustomEvent("randevuGuncellendi", { detail: liste }));
}

function randevuDegisikligiDinle(callback) {
  window.addEventListener("randevuGuncellendi", (e) => callback(e.detail));
  window.addEventListener("storage", (e) => {
    if (e.key === RANDEVU_KEY) callback(randevulariYukle());
  });
}

let randevular = randevulariYukle();

// AI önerisi rozetleri
function aiOnerileriYukle() {
  const kayit = sessionStorage.getItem("berberbul_ai_oneri");
  return kayit ? JSON.parse(kayit) : [];
}

function aiOnerileriKaydet(liste) {
  sessionStorage.setItem("berberbul_ai_oneri", JSON.stringify(liste));
}

let aiOnerilenBerberler = aiOnerileriYukle();
