async function aiOner() {
  const input = document.getElementById("aiInput").value.trim();
  if (!input) return;

  const btn = document.getElementById("aiBtn");
  const loading = document.getElementById("aiLoading");
  const result = document.getElementById("aiResult");

  btn.disabled = true;
  loading.classList.add("active");
  result.innerHTML = "";

  const berberListesi = berberler.map(b =>
    `- ${b.ad} (${b.ilce}): Uzmanlık: ${b.uzmanlik.join(", ")}. Puan: ${b.puan}. Seans süresi: ${b.seans} dk. Ücret: ${b.fiyat}₺`
  ).join("\n");

  const prompt = `Sen bir İstanbul berber öneri asistanısın. Kullanıcının saç tipini ve isteklerini analiz ederek sistemdeki berberlerden en uygun 1-3 tanesini öner.

Sistemdeki berberler:
${berberListesi}

Kullanıcının isteği: "${input}"

Yanıtını şu formatta ver:
ÖNERİLEN BERBERLER:
1. [Berber Adı] — [Neden uygun olduğunu 1-2 cümleyle açıkla]
2. [Berber Adı] — [Açıklama]
(varsa 3.)

Yanıtın sonuna kısa bir saç bakım tüyosu ekle.
Türkçe yaz.`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    if (!res.ok) throw new Error("API hatası");

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Boş yanıt");

    result.innerHTML = `<div class="ai-result-content">${text}</div>`;

    aiOnerilenBerberler = berberler.filter(b => text.includes(b.ad)).map(b => b.ad);
    aiOnerileriKaydet(aiOnerilenBerberler);

    onerilenBerberleriGoster();

  } catch {
    result.innerHTML = `<p class="ai-placeholder" style="color:#fca5a5;">AI şu an yanıt veremiyor, lütfen tekrar deneyin.</p>`;
  } finally {
    btn.disabled = false;
    loading.classList.remove("active");
  }
}

function onerilenBerberleriGoster() {
  const el = document.getElementById("onerilenBerberler");
  if (!el || !aiOnerilenBerberler.length) return;

  const liste = berberler.filter(b => aiOnerilenBerberler.includes(b.ad));
  el.innerHTML = `
    <div class="section-header" style="margin-top:48px;">
      <span class="section-label">AI Sonucu</span>
      <h2 class="section-title">Önerilen Berberler</h2>
    </div>
    <div class="berber-grid">${liste.map(b => berberKartiHTML(b, true)).join("")}</div>
  `;
}

function ornekYaz(metin) {
  document.getElementById("aiInput").value = metin;
}

document.addEventListener("DOMContentLoaded", () => {
  aiOnerilenBerberler = aiOnerileriYukle();
  onerilenBerberleriGoster();
});
