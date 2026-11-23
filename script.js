// ===== CONFIGURAÇÃO =====
// Número do WhatsApp com DDI e DDD, só dígitos (ex.: 5518999999999)
const WHATSAPP = "5500000000000";
const EMPRESA = "ADVM technology";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const reflow = el => void el.offsetWidth;

$("#ano").textContent = new Date().getFullYear();
const waLink = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Olá! Gostaria de um orçamento.")}`;
$("#wa").href = waLink; $("#fab").href = waLink;

/* ---------- cabeçalho, progresso, menu, aparecer ao rolar ---------- */
const topEl = $("#top"), prog = $("#progress"), nav = $("#nav"), burger = $("#burger");
function setMenu(on) { nav.classList.toggle("on", on); burger.classList.toggle("on", on); burger.setAttribute("aria-expanded", on); burger.setAttribute("aria-label", on ? "Fechar menu" : "Abrir menu"); document.body.style.overflow = on ? "hidden" : ""; }
burger.addEventListener("click", () => setMenu(!nav.classList.contains("on")));
nav.addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });
addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12, rootMargin: "0px 0px -5% 0px" });
$$("[data-reveal]").forEach(el => io.observe(el));
const spy = $$("[data-spy]"), secs = spy.map(a => $(a.getAttribute("href")));
let tick = false;
function onScroll() {
  if (tick) return; tick = true;
  requestAnimationFrame(() => {
    const max = document.documentElement.scrollHeight - innerHeight; prog.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    topEl.classList.toggle("on", scrollY > 30);
    const y = scrollY + innerHeight * .4; let cur = -1; secs.forEach((s, i) => { if (s && s.offsetTop <= y) cur = i; });
    spy.forEach((a, i) => a.classList.toggle("act", i === cur && !a.classList.contains("btn")));
    tick = false;
  });
}
addEventListener("scroll", onScroll, { passive: true }); addEventListener("resize", onScroll); onScroll();

/* ---------- palavra que troca no título ---------- */
(function () {
  const inner = $("#rotIn"); if (!inner) return;
  const n = inner.children.length; inner.append(inner.children[0].cloneNode(true)); let i = 0;
  if (RM) return;
  setInterval(() => {
    if (document.hidden) return; i++; inner.style.transform = `translateY(${-i * 1.12}em)`;
    if (i === n) setTimeout(() => { inner.style.transition = "none"; inner.style.transform = "translateY(0)"; i = 0; reflow(inner); inner.style.transition = ""; }, 720);
  }, 2400);
})();

/* ---------- prédio interativo ---------- */
(function () {
  const svg = $(".bld__svg"), wins = $("#wins"); if (!svg) return;
  const NS = "http://www.w3.org/2000/svg", W = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const w = document.createElementNS(NS, "rect"); w.setAttribute("x", 192 + c * 58); w.setAttribute("y", 138 + r * 58); w.setAttribute("width", 40); w.setAttribute("height", 38); w.setAttribute("rx", 4); w.setAttribute("class", "win"); w.setAttribute("fill", Math.random() < .4 ? "#ffd9a8" : "#4b2f94"); w.setAttribute("opacity", ".85"); wins.append(w); W.push(w); }
  const IC = ['<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15.5" r="1.2"/>', '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4M6 11h3l2-3 2 5 2-2h3"/>', '<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/>', '<path d="M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z"/>', '<circle cx="12" cy="5" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><path d="M12 7v5M12 12l-6 4M12 12l6 4"/>', '<path d="M14.5 6.5a4 4 0 0 0-5 5L4 17l3 3 5.5-5.5a4 4 0 0 0 5-5l-2.5 2.5-2.5-.5-.5-2.5z"/>'];
  const S = [["Controle de acesso", "Leitores e catracas liberam só quem pode entrar."], ["Câmeras e monitoramento", "A portaria acompanha tudo, inclusive pelo celular."], ["Alarme e perímetro", "Sensores na cerca avisam antes de alguém chegar ao prédio."], ["Detecção de incêndio", "Detectores em cada andar mostram o ponto exato do alarme."], ["Redes e infraestrutura", "A sala técnica reúne a rede dedicada dos sistemas."], ["Manutenção", "Revisões e atendimento depois da entrega."]];
  const hs = $$(".hs"), cap = $("#cap"), dots = $("#capDots"); dots.innerHTML = S.map(() => "<i><b></b></i>").join("");
  let cur = 0, timer = null, paused = false, hold = 0;
  function show(i, swap = true) {
    cur = i; hs.forEach((h, k) => h.classList.toggle("on", k === i));
    const paint = () => { $("#capT").textContent = S[i][0]; $("#capD").textContent = S[i][1]; $("#capIc").innerHTML = `<svg viewBox="0 0 24 24">${IC[i]}</svg>`; cap.classList.remove("swap"); };
    if (swap && !RM) { cap.classList.add("swap"); setTimeout(paint, 220); } else paint();
    $$("i", dots).forEach((d, k) => { d.className = k < i ? "done" : k === i ? "cur" : ""; });
    const c = $$("i", dots)[i]; if (c) { c.classList.remove("cur"); reflow(c); c.classList.add("cur"); }
  }
  function next() { show((cur + 1) % S.length); }
  function start() { clearInterval(timer); if (!RM) timer = setInterval(() => { if (!paused && !document.hidden && Date.now() > hold) next(); }, 3400); }
  hs.forEach(h => h.addEventListener("click", () => { show(+h.dataset.i); hold = Date.now() + 9000; }));
  $$(".bld").forEach(b => { b.addEventListener("pointerenter", () => { paused = true; cap.classList.add("pause"); }); b.addEventListener("pointerleave", () => { paused = false; cap.classList.remove("pause"); show(cur, false); }); });
  show(0, false); start();
  if (!RM) setInterval(() => { if (document.hidden) return; for (let k = 0; k < 2; k++) { const w = W[Math.floor(Math.random() * W.length)]; w.setAttribute("fill", w.getAttribute("fill") === "#ffd9a8" ? "#4b2f94" : "#ffd9a8"); } }, 900);
})();

/* ---------- botões magnéticos ---------- */
if (fine && !RM) $$(".magnet").forEach(b => {
  b.addEventListener("pointermove", e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .2}px,${(e.clientY - r.top - r.height / 2) * .28}px)`; });
  b.addEventListener("pointerleave", () => b.style.transform = "");
});

/* ---------- abas: para quem trabalhamos ---------- */
(function () {
  const D = [
    ["Escolas e universidades", "Muita gente entrando e saindo, com áreas que precisam de controle.", "Referência: UNESP", ["Controle de acesso por área", "Câmeras em pátios e corredores", "Alarme de perímetro", "Rede dedicada para os sistemas"]],
    ["Condomínios", "Moradores, visitantes e prestadores, todos sob controle.", "Referência: ADN MRV e Grupo Field", ["Portaria e garagem", "Controle de moradores e visitantes", "Alarme nas áreas comuns", "Monitoramento pelo celular"]],
    ["Hotéis", "Os hóspedes circulam livremente, mas cada área tem a sua regra.", "Obras em andamento", ["Acesso por andar e por ambiente", "Câmeras nas áreas de circulação", "Integração com a operação do hotel"]],
    ["Hospitais", "Áreas restritas e fluxo de pessoas pedem controle rigoroso.", "Obras em andamento", ["Controle das áreas restritas", "Controle do fluxo de pessoas", "Detecção de incêndio"]],
    ["Construtoras", "Proteção contra incêndio já durante a obra.", "Obras em andamento", ["Detectores e central endereçável", "Alarme durante a construção", "Projeto como construído na entrega"]]
  ];
  const tabs = $$('[role="tab"]'), panel = $("#tp"), CK = '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  function sel(i, focus) {
    tabs.forEach((t, k) => { t.setAttribute("aria-selected", k === i); t.tabIndex = k === i ? 0 : -1; });
    panel.setAttribute("aria-labelledby", "tb" + i);
    const d = D[i], l = $(".tp__l", panel); l.style.animation = "none"; reflow(l); l.style.animation = "";
    $("#tpT").textContent = d[0]; $("#tpD").textContent = d[1]; $("#tpR").textContent = d[2];
    $("#tpL").innerHTML = d[3].map((t, k) => `<li style="animation-delay:${.08 * k + .05}s">${CK}${t}</li>`).join("");
    $$(".tp__l > *", panel).forEach(e => { e.style.animation = "none"; reflow(e); e.style.animation = ""; });
    if (focus) tabs[i].focus();
  }
  tabs.forEach((t, i) => { t.addEventListener("click", () => sel(i)); t.addEventListener("keydown", e => { if (e.key === "ArrowRight") sel((i + 1) % tabs.length, true); if (e.key === "ArrowLeft") sel((i + tabs.length - 1) % tabs.length, true); }); });
  sel(0);
})();

/* ---------- passo a passo ---------- */
(function () {
  const steps = $$(".fs"), fill = $("#flowFill"), flow = $("#flow"); let cur = 0, timer = null, vis = false, hold = 0;
  function set(i) { cur = i; steps.forEach((s, k) => { s.classList.toggle("done", k < i); s.classList.toggle("on", k === i); }); fill.style.width = (i / (steps.length - 1)) * 100 + "%"; }
  set(0);
  steps.forEach((s, i) => s.addEventListener("click", () => { set(i); hold = Date.now() + 9000; }));
  new IntersectionObserver(es => { vis = es[0].isIntersecting; }, { threshold: .4 }).observe(flow);
  if (!RM) timer = setInterval(() => { if (vis && !document.hidden && Date.now() > hold) set((cur + 1) % steps.length); }, 2800);
})();

/* ---------- formulário ---------- */
(function () {
  const f = $("#form"), nome = $("#f-nome"), tel = $("#f-tel"), send = $("#send"), done = $("#done");
  tel.addEventListener("input", () => { const d = tel.value.replace(/\D/g, "").slice(0, 11); tel.value = d.length > 10 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}` : d.length > 6 ? `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}` : d.length > 2 ? `(${d.slice(0, 2)}) ${d.slice(2)}` : d; });
  const bad = (el, id, msg) => { const w = el.parentElement; w.classList.toggle("bad", !!msg); $(id).textContent = msg; if (msg) { w.classList.remove("shake"); reflow(w); w.classList.add("shake"); } el.setAttribute("aria-invalid", !!msg); return !msg; };
  const vN = () => bad(nome, "#e-nome", nome.value.trim().length < 2 ? "Escreva seu nome." : "");
  const vT = () => bad(tel, "#e-tel", tel.value.replace(/\D/g, "").length < 10 ? "Informe o telefone com DDD." : "");
  nome.addEventListener("blur", () => { if (nome.value) vN(); }); tel.addEventListener("blur", () => { if (tel.value) vT(); });
  f.addEventListener("submit", e => {
    e.preventDefault(); const a = vN(), b = vT(); if (!a || !b) { (a ? tel : nome).focus(); return; }
    const d = new FormData(f), txt = `Olá, ${EMPRESA}! Meu nome é ${d.get("nome").trim()}.\nTelefone: ${d.get("tel")}\nPreciso de: ${d.get("tipo")}\n${d.get("msg") || ""}`.trim();
    send.classList.add("load"); done.textContent = "";
    setTimeout(() => { send.classList.remove("load"); send.classList.add("okk"); done.textContent = "Pronto! Abrindo o WhatsApp com a sua mensagem."; window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(txt)}`, "_blank", "noopener"); setTimeout(() => { send.classList.remove("okk"); done.textContent = ""; }, 4000); }, RM ? 0 : 700);
  });
})();
