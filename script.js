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

/* ---------- testar cores (protótipo) ---------- */
(function () {
  const box = $("#theme"); if (!box) return;
  const T = { violeta: "#0b0812", oliva: "#11140c", azul: "#091526" };
  function apply(t, anim) {
    if (!T[t]) t = "violeta"; const root = document.documentElement;
    if (anim && !RM) { root.classList.add("tt"); setTimeout(() => root.classList.remove("tt"), 700); }
    if (t === "violeta") root.removeAttribute("data-tema"); else root.dataset.tema = t;
    $$("img[src*='logo-horizontal-tema']").forEach(i => i.src = `assets/logo-horizontal-tema-${t}.svg`);
    $$("button", box).forEach(b => b.classList.toggle("on", b.dataset.t === t));
    const m = $('meta[name="theme-color"]'); if (m) m.content = T[t];
    try { localStorage.setItem("advm-tema", t); } catch (e) {}
  }
  const q = new URLSearchParams(location.search).get("tema"); let saved = null; try { saved = localStorage.getItem("advm-tema"); } catch (e) {}
  apply(q || saved || "violeta", false);
  box.addEventListener("click", e => { const b = e.target.closest("button"); if (b) apply(b.dataset.t, true); });
})();
