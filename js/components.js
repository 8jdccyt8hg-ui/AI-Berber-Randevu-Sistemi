// Navbar ve footer bileşenlerini sayfalara enjekte eder
function navbarOlustur() {
  const sayfa = aktifSayfa();
  const linkler = [
    { href: "index.html", label: "Ana Sayfa" },
    { href: "berberler.html", label: "Berberler" },
    { href: "ai-oneri.html", label: "AI Öneri" },
    { href: "hakkimizda.html", label: "Hakkımızda" },
    { href: "iletisim.html", label: "İletişim" }
  ];

  const navLinks = linkler.map(l =>
    `<a href="${l.href}" class="nav-link${sayfa === l.href ? " active" : ""}">${l.label}</a>`
  ).join("");

  return `
    <nav class="navbar" id="navbar">
      <div class="nav-container">
        <a href="index.html" class="nav-logo">
          <span class="logo-icon">✂</span>
          <span class="logo-text">BerberBul <em>İstanbul</em></span>
        </a>
        <button class="nav-toggle" id="navToggle" aria-label="Menü">
          <span></span><span></span><span></span>
        </button>
        <div class="nav-menu" id="navMenu">
          ${navLinks}
          <a href="admin-giris.html" class="btn btn-nav">Berber Girişi</a>
        </div>
      </div>
    </nav>
  `;
}

function footerOlustur() {
  return `
    <footer class="footer">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="footer-logo">✂ BerberBul İstanbul</div>
          <p>İstanbul'un en iyi berberlerini keşfedin, AI ile size uygun stili bulun ve kolayca randevu alın.</p>
        </div>
        <div class="footer-col">
          <h4>Sayfalar</h4>
          <a href="index.html">Ana Sayfa</a>
          <a href="berberler.html">Berberler</a>
          <a href="ai-oneri.html">AI Saç Önerisi</a>
          <a href="hakkimizda.html">Hakkımızda</a>
        </div>
        <div class="footer-col">
          <h4>İlçeler</h4>
          <a href="berberler.html?ilce=Beşiktaş">Beşiktaş</a>
          <a href="berberler.html?ilce=Kadıköy">Kadıköy</a>
          <a href="berberler.html?ilce=Şişli">Şişli</a>
          <a href="berberler.html?ilce=Üsküdar">Üsküdar</a>
        </div>
        <div class="footer-col">
          <h4>İletişim</h4>
          <a href="iletisim.html">Bize Ulaşın</a>
          <a href="admin-giris.html">Berber Paneli</a>
          <span class="footer-muted">info@berberbul.com</span>
          <span class="footer-muted">0212 000 00 00</span>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 BerberBul İstanbul — Tüm hakları saklıdır.</span>
        <span class="footer-tag">İstanbul Berber Randevu & AI Saç Öneri Sistemi</span>
      </div>
    </footer>
  `;
}

function sayfaBasligi(baslik, altBaslik, breadcrumb) {
  return `
    <div class="page-header">
      <div class="container">
        ${breadcrumb ? `<nav class="breadcrumb">${breadcrumb}</nav>` : ""}
        <h1 class="page-title">${baslik}</h1>
        ${altBaslik ? `<p class="page-subtitle">${altBaslik}</p>` : ""}
      </div>
    </div>
  `;
}

function berberAvatar(b, buyuk) {
  const cls = buyuk ? "berber-avatar berber-avatar-lg" : "berber-avatar";
  return `<div class="${cls}" style="background:linear-gradient(135deg,${b.renk},${b.renk}99)">${berberBasHarfler(b.ad)}</div>`;
}

function berberKartiHTML(b, aiRozet) {
  const rozet = aiRozet || aiOnerilenBerberler.includes(b.ad);
  const uzmanlik = b.uzmanlik.map(u => `<span class="badge">${u}</span>`).join("");
  return `
    <article class="berber-card fade-in">
      <div class="berber-card-visual" style="background:linear-gradient(160deg,${b.renk} 0%,${b.renk}55 100%)">
        ${rozet ? '<span class="ai-badge-card">AI Önerisi ✦</span>' : ""}
        <div class="berber-card-avatar">${berberBasHarfler(b.ad)}</div>
      </div>
      <div class="berber-card-body">
        <div class="berber-card-top">
          <div>
            <h3 class="berber-name">${b.ad}</h3>
            <p class="berber-ilce">📍 ${b.ilce}</p>
          </div>
          <div class="berber-rating">★ ${b.puan}</div>
        </div>
        <p class="berber-desc">${b.aciklama}</p>
        <div class="badges">${uzmanlik}</div>
        <div class="berber-meta">
          <span class="berber-fiyat">${b.fiyat}₺</span>
          <span class="berber-seans">${b.seans} dk · ${b.yorumSayisi} yorum</span>
        </div>
        <div class="berber-card-actions">
          <a href="berber-detay.html?id=${b.id}" class="btn btn-outline btn-sm">Detaylar</a>
          <a href="berber-detay.html?id=${b.id}#randevu" class="btn btn-primary btn-sm">Randevu Al</a>
        </div>
      </div>
    </article>
  `;
}

function layoutBaslat() {
  const navEl = document.getElementById("navbar-slot");
  const footEl = document.getElementById("footer-slot");
  if (navEl) navEl.innerHTML = navbarOlustur();
  if (footEl) footEl.innerHTML = footerOlustur();

  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => menu.classList.toggle("open"));
  }

  // Scroll navbar efekti
  const navbar = document.getElementById("navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.classList.toggle("scrolled", window.scrollY > 40);
    });
  }
}

document.addEventListener("DOMContentLoaded", layoutBaslat);
