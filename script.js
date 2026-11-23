// ===== CONFIGURAÇÃO =====
// Número do WhatsApp com DDI e DDD, só dígitos (ex.: 5518999999999)
const WHATSAPP = "5500000000000";
const EMPRESA = "ADVM tecnologia";

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

/* ---------- circuitos de rede com energia passando ---------- */
(function () {
  const canvases = $$("canvas.circuit"); if (!canvases.length) return;
  const rand = (a, b) => a + Math.random() * (b - a), ri = (a, b) => Math.floor(rand(a, b + 1));
  const hexRgb = h => { h = (h || "").trim().replace("#", ""); if (h.length === 3) h = h.split("").map(c => c + c).join(""); const n = parseInt(h, 16) || 0; return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  let C = { a: [167, 123, 255], b: [243, 239, 253] };
  const instances = [];
  function readColors() { const cs = getComputedStyle(document.documentElement); C = { a: hexRgb(cs.getPropertyValue("--vio2")), b: hexRgb(cs.getPropertyValue("--nev")) }; }
  readColors();
  new MutationObserver(() => { readColors(); instances.forEach(i => i.bake()); }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-tema"] });

  function make(cv) {
    const ctx = cv.getContext("2d"), base = document.createElement("canvas"), bctx = base.getContext("2d");
    const density = parseFloat(cv.dataset.density) || 1, interactive = cv.dataset.interactive === "1" && fine, calm = cv.dataset.calm === "1";
    let W = 1, H = 1, dpr = 1, cell = 46, traces = [], pulses = [], flashes = [], ptr = null, lastSpawn = 0;
    const inst = { vis: false, bake, draw, build };

    function makeTrace(cols, rows) {
      const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]]; let x = ri(1, cols - 1), y = ri(1, rows - 1), d = dirs[ri(0, 3)];
      const pts = [[x, y]], segs = ri(3, 6);
      for (let s = 0; s < segs; s++) {
        const len = ri(2, 7), nx = x + d[0] * len, ny = y + d[1] * len; if (nx < 0 || ny < 0 || nx > cols || ny > rows) break;
        x = nx; y = ny; pts.push([x, y]);
        const turn = Math.random() < .5 ? [-d[1], d[0]] : [d[1], -d[0]], dl = ri(1, 3);
        const dx = x + (d[0] + turn[0]) * dl, dy = y + (d[1] + turn[1]) * dl; if (dx < 0 || dy < 0 || dx > cols || dy > rows) break;
        x = dx; y = dy; pts.push([x, y]); d = turn;
      }
      if (pts.length < 4) return null;
      const P = pts.map(([a, b]) => [a * cell + cell / 2, b * cell + cell / 2]), cum = [0];
      for (let i = 1; i < P.length; i++) cum.push(cum[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
      return { P, cum, total: cum[cum.length - 1] };
    }
    function at(t, s) { s = Math.max(0, Math.min(t.total, s)); let i = 1; while (i < t.cum.length - 1 && t.cum[i] < s) i++; const k = (s - t.cum[i - 1]) / ((t.cum[i] - t.cum[i - 1]) || 1); return [t.P[i - 1][0] + (t.P[i][0] - t.P[i - 1][0]) * k, t.P[i - 1][1] + (t.P[i][1] - t.P[i - 1][1]) * k]; }
    const cf = (x, y) => { if (!calm) return 1; const r0 = Math.min(W, H) * .1, r1 = Math.max(W, H) * .52, d = Math.hypot(x - W / 2, y - H * .46), f = Math.max(0, Math.min(1, (d - r0) / (r1 - r0))); return 1 - .5 * (1 - f); };
    const newPulse = (i, init) => ({ i, s: init ? rand(0, traces[i].total) : -rand(0, 300), v: rand(130, 240), len: rand(90, 160) });

    function build() {
      const r = cv.getBoundingClientRect(); W = Math.max(1, r.width); H = Math.max(1, r.height); dpr = Math.min(devicePixelRatio || 1, 1.5);
      cv.width = base.width = Math.round(W * dpr); cv.height = base.height = Math.round(H * dpr);
      cell = W < 700 ? 34 : 46; const cols = Math.floor(W / cell), rows = Math.floor(H / cell), n = Math.max(4, Math.round(cols * rows / 36 * density));
      traces = []; for (let k = 0; k < n * 4 && traces.length < n; k++) { const t = makeTrace(cols, rows); if (t) traces.push(t); }
      pulses = []; if (!RM) traces.forEach((t, i) => { const m = Math.random() < .7 ? 1 : 2; for (let q = 0; q < m; q++) pulses.push(newPulse(i, true)); });
      bake(); if (RM) draw(0, 0);
    }
    function bake() {
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0); bctx.clearRect(0, 0, W, H); const [r, g, b] = C.a; bctx.lineJoin = "round"; bctx.lineCap = "round";
      traces.forEach(t => {
        bctx.beginPath(); t.P.forEach(([x, y], i) => i ? bctx.lineTo(x, y) : bctx.moveTo(x, y)); bctx.strokeStyle = `rgba(${r},${g},${b},.5)`; bctx.lineWidth = 1.6; bctx.stroke();
        [t.P[0], t.P[t.P.length - 1]].forEach(([x, y]) => { bctx.beginPath(); bctx.arc(x, y, 4, 0, 7); bctx.strokeStyle = `rgba(${r},${g},${b},.8)`; bctx.lineWidth = 1.6; bctx.stroke(); bctx.beginPath(); bctx.arc(x, y, 2.2, 0, 7); bctx.fillStyle = `rgba(${r},${g},${b},.9)`; bctx.fill(); });
        for (let i = 1; i < t.P.length - 1; i += 2) { bctx.beginPath(); bctx.arc(t.P[i][0], t.P[i][1], 2.2, 0, 7); bctx.fillStyle = `rgba(${r},${g},${b},.55)`; bctx.fill(); }
      });
      if (calm) { bctx.globalCompositeOperation = "destination-out"; const gr = bctx.createRadialGradient(W / 2, H * .46, Math.min(W, H) * .1, W / 2, H * .46, Math.max(W, H) * .52); gr.addColorStop(0, "rgba(0,0,0,.5)"); gr.addColorStop(1, "rgba(0,0,0,0)"); bctx.fillStyle = gr; bctx.fillRect(0, 0, W, H); bctx.globalCompositeOperation = "source-over"; }
    }
    function draw(dt, now) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H); ctx.drawImage(base, 0, 0, W, H);
      const [r, g, b] = C.a, [r2, g2, b2] = C.b; ctx.lineCap = "round";
      pulses.forEach(p => {
        const t = traces[p.i]; p.s += p.v * dt;
        if (p.s - p.len > t.total) { flashes.push({ xy: t.P[t.P.length - 1], t0: now }); if (p.temp) p.dead = true; else Object.assign(p, newPulse(p.i, false)); return; }
        const steps = 14;
        for (let k = 0; k < steps; k++) {
          const d1 = p.s - p.len * k / steps, d0 = p.s - p.len * (k + 1) / steps; if (d1 < 0 || d0 > t.total) continue;
          const A = at(t, d0), B = at(t, d1); ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]);
          ctx.strokeStyle = `rgba(${r},${g},${b},${.95 * (1 - k / steps) * cf(A[0], A[1])})`; ctx.lineWidth = 3 * (1 - k / steps) + .8; ctx.stroke();
        }
        if (p.s >= 0 && p.s <= t.total) { const h = at(t, p.s), q = cf(h[0], h[1]); [[14, .14], [8, .3]].forEach(([rr, aa]) => { ctx.beginPath(); ctx.arc(h[0], h[1], rr, 0, 7); ctx.fillStyle = `rgba(${r},${g},${b},${aa * q})`; ctx.fill(); }); ctx.beginPath(); ctx.arc(h[0], h[1], 3.4, 0, 7); ctx.fillStyle = `rgba(${r2},${g2},${b2},${q})`; ctx.fill(); }
      });
      pulses = pulses.filter(p => !p.dead);
      flashes = flashes.filter(f => now - f.t0 < 700);
      flashes.forEach(f => { const k = (now - f.t0) / 700; ctx.beginPath(); ctx.arc(f.xy[0], f.xy[1], 4 + k * 18, 0, 7); ctx.strokeStyle = `rgba(${r},${g},${b},${.8 * (1 - k) * cf(f.xy[0], f.xy[1])})`; ctx.lineWidth = 1.6; ctx.stroke(); });
      if (ptr) traces.forEach(t => [t.P[0], t.P[t.P.length - 1]].forEach(([x, y]) => { const d = Math.hypot(x - ptr[0], y - ptr[1]); if (d < 150) { const a = 1 - d / 150; ctx.beginPath(); ctx.arc(x, y, 9 + a * 6, 0, 7); ctx.fillStyle = `rgba(${r},${g},${b},${.22 * a})`; ctx.fill(); ctx.beginPath(); ctx.arc(x, y, 3 + a * 3, 0, 7); ctx.fillStyle = `rgba(${r2},${g2},${b2},${a})`; ctx.fill(); } }));
    }
    function spawn(x, y) { let best = null, bd = 170; traces.forEach((t, i) => t.P.forEach((p, vi) => { const d = Math.hypot(p[0] - x, p[1] - y); if (d < bd) { bd = d; best = [i, vi]; } })); if (best) pulses.push({ i: best[0], s: traces[best[0]].cum[best[1]], v: 300, len: 110, temp: true }); }
    if (interactive && !RM) {
      const host = cv.parentElement;
      host.addEventListener("pointermove", e => { const r = cv.getBoundingClientRect(); ptr = [e.clientX - r.left, e.clientY - r.top]; const n = performance.now(); if (n - lastSpawn > 260) { lastSpawn = n; spawn(ptr[0], ptr[1]); } });
      host.addEventListener("pointerleave", () => ptr = null);
    }
    new IntersectionObserver(es => { inst.vis = es[0].isIntersecting; }, { threshold: 0 }).observe(cv);
    let rt; new ResizeObserver(() => { clearTimeout(rt); rt = setTimeout(build, 150); }).observe(cv);
    build(); instances.push(inst);
  }
  canvases.forEach(make);
  if (RM) return;
  let last = performance.now();
  (function loop(now) { const dt = Math.min(.05, (now - last) / 1000); last = now; if (!document.hidden) instances.forEach(i => i.vis && i.draw(dt, now)); requestAnimationFrame(loop); })(last);
})();

/* ---------- círculo que segue o mouse ---------- */
(function () {
  const cur = $("#cur"); if (!cur || RM || !fine) return;
  let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y;
  addEventListener("pointermove", e => { tx = e.clientX; ty = e.clientY; cur.classList.add("on"); });
  document.addEventListener("pointerleave", () => cur.classList.remove("on"));
  document.addEventListener("pointerover", e => cur.classList.toggle("big", !!e.target.closest("a,button,[role=tab],input,select,textarea")));
  (function loop() { x += (tx - x) * .18; y += (ty - y) * .18; cur.style.transform = `translate(${x}px,${y}px)`; requestAnimationFrame(loop); })();
})();


/* ---------- números que contam ---------- */
(function () {
  const box = $("#stats"); if (!box) return;
  const items = $$("dt[data-count]", box), fmt = n => n.toLocaleString("pt-BR");
  const set = (el, v) => { el.textContent = (el.dataset.pre || "") + fmt(v) + (el.dataset.suf || ""); };
  if (RM) { items.forEach(el => set(el, +el.dataset.count)); return; }
  let done = false;
  function run() {
    if (done) return; done = true; const t0 = performance.now(), dur = 1700;
    (function f(now) { const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3); items.forEach(el => set(el, Math.round(e * +el.dataset.count))); if (k < 1) requestAnimationFrame(f); })(t0);
  }
  new IntersectionObserver((es, ob) => { if (es[0].isIntersecting) { setTimeout(run, 700); ob.disconnect(); } }, { threshold: .5 }).observe(box);
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
