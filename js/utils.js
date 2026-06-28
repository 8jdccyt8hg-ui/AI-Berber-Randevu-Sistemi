const AYLAR = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
const GUNLER = ["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"];

function bugunStr() {
  return yerelTarihStr();
}

function tarihFormatla(tarih) {
  const [y, m, g] = tarih.split("-").map(Number);
  const d = new Date(y, m - 1, g);
  return `${g} ${AYLAR[m - 1]} ${y}, ${GUNLER[d.getDay()]}`;
}

function saatStr(saat, dakika) {
  return String(saat).padStart(2, "0") + ":" + String(dakika).padStart(2, "0");
}

function berberBul(id) {
  return berberler.find(b => b.id === id);
}

function berberBasHarfler(ad) {
  return ad.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

function tumSlotlariHesapla(berberId, tarih) {
  const berber = berberBul(berberId);
  if (!berber) return [];
  const { baslangic, bitis, araMola } = berber.calisma;
  const seans = berber.seans;
  const slotlar = [];
  let dakikaToplam = baslangic * 60;
  const bitisDakika = bitis * 60;
  while (dakikaToplam + seans <= bitisDakika) {
    const saat = Math.floor(dakikaToplam / 60);
    const dk = dakikaToplam % 60;
    if (!araMola.includes(saat)) slotlar.push(saatStr(saat, dk));
    dakikaToplam += seans;
  }
  return slotlar;
}

function bosSlotlariHesapla(berberId, tarih) {
  randevular = randevulariYukle();
  const tumSlotlar = tumSlotlariHesapla(berberId, tarih);
  const doluSaatler = randevular
    .filter(r => r.berberId === berberId && r.tarih === tarih)
    .map(r => r.saat);
  return tumSlotlar.filter(s => !doluSaatler.includes(s));
}

function yeniRandevuId() {
  const liste = randevulariYukle();
  let max = 0;
  liste.forEach(r => {
    const num = parseInt(r.id.replace(/\D/g, ""), 10);
    if (num > max) max = num;
  });
  return "R" + String(max + 1).padStart(3, "0");
}

function slotDoluMu(berberId, tarih, saat) {
  return randevulariYukle().some(
    r => r.berberId === berberId && r.tarih === tarih && r.saat === saat
  );
}

function urlParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function aktifSayfa() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  return path;
}
