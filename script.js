// ===== CONFIGURAÇÃO =====
// Número do WhatsApp com DDI e DDD, só dígitos (ex.: 5518999999999)
const WHATSAPP = "5500000000000";
const EMPRESA = "ADVM Technology";

const $ = (s, r = document) => r.querySelector(s);
$("#ano").textContent = new Date().getFullYear();

/* menu */
const burger = $("#burger"), nav = $("#nav");
burger.addEventListener("click", () => { const on = nav.classList.toggle("on"); burger.classList.toggle("on", on); burger.setAttribute("aria-expanded", on); });
nav.addEventListener("click", e => { if (e.target.closest("a")) { nav.classList.remove("on"); burger.classList.remove("on"); burger.setAttribute("aria-expanded", "false"); } });

/* WhatsApp */
$("#form").addEventListener("submit", e => {
  e.preventDefault(); const f = new FormData(e.target);
  const t = `Olá, ${EMPRESA}! Meu nome é ${f.get("nome")}.\nTelefone: ${f.get("tel")}\nProjeto: ${f.get("tipo")}\n${f.get("msg") || ""}`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(t)}`, "_blank", "noopener");
});

/* ===== Planta técnica ===== */
const INK = "#1d2417", PAPER = "#f5f6ee", OLIVE = "#5b6844", GOLD = "#b98f2c";
const TYPES = {
  acesso: { name: "Controle de acesso", text: "Leitores, catracas e cancelas com biometria e crachá, liberando cada pessoa só onde pode entrar.", tag: "A" },
  cftv: { name: "Câmeras", text: "Câmeras IP com gravação e acesso remoto, posicionadas pelo projeto e não pela sobra de cabo.", tag: "C" },
  alarme: { name: "Alarme e perímetro", text: "Sensores e cerca elétrica no limite do terreno, avisando antes de alguém chegar ao prédio.", tag: "P" },
  incendio: { name: "Detecção de incêndio", text: "Detectores de fumaça e central endereçável, que apontam o ponto exato do alarme.", tag: "D" },
  redes: { name: "Redes e infraestrutura", text: "Cabeamento, racks e pontos de rede dedicados aos sistemas de segurança.", tag: "R" }
};
function symbol(t, L = 0) {
  switch (t) {
    case "acesso": return `<rect x="-6.5" y="-6.5" width="13" height="13" fill="${PAPER}" stroke="${INK}" stroke-width="1.7"/><circle r="2.3" fill="${INK}"/>`;
    case "cftv": return (L ? `<path d="M0 0L${L} ${-L * .42}A${L * 1.08} ${L * 1.08} 0 0 1 ${L} ${L * .42}Z" fill="${GOLD}" fill-opacity=".2" stroke="${GOLD}" stroke-opacity=".7"/>` : "") + `<circle r="5.5" fill="${GOLD}"/>`;
    case "alarme": return `<path d="M0 -7.5L7.5 0L0 7.5L-7.5 0Z" fill="${OLIVE}" stroke="${INK}"/>`;
    case "incendio": return `<circle r="7.5" fill="${PAPER}" stroke="${INK}" stroke-width="1.7"/><text y="3.4" text-anchor="middle" font-family="Barlow Condensed" font-weight="700" font-size="10" fill="${INK}">S</text>`;
    default: return `<rect x="-6.5" y="-6.5" width="13" height="13" fill="${INK}"/><path d="M-6.5 -6.5L6.5 6.5M6.5 -6.5L-6.5 6.5" stroke="${PAPER}" stroke-width="1.2"/>`;
  }
}
(function () {
  const svg = $("#plan");
  let i = 0, h = "";
  const draw = (d, cls) => `<path class="w ${cls} draw" pathLength="1" style="--i:${i++}" d="${d}"/>`;
  h += `<rect width="1200" height="540" fill="${PAPER}"/>`;
  // terreno / cerca (aparece com fade)
  h += `<path class="fence fade" d="M372 516H24V24H1176V516H428"/>`;
  h += `<path class="w w1 fade" d="M400 516V384" stroke-dasharray="3 5"/>`;
  // bloco A
  h += draw("M300 120H900V384H300Z", "w4");
  h += draw("M420 120V252M540 120V252M660 120V252M780 120V252M300 252H540M660 252H900", "w2");
  h += draw("M420 252V384M540 252V384M660 252V384M780 252V384", "w2");
  let st = ""; for (let y = 264; y <= 372; y += 9) st += `M792 ${y}H888`; h += draw(st, "w1");
  // garagem, lazer, portaria
  h += draw("M60 300H240V420H60Z", "w2");
  h += draw("M100 300V344M140 300V344M180 300V344", "w1");
  h += draw("M960 140H1120V244H960Z", "w2");
  h += draw("M984 172H1096V216H984Z", "w1");
  h += draw("M468 440H512V484H468Z", "w2");
  const txt = (x, y, s) => `<text class="lbl fade" x="${x}" y="${y}" text-anchor="middle">${s}</text>`;
  h += txt(600, 318, "Hall") + txt(840, 332, "Escada") + txt(150, 392, "Garagem") + txt(1040, 232, "Lazer") + `<text class="lbl fade" x="476" y="502">Portaria</text>` + txt(600, 98, "Bloco A") + txt(360, 188, "Apto") + txt(480, 188, "Apto") + txt(600, 188, "Apto") + txt(720, 188, "Apto") + txt(840, 188, "Apto");
  // equipamentos
  const devs = [];
  const add = (t, x, y, tag, ang = 0, L = 0, dx = 12, dy = -10) => devs.push({ t, x, y, tag, ang, L, dx, dy });
  add("acesso", 600, 384, "A-01"); add("acesso", 490, 440, "A-02", 0, 0, -12, -10); add("acesso", 240, 360, "A-03", 0, 0, 10, 20);
  add("cftv", 312, 132, "C-01", 25, 80, -8, -16); add("cftv", 888, 132, "C-02", 155, 80, -8, -16); add("cftv", 600, 270, "C-03", 90, 70, 12, 4);
  add("cftv", 250, 312, "C-04", -20, 70, -14, -10); add("cftv", 432, 504, "C-05", -90, 80, -12, 4); add("cftv", 1050, 152, "C-06", 180, 70, 12, -12);
  [[360, 150], [480, 150], [600, 150], [720, 150], [840, 150], [360, 330], [720, 330]].forEach(([x, y], k) => add("incendio", x, y, "D-" + String(k + 1).padStart(2, "0"), 0, 0, 10, -6));
  for (let x = 120; x <= 1080; x += 160) add("alarme", x, 24, "P-" + String(devs.filter(d => d.t === "alarme").length + 1).padStart(2, "0"), 0, 0, 0, -12);
  add("alarme", 1176, 270, "P-07", 0, 0, -36, 4); add("alarme", 24, 170, "P-08", 0, 0, 12, 4); add("alarme", 24, 440, "P-09", 0, 0, 12, 4);
  add("redes", 840, 372, "R-01", 0, 0, 12, 14); add("redes", 650, 292, "R-02", 0, 0, 12, 4);
  devs.forEach((d, k) => { h += `<g class="dev" data-t="${d.t}" style="--i:${k}" transform="translate(${d.x} ${d.y})"><circle class="ring" r="12"/><g transform="rotate(${d.ang})">${symbol(d.t, d.L)}</g><text class="tag" x="${d.dx}" y="${d.dy}">${d.tag}</text></g>`; });
  // carimbo da prancha
  h += `<g class="tb fade" transform="translate(842 436)"><rect x="0" y="0" width="334" height="88" fill="${PAPER}" stroke="${INK}" stroke-width="2"/><path d="M0 34H334M222 34V88M0 62H222" stroke="${INK}"/>
    <text x="12" y="25" font-size="19" font-weight="700">Planta de segurança eletrônica</text><text x="12" y="52" font-size="14">Condomínio residencial, bloco A</text><text x="12" y="79" font-size="12" fill="${OLIVE}">Exemplo ilustrativo</text>
    <text x="234" y="55" font-size="13">Esc. 1:200</text><text x="234" y="79" font-size="13">Rev. C</text></g>`;
  svg.innerHTML = h;
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) requestAnimationFrame(() => svg.classList.add("go"));

  // legenda (serviços) ligada à planta
  const lg = $("#servicos");
  lg.innerHTML = Object.entries(TYPES).map(([k, v]) => `<li><button type="button" data-t="${k}" aria-pressed="false"><svg viewBox="-16 -16 32 32" aria-hidden="true">${symbol(k, k === "cftv" ? 14 : 0)}</svg><h3>${v.name}</h3><p>${v.text}</p></button></li>`).join("");
  let locked = null;
  const show = t => { svg.classList.toggle("f", !!t); svg.querySelectorAll(".dev").forEach(d => d.classList.toggle("on", d.dataset.t === t)); };
  lg.querySelectorAll("button").forEach(b => {
    const t = b.dataset.t;
    b.addEventListener("mouseenter", () => show(t)); b.addEventListener("focus", () => show(t));
    b.addEventListener("mouseleave", () => show(locked)); b.addEventListener("blur", () => show(locked));
    b.addEventListener("click", () => { locked = locked === t ? null : t; lg.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", String(x.dataset.t === locked))); show(locked); });
  });
})();
