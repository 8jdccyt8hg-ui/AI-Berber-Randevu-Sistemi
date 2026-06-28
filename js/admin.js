let aktifAdminBerberId = null;

function adminKontrol() {
  const kayit = sessionStorage.getItem("berberbul_admin");
  if (!kayit && aktifSayfa() === "admin-panel.html") {
    window.location.href = "admin-giris.html";
    return false;
  }
  if (kayit) aktifAdminBerberId = kayit;
  return true;
}

function girisYap() {
  const kullanici = document.getElementById("adminKullanici").value.trim();
  const sifre = document.getElementById("adminSifre").value;
  const hata = document.getElementById("girisHata");

  const admin = adminler.find(a => a.kullaniciAdi === kullanici && a.sifre === sifre);
  if (!admin) {
    hata.classList.add("active");
    return;
  }

  sessionStorage.setItem("berberbul_admin", admin.berberId);
  window.location.href = "admin-panel.html";
}

function cikisYap() {
  sessionStorage.removeItem("berberbul_admin");
  window.location.href = "index.html";
}

function adminPanelBaslat() {
  if (!adminKontrol()) return;

  const berber = berberBul(aktifAdminBerberId);
  document.getElementById("adminBerberAd").textContent = berber.ad;
  document.getElementById("sidebarBerberAd").textContent = berber.ad;
  document.getElementById("sidebarIlce").textContent = berber.ilce;

  adminPanelGuncelle();
  adminTabBaslat();
}

function adminTabAc(tab) {
  document.querySelectorAll(".admin-nav a, .admin-mobile-tabs button").forEach(l => {
    l.classList.toggle("active", l.dataset.tab === tab);
  });
  document.querySelectorAll(".admin-tab").forEach(t => t.classList.remove("active"));
  document.getElementById("tab-" + tab)?.classList.add("active");
}

function adminTabBaslat() {
  document.querySelectorAll(".admin-nav a, .admin-mobile-tabs button").forEach(link => {
    link.addEventListener("click", () => adminTabAc(link.dataset.tab));
  });
}

function sonRandevulariGoster() {
  const el = document.getElementById("sonRandevular");
  if (!el || !aktifAdminBerberId) return;

  randevular = randevulariYukle();
  const liste = randevular
    .filter(r => r.berberId === aktifAdminBerberId)
    .sort((a, b) => a.tarih !== b.tarih ? b.tarih.localeCompare(a.tarih) : b.saat.localeCompare(a.saat))
    .slice(0, 5);

  if (!liste.length) {
    el.innerHTML = '<p style="color:var(--text-muted);font-size:0.9rem;">Henüz randevu yok.</p>';
    return;
  }

  el.innerHTML = liste.map(r => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--border);font-size:0.88rem;">
      <div>
        <strong>${r.musteriAd}</strong>
        <span style="color:var(--text-muted);display:block;font-size:0.8rem;">${r.islem}</span>
      </div>
      <div style="text-align:right;">
        <span style="font-weight:600;">${r.saat}</span>
        <span style="color:var(--text-muted);display:block;font-size:0.78rem;">${tarihFormatla(r.tarih)}</span>
      </div>
    </div>
  `).join("");
}

function adminPanelGuncelle() {
  randevular = randevulariYukle();
  adminIstatistikGuncelle();
  const takvimTarih = document.getElementById("adminTakvimTarih");
  if (takvimTarih) {
    takvimTarih.min = bugunStr();
    if (!takvimTarih.value) takvimTarih.value = bugunStr();
    adminTakvimGuncelle();
  }
  randevuListesiGuncelle();
  haftaAnalizi();
  sonRandevulariGoster();
}

function adminIstatistikGuncelle() {
  const bugun = bugunStr();
  randevular = randevulariYukle();
  const liste = randevular.filter(r => r.berberId === aktifAdminBerberId);

  document.getElementById("statBugun").textContent =
    liste.filter(r => r.tarih === bugun).length;

  const bugunDate = new Date(); bugunDate.setHours(0,0,0,0);
  const haftaSon = new Date(bugunDate);
  haftaSon.setDate(haftaSon.getDate() + 7);

  document.getElementById("statHafta").textContent = liste.filter(r => {
    const d = new Date(r.tarih);
    return d >= bugunDate && d < haftaSon;
  }).length;

  document.getElementById("statToplam").textContent = liste.length;

  const bosSlotlar = bosSlotlariHesapla(aktifAdminBerberId, bugun);
  const simdi = new Date();
  const simdiDk = simdi.getHours() * 60 + simdi.getMinutes();
  const sonraki = bosSlotlar.find(s => {
    const [h, m] = s.split(":").map(Number);
    return h * 60 + m > simdiDk;
  });
  document.getElementById("statSonrakiBos").textContent = sonraki || (bosSlotlar[0] ?? "—");
}

function adminTakvimGuncelle() {
  const tarihEl = document.getElementById("adminTakvimTarih");
  const tarih = tarihEl?.value;
  if (!tarih) return;

  const tarih2 = document.getElementById("adminTakvimTarih2");
  if (tarih2) tarih2.value = tarih;

  randevular = randevulariYukle();
  const tumSlotlar = tumSlotlariHesapla(aktifAdminBerberId, tarih);
  const gunRandevular = randevular.filter(r => r.berberId === aktifAdminBerberId && r.tarih === tarih);
  const map = {};
  gunRandevular.forEach(r => { map[r.saat] = r; });

  const html = tumSlotlar.map(s => {
    const r = map[s];
    return r
      ? `<tr class="dolu"><td class="takvim-saat">${s}</td><td>Dolu: ${r.musteriAd} — ${r.islem}</td></tr>`
      : `<tr class="bos"><td class="takvim-saat">${s}</td><td>Boş</td></tr>`;
  }).join("");

  const body1 = document.getElementById("takvimBody");
  const body2 = document.getElementById("takvimBody2");
  if (body1) body1.innerHTML = html;
  if (body2) body2.innerHTML = html;
}

function adminTakvimGuncelle2() {
  const tarih2 = document.getElementById("adminTakvimTarih2");
  const tarih1 = document.getElementById("adminTakvimTarih");
  if (tarih1 && tarih2) tarih1.value = tarih2.value;
  adminTakvimGuncelle();
}

function randevuListesiGuncelle() {
  if (!aktifAdminBerberId) return;
  randevular = randevulariYukle();

  const baslangic = document.getElementById("listeBaslangic")?.value;
  const bitis = document.getElementById("listeBitis")?.value;

  let liste = randevular.filter(r => r.berberId === aktifAdminBerberId);
  if (baslangic) liste = liste.filter(r => r.tarih >= baslangic);
  if (bitis) liste = liste.filter(r => r.tarih <= bitis);
  liste.sort((a, b) => a.tarih !== b.tarih ? a.tarih.localeCompare(b.tarih) : a.saat.localeCompare(b.saat));

  const tbody = document.getElementById("randevuListBody");
  if (!tbody) return;

  tbody.innerHTML = liste.length
    ? liste.map(r => `
        <tr>
          <td>${tarihFormatla(r.tarih)}</td>
          <td>${r.saat}</td>
          <td>${r.musteriAd}</td>
          <td>${r.telefon}</td>
          <td>${r.islem}</td>
          <td><button class="btn btn-danger" onclick="randevuSil('${r.id}')">Sil</button></td>
        </tr>`).join("")
    : '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);">Randevu bulunamadı.</td></tr>';
}

function randevuSil(id) {
  if (!confirm("Bu randevuyu silmek istiyor musunuz?")) return;
  randevular = randevulariYukle().filter(r => r.id !== id);
  randevulariKaydet(randevular);
  adminPanelGuncelle();
}

function takvimiRandevuTarihineGit(tarih) {
  const el = document.getElementById("adminTakvimTarih");
  const el2 = document.getElementById("adminTakvimTarih2");
  if (el) el.value = tarih;
  if (el2) el2.value = tarih;
  adminTakvimGuncelle();
}

function haftaAnalizi() {
  if (!aktifAdminBerberId) return;
  const tbody = document.getElementById("analizBody");
  if (!tbody) return;

  let rows = "";
  const bugun = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date(bugun);
    d.setDate(d.getDate() + i);
    const tarih = yerelTarihStr(d);
    const gunAdi = `${GUNLER[d.getDay()]} (${d.getDate()}.${d.getMonth()+1})`;

    const toplam = tumSlotlariHesapla(aktifAdminBerberId, tarih).length;
    const bos = bosSlotlariHesapla(aktifAdminBerberId, tarih).length;
    const dolu = toplam - bos;
    const yuzde = toplam > 0 ? Math.round((dolu / toplam) * 100) : 0;
    const renk = yuzde > 80 ? "red" : yuzde >= 50 ? "yellow" : "green";

    rows += `
      <tr>
        <td>${gunAdi}</td>
        <td>${toplam}</td>
        <td>${dolu}</td>
        <td>${bos}</td>
        <td>
          <div style="display:flex;align-items:center;gap:8px;">
            <div class="progress-bar" style="flex:1;">
              <div class="progress-fill ${renk}" style="width:${yuzde}%"></div>
            </div>
            <span style="font-size:0.8rem;min-width:36px;">%${yuzde}</span>
          </div>
        </td>
      </tr>`;
  }
  tbody.innerHTML = rows;
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("adminBerberAd")) {
    adminPanelBaslat();
    // Başka sekmede randevu alınınca paneli otomatik yenile
    randevuDegisikligiDinle(() => adminPanelGuncelle());
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") adminPanelGuncelle();
    });
  }
});
