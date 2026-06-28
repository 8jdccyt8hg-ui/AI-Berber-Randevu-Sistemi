function filtrele() {
  const ilceEl = document.getElementById("filtreIlce");
  const siralamaEl = document.getElementById("filtreSiralama");
  const grid = document.getElementById("berberGrid");
  if (!grid) return;

  const ilce = ilceEl ? ilceEl.value : "";
  const siralama = siralamaEl ? siralamaEl.value : "puan";

  let liste = [...berberler];
  if (ilce) liste = liste.filter(b => b.ilce === ilce);

  if (siralama === "puan") liste.sort((a, b) => b.puan - a.puan);
  else if (siralama === "fiyat-asc") liste.sort((a, b) => a.fiyat - b.fiyat);
  else if (siralama === "fiyat-desc") liste.sort((a, b) => b.fiyat - a.fiyat);

  aiOnerilenBerberler = aiOnerileriYukle();
  grid.innerHTML = liste.map(b => berberKartiHTML(b)).join("");
}

function populerBerberleriGoster(limit) {
  const grid = document.getElementById("populerGrid");
  if (!grid) return;
  const liste = [...berberler].sort((a, b) => b.puan - a.puan).slice(0, limit || 3);
  aiOnerilenBerberler = aiOnerileriYukle();
  grid.innerHTML = liste.map(b => berberKartiHTML(b)).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  const ilceParam = urlParam("ilce");
  const ilceEl = document.getElementById("filtreIlce");
  if (ilceParam && ilceEl) ilceEl.value = ilceParam;
  filtrele();
  populerBerberleriGoster(3);
});
