// ===== CONFIGURAÇÃO =====
// Número do WhatsApp com DDI e DDD, só dígitos (ex.: 5518999999999)
const WHATSAPP = "5511945067587";
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

/* ---------- cabeçalho, menu, aparecer ao rolar ---------- */
const topEl = $("#top"), nav = $("#nav"), burger = $("#burger");
function setMenu(on) { nav.classList.toggle("on", on); burger.classList.toggle("on", on); burger.setAttribute("aria-expanded", on); burger.setAttribute("aria-label", on ? "Fechar menu" : "Abrir menu"); document.body.style.overflow = on ? "hidden" : ""; }
burger.addEventListener("click", () => setMenu(!nav.classList.contains("on")));
nav.addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });
addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12, rootMargin: "0px 0px -5% 0px" });
let tick = false;
function onScroll() { if (tick) return; tick = true; requestAnimationFrame(() => { topEl.classList.toggle("on", scrollY > 30); tick = false; }); }
addEventListener("scroll", onScroll, { passive: true }); onScroll();

/* ---------- circuitos de fundo: descem junto com a rolagem ---------- */
const BG = (function () {
  const cv = $("#bg"); if (!cv) return { refresh() {} };
  const ctx = cv.getContext("2d"), base = document.createElement("canvas"), bctx = base.getContext("2d");
  const rand = (a, b) => a + Math.random() * (b - a), ri = (a, b) => Math.floor(rand(a, b + 1));
  const hexRgb = h => { h = (h || "").trim().replace("#", ""); if (h.length === 3) h = h.split("").map(c => c + c).join(""); const n = parseInt(h, 16) || 0; return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  const cs = getComputedStyle(document.documentElement), A = hexRgb(cs.getPropertyValue("--vio2")), B = hexRgb(cs.getPropertyValue("--nev"));
  const interactive = fine && !RM;
  let W = 1, H = 1, F = 1, dpr = 1, cell = 46, traces = [], pulses = [], flashes = [], ptr = null;
  let off = 0, par = .5, docH = 1, prog = 0, sv = 0, lastSpawn = 0, lastTop = 0, lastY = 0, nf = 0;

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
    const P = pts.map(([a, b]) => [a * cell + cell / 2, b * cell + cell / 2]);
    if (P[0][1] > P[P.length - 1][1]) P.reverse();            // a energia sempre desce
    const cum = [0]; let mn = 1e9, mx = -1e9;
    for (let i = 1; i < P.length; i++) cum.push(cum[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
    P.forEach(p => { mn = Math.min(mn, p[1]); mx = Math.max(mx, p[1]); });
    return { P, cum, total: cum[cum.length - 1], minY: mn, maxY: mx };
  }
  function at(t, s) { s = Math.max(0, Math.min(t.total, s)); let i = 1; while (i < t.cum.length - 1 && t.cum[i] < s) i++; const q = (s - t.cum[i - 1]) / ((t.cum[i] - t.cum[i - 1]) || 1); return [t.P[i - 1][0] + (t.P[i][0] - t.P[i - 1][0]) * q, t.P[i - 1][1] + (t.P[i][1] - t.P[i - 1][1]) * q]; }
  const newPulse = (i, init) => ({ i, s: init ? rand(0, traces[i].total) : -rand(0, 300), v: rand(120, 220), len: rand(90, 160) });

  function measure() { docH = document.documentElement.scrollHeight; par = Math.min(.6, (F - H) / Math.max(1, docH - H)); }
  function build() {
    W = innerWidth; H = innerHeight; F = Math.round(H * 3.2); dpr = Math.min(devicePixelRatio || 1, 1.25);
    while (W * dpr * F * dpr > 9e6 && dpr > .6) dpr -= .1;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); base.width = cv.width; base.height = Math.round(F * dpr); cv.style.height = H + "px";
    cell = W < 700 ? 34 : 46; const cols = Math.floor(W / cell), rows = Math.floor(F / cell), n = Math.max(10, Math.round(cols * rows / 34));
    traces = []; for (let q = 0; q < n * 4 && traces.length < n; q++) { const t = makeTrace(cols, rows); if (t) traces.push(t); }
    pulses = []; flashes = []; if (!RM) traces.forEach((t, i) => { const m = Math.random() < .7 ? 1 : 2; for (let q = 0; q < m; q++) pulses.push(newPulse(i, true)); });
    bake(); measure(); off = Math.min(off, F - H); draw(0, performance.now());
  }
  function bake() {
    bctx.setTransform(dpr, 0, 0, dpr, 0, 0); bctx.clearRect(0, 0, W, F); const [r, g, b] = A; bctx.lineJoin = "round"; bctx.lineCap = "round";
    traces.forEach(t => {
      bctx.beginPath(); t.P.forEach(([x, y], i) => i ? bctx.lineTo(x, y) : bctx.moveTo(x, y)); bctx.strokeStyle = `rgba(${r},${g},${b},.36)`; bctx.lineWidth = 1.5; bctx.stroke();
      [t.P[0], t.P[t.P.length - 1]].forEach(([x, y]) => { bctx.beginPath(); bctx.arc(x, y, 4, 0, 7); bctx.strokeStyle = `rgba(${r},${g},${b},.65)`; bctx.lineWidth = 1.5; bctx.stroke(); bctx.beginPath(); bctx.arc(x, y, 2.1, 0, 7); bctx.fillStyle = `rgba(${r},${g},${b},.8)`; bctx.fill(); });
      for (let i = 1; i < t.P.length - 1; i += 2) { bctx.beginPath(); bctx.arc(t.P[i][0], t.P[i][1], 2, 0, 7); bctx.fillStyle = `rgba(${r},${g},${b},.45)`; bctx.fill(); }
    });
  }
  function draw(dt, now) {
    const sy = Math.round(off * dpr);
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.drawImage(base, 0, sy, cv.width, cv.height, 0, 0, cv.width, cv.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, -sy); ctx.lineCap = "round";
    const [r, g, b] = A, [r2, g2, b2] = B, boost = 1 + Math.min(5, sv * .12);
    pulses.forEach(p => {
      const t = traces[p.i]; p.s += p.v * boost * dt;
      if (p.s - p.len > t.total) { flashes.push({ xy: t.P[t.P.length - 1], t0: now }); if (p.temp) p.dead = true; else Object.assign(p, newPulse(p.i, false)); return; }
      if (t.maxY < off - 30 || t.minY > off + H + 30) return;
      const steps = 14;
      for (let q = 0; q < steps; q++) {
        const d1 = p.s - p.len * q / steps, d0 = p.s - p.len * (q + 1) / steps; if (d1 < 0 || d0 > t.total) continue;
        const P0 = at(t, d0), P1 = at(t, d1); ctx.beginPath(); ctx.moveTo(P0[0], P0[1]); ctx.lineTo(P1[0], P1[1]);
        ctx.strokeStyle = `rgba(${r},${g},${b},${.95 * (1 - q / steps)})`; ctx.lineWidth = 3 * (1 - q / steps) + .8; ctx.stroke();
      }
      if (p.s >= 0 && p.s <= t.total) { const h = at(t, p.s); [[14, .14], [8, .3]].forEach(([rr, aa]) => { ctx.beginPath(); ctx.arc(h[0], h[1], rr, 0, 7); ctx.fillStyle = `rgba(${r},${g},${b},${aa})`; ctx.fill(); }); ctx.beginPath(); ctx.arc(h[0], h[1], 3.4, 0, 7); ctx.fillStyle = `rgba(${r2},${g2},${b2},1)`; ctx.fill(); }
    });
    pulses = pulses.filter(p => !p.dead);
    flashes = flashes.filter(f => now - f.t0 < 700);
    flashes.forEach(f => { if (f.xy[1] < off - 30 || f.xy[1] > off + H + 30) return; const q = (now - f.t0) / 700; ctx.beginPath(); ctx.arc(f.xy[0], f.xy[1], 4 + q * 18, 0, 7); ctx.strokeStyle = `rgba(${r},${g},${b},${.8 * (1 - q)})`; ctx.lineWidth = 1.6; ctx.stroke(); });
    if (ptr) traces.forEach(t => [t.P[0], t.P[t.P.length - 1]].forEach(([x, y]) => { const d = Math.hypot(x - ptr[0], y - (ptr[1] + off)); if (d < 150) { const q = 1 - d / 150; ctx.beginPath(); ctx.arc(x, y, 9 + q * 6, 0, 7); ctx.fillStyle = `rgba(${r},${g},${b},${.35 * q})`; ctx.fill(); } }));
    // fio principal na borda: acende conforme a rolagem
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const tx = W < 700 ? 8 : 16, y0 = 24, y1 = H - 24, head = y0 + prog * (y1 - y0);
    ctx.lineWidth = 2; ctx.strokeStyle = `rgba(${r},${g},${b},.16)`; ctx.beginPath(); ctx.moveTo(tx, y0); ctx.lineTo(tx, y1); ctx.stroke();
    ctx.strokeStyle = `rgba(${r},${g},${b},.8)`; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(tx, y0); ctx.lineTo(tx, head); ctx.stroke();
    for (let i = 0; i <= 6; i++) { const y = y0 + (y1 - y0) * i / 6; ctx.beginPath(); ctx.arc(tx, y, 3.4, 0, 7); if (y <= head + .5) { ctx.fillStyle = `rgba(${r},${g},${b},.95)`; ctx.fill(); } else { ctx.strokeStyle = `rgba(${r},${g},${b},.4)`; ctx.lineWidth = 1.4; ctx.stroke(); } }
    [[13, .14], [7.5, .32]].forEach(([rr, aa]) => { ctx.beginPath(); ctx.arc(tx, head, rr, 0, 7); ctx.fillStyle = `rgba(${r},${g},${b},${aa})`; ctx.fill(); });
    ctx.beginPath(); ctx.arc(tx, head, 3.4, 0, 7); ctx.fillStyle = `rgba(${r2},${g2},${b2},1)`; ctx.fill();
  }
  function spawn(x, y) { let best = null, bd = 170; traces.forEach((t, i) => t.P.forEach((p, vi) => { const d = Math.hypot(p[0] - x, p[1] - y); if (d < bd) { bd = d; best = [i, vi]; } })); if (best && pulses.length < 420) pulses.push({ i: best[0], s: traces[best[0]].cum[best[1]], v: 260, len: 120, temp: true }); }
  function spawnTop() { const c = traces.map((t, i) => i).filter(i => traces[i].minY >= off - 40 && traces[i].minY <= off + H * .5); if (!c.length || pulses.length > 420) return; pulses.push({ i: c[ri(0, c.length - 1)], s: 0, v: 340, len: 130, temp: true }); }

  if (interactive) {
    addEventListener("pointermove", e => { ptr = [e.clientX, e.clientY]; const n = performance.now(); if (n - lastSpawn > 260) { lastSpawn = n; spawn(ptr[0], ptr[1] + off); } });
    document.addEventListener("pointerleave", () => ptr = null);
  }
  let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { if (innerWidth !== W || Math.abs(innerHeight - H) > 150) build(); else { measure(); if (RM) { scrolled(); } } }, 200); });
  function progress() { const m = docH - H; prog = m > 1 ? clamp(scrollY / m, 0, 1) : 0; }
  function scrolled() { measure(); progress(); draw(0, performance.now()); }
  build();
  if (RM) { addEventListener("scroll", () => { progress(); draw(0, performance.now()); }, { passive: true }); return { refresh() { measure(); progress(); draw(0, performance.now()); } }; }
  let last = performance.now();
  (function loop(now) {
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    if (!document.hidden) {
      if ((nf++ % 20) === 0) measure();
      const y = scrollY; sv += (Math.abs(y - lastY) - sv) * .2; lastY = y; progress();
      const tgt = Math.min(F - H, y * par); off += (tgt - off) * .1; if (Math.abs(tgt - off) < .05) off = tgt;
      if (sv > 3 && now - lastTop > 110) { lastTop = now; spawnTop(); }
      draw(dt, now);
    }
    requestAnimationFrame(loop);
  })(last);
  return { refresh() { measure(); } };
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


/* ---------- números que contam (a cada vez que a página Início aparece) ---------- */
(function () {
  const box = $("#stats"); if (!box) return;
  const items = $$("dt[data-count]", box), fmt = n => n.toLocaleString("pt-BR");
  const set = (el, v) => { el.textContent = (el.dataset.pre || "") + fmt(v) + (el.dataset.suf || ""); };
  if (RM) { items.forEach(el => set(el, +el.dataset.count)); return; }
  items.forEach(el => set(el, 0));
  let raf = 0;
  function run() {
    cancelAnimationFrame(raf); const t0 = performance.now(), dur = 1700;
    (function f(now) { const q = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - q, 3); items.forEach(el => set(el, Math.round(e * +el.dataset.count))); if (q < 1) raf = requestAnimationFrame(f); })(t0);
  }
  document.addEventListener("viewshown", e => { if (e.detail === "inicio") setTimeout(run, 300); });
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



/* ---------- páginas e abertura (o A encaixa no quadrado da câmera) ---------- */
(function () {
  const ROUTES = ["inicio", "projetos", "servicos", "obras", "etapas", "contato"];
  const NAMES = { inicio: "ADVM tecnologia", projetos: "Projetos", servicos: "Serviços", obras: "Para quem", etapas: "Como funciona", contato: "Contato" };
  const TITLES = { inicio: "ADVM tecnologia | Segurança eletrônica do projeto à manutenção", projetos: "Projetos | ADVM tecnologia", servicos: "Serviços | ADVM tecnologia", obras: "Para quem trabalhamos | ADVM tecnologia", etapas: "Como funciona | ADVM tecnologia", contato: "Contato | ADVM tecnologia" };
  const views = {}; ROUTES.forEach(r => views[r] = $("#v-" + r));
  const intro = $("#intro"), introT = $("#introT");
  let cur = null, target = null, busy = false, queued = null;
  try { history.scrollRestoration = "manual"; } catch (e) {}

  function setActive(name) {
    $$("[data-r]").forEach(a => { const on = a.dataset.r === name && !a.classList.contains("btn"); a.classList.toggle("act", on); if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    document.title = TITLES[name];
  }
  function swap(name) {
    ROUTES.forEach(r => { views[r].classList.toggle("on", r === name); views[r].classList.remove("enter"); });
    cur = name; scrollTo(0, 0);
    $$("[data-reveal]", views[name]).forEach(el => el.classList.remove("in"));
    reflow(views[name]); setActive(name); BG.refresh();
  }
  function enter(name) {
    const v = views[name]; v.classList.remove("enter"); reflow(v); v.classList.add("enter");
    $$("[data-reveal]", v).forEach(el => io.observe(el));
    document.dispatchEvent(new CustomEvent("viewshown", { detail: name }));
    const h = $("h1, h2", v); if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); }
  }
  function go(name) {
    if (!ROUTES.includes(name)) return;
    if (busy) { queued = name; return; }
    if (name === cur) { scrollTo({ top: 0, behavior: RM ? "auto" : "smooth" }); return; }
    target = name;
    try { if (location.hash.slice(1) !== name) location.hash = name; } catch (e) {}
    if (RM) { swap(name); enter(name); return; }
    busy = true; introT.textContent = NAMES[name];
    intro.classList.remove("run", "out"); reflow(intro); intro.classList.add("show", "run");
    setTimeout(() => swap(name), 460);
    setTimeout(() => { intro.classList.add("out"); enter(name); }, 950);
    setTimeout(() => { intro.classList.remove("show", "out", "run"); busy = false; if (queued) { const q = queued; queued = null; go(q); } }, 1420);
  }

  document.addEventListener("click", e => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const n = a.getAttribute("href").slice(1); if (!ROUTES.includes(n)) return;
    e.preventDefault(); go(n);
  });
  addEventListener("hashchange", () => { const n = location.hash.slice(1); if (ROUTES.includes(n) && n !== target && n !== queued) go(n); });

  // primeira página (abertura da carga)
  const h0 = location.hash.slice(1), first = ROUTES.includes(h0) ? h0 : "inicio";
  target = first; swap(first); introT.textContent = "ADVM tecnologia";
  if (RM) { intro.classList.remove("boot"); enter(first); }
  else { setTimeout(() => enter(first), 1300); setTimeout(() => intro.classList.remove("boot"), 1900); }
})();
