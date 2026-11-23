// ===== CONFIGURAÇÃO =====
// Número do WhatsApp com DDI e DDD, só dígitos (ex.: 5518999999999)
const WHATSAPP = "5500000000000";
const EMPRESA = "ADVM technology";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

$("#ano").textContent = new Date().getFullYear();
const waLink = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Olá! Gostaria de um orçamento.")}`;
$("#wa").href = waLink; $("#fab").href = waLink;

/* ---------- cabeçalho, progresso, menu ---------- */
const topEl = $("#top"), prog = $("#progress"), nav = $("#nav"), burger = $("#burger");
function setMenu(on) { nav.classList.toggle("on", on); burger.classList.toggle("on", on); burger.setAttribute("aria-expanded", on); burger.setAttribute("aria-label", on ? "Fechar menu" : "Abrir menu"); document.body.style.overflow = on ? "hidden" : ""; }
burger.addEventListener("click", () => setMenu(!nav.classList.contains("on")));
nav.addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });
addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

/* ---------- aparecer ao rolar ---------- */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .14, rootMargin: "0px 0px -6% 0px" });
$$("[data-reveal]").forEach(el => { if (!el.closest(".hero")) io.observe(el); });

/* ---------- menu ativo ---------- */
const spy = $$("[data-spy]"), secs = spy.map(a => $(a.getAttribute("href")));
function updateSpy() { const y = scrollY + innerHeight * .4; let cur = -1; secs.forEach((s, i) => { if (s && s.offsetTop <= y) cur = i; }); spy.forEach((a, i) => a.classList.toggle("act", i === cur && !a.classList.contains("btn"))); }

/* ---------- painel de avisos (hero) ---------- */
(function () {
  const feed = $("#feed"); if (!feed) return;
  const IC = { check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>', clock: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4.5l3 2"/>', shield: '<path d="M12 3l7 3v5.5c0 4.6-3 7.6-7 9.5-4-1.9-7-4.9-7-9.5V6z"/><path d="M9 12l2 2 4-4"/>', link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>' };
  const D = [["Portaria", "Acesso liberado, visitante autorizado", "check", ""], ["Perímetro", "Todos os sensores normais", "shield", ""], ["Bloco B", "Manutenção preventiva agendada", "clock", "amb"], ["Central", "Conexão estável, sistema online", "link", "vio"], ["Garagem", "Cancela acionada por morador", "check", ""], ["Andar 3", "Detectores verificados", "shield", ""], ["Hall", "Porta fechada, acesso restrito ok", "check", ""]];
  let n = 0;
  const mk = () => { const d = D[n++ % D.length]; const li = document.createElement("li"); li.className = "chip " + d[3]; li.innerHTML = `<span class="ic"><svg viewBox="0 0 24 24">${IC[d[2]]}</svg></span><div><b>${d[0]}</b><span>${d[1]}</span></div><time></time>`; return li; };
  const times = () => $$(".chip:not(.out) time", feed).forEach((t, i) => t.textContent = i === 0 ? "agora" : `há ${i} min`);
  for (let i = 0; i < 3; i++) feed.append(mk()); [...feed.children].reverse().forEach(c => feed.append(c)); times();
  if (RM) return;
  setInterval(() => { if (document.hidden) return; feed.prepend(mk()); const all = $$(".chip:not(.out)", feed); if (all.length > 4) { const last = all[all.length - 1]; last.classList.add("out"); setTimeout(() => last.remove(), 520); } times(); }, 2800);
  const panel = $("#panel");
  if (fine) { const box = panel.parentElement; box.addEventListener("pointermove", e => { const r = box.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; panel.style.transform = `rotateY(${-8 + x * 10}deg) rotateX(${4 - y * 10}deg)`; }); box.addEventListener("pointerleave", () => panel.style.transform = ""); }
})();

/* ---------- botões magnéticos ---------- */
if (fine && !RM) $$(".magnet").forEach(b => {
  b.addEventListener("pointermove", e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .22}px,${(e.clientY - r.top - r.height / 2) * .3}px)`; });
  b.addEventListener("pointerleave", () => b.style.transform = "");
});

/* ---------- cartões de serviço ---------- */
$$(".tile").forEach(t => {
  if (fine && !RM) {
    t.addEventListener("pointermove", e => { const r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height; t.style.setProperty("--mx", x * 100 + "%"); t.style.setProperty("--my", y * 100 + "%"); t.style.setProperty("--ry", (x - .5) * 6 + "deg"); t.style.setProperty("--rx", (.5 - y) * 6 + "deg"); });
    t.addEventListener("pointerleave", () => { t.style.setProperty("--rx", "0deg"); t.style.setProperty("--ry", "0deg"); });
  }
  t.addEventListener("click", () => {
    const sel = $("#f-tipo"); sel.value = t.dataset.svc; $("#contato").scrollIntoView({ behavior: RM ? "auto" : "smooth" });
    setTimeout(() => { $("#f-nome").focus({ preventScroll: true }); sel.animate([{ boxShadow: "0 0 0 0 #a77bff" }, { boxShadow: "0 0 0 10px #a77bff00" }], { duration: 900, iterations: 2 }); }, RM ? 0 : 900);
  });
});

/* ---------- manifesto: palavras acendem ao rolar ---------- */
const mt = $("#mtxt"); const mw = mt.textContent.trim().split(/\s+/); mt.innerHTML = mw.map(w => `<span class="mw">${w}</span>`).join(" "); const mws = $$(".mw", mt);
function updManif() { const r = $("#manifesto").getBoundingClientRect(), p = clamp((innerHeight * .8 - r.top) / (r.height * .75), 0, 1); const n = Math.round(p * mws.length); mws.forEach((w, i) => w.classList.toggle("lit", i < n)); }

/* ---------- carrossel de obras ---------- */
(function () {
  const car = $("#car"), bar = $("#bar"); const step = () => $(".cs", car).getBoundingClientRect().width + 20;
  $("#next").addEventListener("click", () => car.scrollBy({ left: step(), behavior: "smooth" })); $("#prev").addEventListener("click", () => car.scrollBy({ left: -step(), behavior: "smooth" }));
  function upd() { const max = car.scrollWidth - car.clientWidth, p = max > 0 ? car.scrollLeft / max : 0, w = clamp(car.clientWidth / car.scrollWidth, .15, 1) * 100; bar.style.width = w + "%"; bar.style.transform = `translateX(${p * (100 / (w / 100) - 100)}%)`; }
  car.addEventListener("scroll", upd, { passive: true }); addEventListener("resize", upd); upd();
  let down = false, sx = 0, sl = 0, moved = false;
  car.addEventListener("pointerdown", e => { if (e.pointerType !== "mouse") return; down = true; moved = false; sx = e.clientX; sl = car.scrollLeft; });
  addEventListener("pointermove", e => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 4) { moved = true; car.classList.add("drag"); } car.scrollLeft = sl - dx; });
  addEventListener("pointerup", () => { if (!down) return; down = false; car.classList.remove("drag"); });
  car.addEventListener("keydown", e => { if (e.key === "ArrowRight") car.scrollBy({ left: step(), behavior: "smooth" }); if (e.key === "ArrowLeft") car.scrollBy({ left: -step(), behavior: "smooth" }); });
})();

/* ---------- etapas: linha preenche ao rolar ---------- */
const stepsEl = $("#steps"), stepEls = $$(".step");
function updSteps() {
  const line = innerHeight * .55; let cur = -1; stepEls.forEach((s, i) => { if (s.getBoundingClientRect().top < line) cur = i; });
  stepEls.forEach((s, i) => s.classList.toggle("act", i <= cur));
  if (cur >= 0) { const sr = stepsEl.getBoundingClientRect(), nr = stepEls[cur].querySelector(".n").getBoundingClientRect(); stepsEl.style.setProperty("--fill", clamp(nr.top - sr.top + 32 - 20, 0, sr.height) + "px"); } else stepsEl.style.setProperty("--fill", "0px");
}

/* ---------- um só laço de rolagem ---------- */
let tick = false;
function onScroll() {
  if (tick) return; tick = true;
  requestAnimationFrame(() => {
    const max = document.documentElement.scrollHeight - innerHeight; prog.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    topEl.classList.toggle("on", scrollY > 30); updateSpy(); updManif(); updSteps();
    if (!RM) $$(".aurora i").forEach((el, i) => el.style.translate = `0 ${scrollY * (.05 + i * .03)}px`);
    tick = false;
  });
}
addEventListener("scroll", onScroll, { passive: true }); addEventListener("resize", onScroll); onScroll();

/* ---------- formulário ---------- */
(function () {
  const f = $("#form"), nome = $("#f-nome"), tel = $("#f-tel"), send = $("#send"), done = $("#done");
  tel.addEventListener("input", () => { const d = tel.value.replace(/\D/g, "").slice(0, 11); tel.value = d.length > 10 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}` : d.length > 6 ? `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}` : d.length > 2 ? `(${d.slice(0, 2)}) ${d.slice(2)}` : d; });
  const bad = (el, id, msg) => { const w = el.parentElement; w.classList.toggle("bad", !!msg); $(id).textContent = msg; if (msg) { w.classList.remove("shake"); void w.offsetWidth; w.classList.add("shake"); } el.setAttribute("aria-invalid", !!msg); return !msg; };
  const vN = () => bad(nome, "#e-nome", nome.value.trim().length < 2 ? "Escreva seu nome." : "");
  const vT = () => bad(tel, "#e-tel", tel.value.replace(/\D/g, "").length < 10 ? "Informe o telefone com DDD." : "");
  nome.addEventListener("blur", () => { if (nome.value) vN(); }); tel.addEventListener("blur", () => { if (tel.value) vT(); });
  f.addEventListener("submit", e => {
    e.preventDefault(); const a = vN(), b = vT(); if (!a || !b) { (a ? tel : nome).focus(); return; }
    const d = new FormData(f), txt = `Olá, ${EMPRESA}! Meu nome é ${d.get("nome").trim()}.\nTelefone: ${d.get("tel")}\nProjeto: ${d.get("tipo")}\n${d.get("msg") || ""}`.trim();
    send.classList.add("load"); done.textContent = "";
    setTimeout(() => { send.classList.remove("load"); send.classList.add("okk"); done.textContent = "Pronto! Abrindo o WhatsApp com a sua mensagem."; window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(txt)}`, "_blank", "noopener"); setTimeout(() => { send.classList.remove("okk"); done.textContent = ""; }, 4000); }, RM ? 0 : 700);
  });
})();
