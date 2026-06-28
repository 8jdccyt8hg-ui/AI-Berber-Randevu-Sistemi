let aktifBerberId = null;
let seciliSaat = null;

function detaySayfasiYukle() {
  const id = urlParam("id");
  if (!id) { window.location.href = "berberler.html"; return; }

  const b = berberBul(id);
  if (!b) { window.location.href = "berberler.html"; return; }

  aktifBerberId = id;

  document.title = `${b.ad} — BerberBul İstanbul`;

  const banner = document.getElementById("detayBanner");
  if (banner) banner.style.background = `linear-gradient(160deg,${b.renk} 0%,${b.renk}88 100%)`;

  const avatar = document.getElementById("detayAvatar");
  if (avatar) {
    avatar.textContent = berberBasHarfler(b.ad);
    avatar.style.background = `linear-gradient(135deg,${b.renk},${b.renk}99)`;
  }

  document.getElementById("detayAd").textContent = b.ad;
  document.getElementById("detayIlce").textContent = `📍 ${b.ilce}`;
  document.getElementById("detayPuan").textContent = b.puan;
  document.getElementById("detayYorum").textContent = b.yorumSayisi;
  document.getElementById("detayFiyat").textContent = b.fiyat + "₺";
  document.getElementById("detaySeans").textContent = b.seans + " dk";
  document.getElementById("detayAciklama").textContent = b.aciklama;
  document.getElementById("detayAdres").textContent = b.adres;
  document.getElementById("detayTelefon").textContent = b.telefon;
  document.getElementById("detaySaat").textContent =
    `${b.calisma.baslangic}:00 — ${b.calisma.bitis}:00`;

  const uzmanlik = document.getElementById("detayUzmanlik");
  if (uzmanlik) uzmanlik.innerHTML = b.uzmanlik.map(u => `<span class="badge">${u}</span>`).join("");

  const yorumlar = YORUMLAR.filter(y => y.berberId === id);
  const yorumEl = document.getElementById("detayYorumlar");
  if (yorumEl) {
    yorumEl.innerHTML = yorumlar.length
      ? yorumlar.map(y => `
          <div class="review-card">
            <div class="review-header">
              <span class="review-author">${y.ad}</span>
              <span class="review-stars">${"★".repeat(y.puan)}</span>
            </div>
            <p class="review-text">${y.metin}</p>
          </div>`).join("")
      : '<p style="color:var(--text-muted);font-size:0.9rem;">Henüz yorum yok.</p>';
  }

  const tarihInput = document.getElementById("modalTarih");
  if (tarihInput) {
    tarihInput.min = bugunStr();
    tarihInput.value = bugunStr();
    modalTarihDegisti();
  }
}

function modalTarihDegisti() {
  const tarih = document.getElementById("modalTarih").value;
  if (!tarih || !aktifBerberId) return;

  const tumSlotlar = tumSlotlariHesapla(aktifBerberId, tarih);
  const bosSlotlar = bosSlotlariHesapla(aktifBerberId, tarih);
  const grid = document.getElementById("slotGrid");

  grid.innerHTML = tumSlotlar.map(s => {
    const bos = bosSlotlar.includes(s);
    return bos
      ? `<button class="slot-pill" onclick="saatSec('${s}')" data-saat="${s}">${s}</button>`
      : `<button class="slot-pill disabled" disabled>${s}</button>`;
  }).join("");

  seciliSaat = null;
  document.getElementById("randevuForm").style.display = "none";
  guncelleAdimlar(1);
}

function saatSec(saat) {
  seciliSaat = saat;
  document.querySelectorAll("#slotGrid .slot-pill").forEach(p => {
    p.classList.toggle("selected", p.dataset.saat === saat);
  });
  document.getElementById("randevuForm").style.display = "block";
  guncelleAdimlar(2);
}

function guncelleAdimlar(adim) {
  document.querySelectorAll(".step-dot").forEach((d, i) => {
    d.classList.toggle("active", i === adim);
    d.classList.toggle("done", i < adim);
  });
}

function randevuAl() {
  if (!aktifBerberId || !seciliSaat) return;

  const ad = document.getElementById("formAd").value.trim();
  const tel = document.getElementById("formTel").value.trim();
  const islem = document.getElementById("formIslem").value.trim();
  const tarih = document.getElementById("modalTarih").value;

  if (!ad || !tel || !islem) {
    alert("Lütfen tüm alanları doldurun.");
    return;
  }

  if (slotDoluMu(aktifBerberId, tarih, seciliSaat)) {
    alert("Bu saat az önce dolmuş. Lütfen başka bir saat seçin.");
    modalTarihDegisti();
    return;
  }

  randevular = randevulariYukle();
  const yeniRandevu = {
    id: yeniRandevuId(),
    berberId: aktifBerberId,
    tarih,
    saat: seciliSaat,
    musteriAd: ad,
    telefon: tel,
    islem
  };
  randevular.push(yeniRandevu);
  randevulariKaydet(randevular);

  const berber = berberBul(aktifBerberId);
  const msg = document.getElementById("randevuSuccess");
  msg.textContent = `Randevunuz alındı! ${berber.ad} — ${tarihFormatla(tarih)} ${seciliSaat}. Berber panelinde görünecektir.`;
  msg.classList.add("active");
  guncelleAdimlar(3);

  document.getElementById("formAd").value = "";
  document.getElementById("formTel").value = "";
  document.getElementById("formIslem").value = "";

  // Slotları hemen güncelle — dolu saat gri görünsün
  modalTarihDegisti();

  setTimeout(() => msg.classList.remove("active"), 5000);
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("detayAd")) detaySayfasiYukle();
  if (window.location.hash === "#randevu") {
    setTimeout(() => {
      document.getElementById("randevu")?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  }
});
