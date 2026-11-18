// ===== CONFIGURAÇÃO =====
// Número do WhatsApp com DDI e DDD, só dígitos (ex.: 5518999999999)
const WHATSAPP = "5500000000000";
const EMPRESA = "ADVM Technology";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
const pad = n => String(n).padStart(2, "0");
const hhmmss = () => { const d = new Date(); return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`; };
const hash = (a, b) => { const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return x - Math.floor(x); };

$("#ano").textContent = new Date().getFullYear();

/* ============ WhatsApp ============ */
$("#zap").href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Olá! Gostaria de um orçamento.")}`;
$("#form").addEventListener("submit", e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const t = `Olá, ${EMPRESA}! Meu nome é ${f.get("nome")}.\nTelefone: ${f.get("tel")}\nProjeto: ${f.get("tipo")}\n${f.get("msg") || ""}`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(t)}`, "_blank");
});

/* ============ Boot da central ============ */
(function () {
  const boot = $("#boot"), pre = $("#bootTxt");
  if (RM) { boot.remove(); return; }
  const lines = ["> ADVM TECHNOLOGY · CENTRAL DE SEGURANÇA", "> CAM 01 ........ OK", "> CAM 02 ........ OK", "> CAM 03 ........ OK", "> CAM 04 ........ OK", "> SISTEMA ONLINE"];
  let i = 0;
  const iv = setInterval(() => { pre.textContent += (i ? "\n" : "") + lines[i++]; if (i >= lines.length) { clearInterval(iv); setTimeout(off, 350); } }, 140);
  function off() { boot.classList.add("off"); setTimeout(() => boot.remove(), 600); }
  setTimeout(() => { clearInterval(iv); off(); }, 3000);
})();

/* ============ Ruído de TV (troca de câmera) ============ */
const stat = $("#static"), sctx = stat.getContext("2d");
stat.width = 192; stat.height = 108;
function noiseFrame() {
  const im = sctx.createImageData(192, 108), d = im.data;
  for (let i = 0; i < d.length; i += 4) { const v = Math.random() * 255 | 0; d[i] = v * .7; d[i + 1] = v; d[i + 2] = v; d[i + 3] = 235; }
  sctx.putImageData(im, 0, 0);
  sctx.fillStyle = "rgba(219,232,143,.25)"; sctx.fillRect(0, Math.random() * 108, 192, 3);
}
function glitchTo(fn) {
  if (RM) { fn(); return; }
  stat.classList.add("on");
  const iv = setInterval(noiseFrame, 40);
  setTimeout(fn, 130);
  setTimeout(() => { clearInterval(iv); stat.classList.remove("on"); }, 320);
}
const sysTxt = $("#sysTxt");
const nav = $("#nav"), burger = $("#burger");
burger.addEventListener("click", () => {
  const on = nav.classList.toggle("on"); burger.classList.toggle("on", on); burger.setAttribute("aria-expanded", on);
});
$$("a[data-cam]").forEach(a => a.addEventListener("click", e => {
  const id = a.getAttribute("href"), tgt = id && id.length > 1 && $(id);
  nav.classList.remove("on"); burger.classList.remove("on");
  if (!tgt) return;
  e.preventDefault();
  glitchTo(() => { tgt.scrollIntoView({ behavior: "instant", block: "start" }); history.replaceState(null, "", id); });
}));

// indicador de câmera ativa
(function () {
  const map = { inicio: "SISTEMA ONLINE · 4/4 CÂMERAS", solucoes: "VISUALIZANDO · CAM 01", planta: "VISUALIZANDO · CAM 02", incendio: "VISUALIZANDO · CAM 03", obras: "VISUALIZANDO · CAM 04", processo: "VISUALIZANDO · CAM 05", contato: "ACESSO RESTRITO" };
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) sysTxt.textContent = map[e.target.id] || sysTxt.textContent; }), { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach(s => io.observe(s));
})();

/* ============ Cursor mira ============ */
(function () {
  const c = $("#cross");
  addEventListener("pointermove", e => { c.classList.add("on"); c.style.left = e.clientX + "px"; c.style.top = e.clientY + "px"; });
  document.addEventListener("pointerover", e => { c.classList.toggle("lock", !!e.target.closest("a,button,.feed")); });
})();

/* ============ Reveal ============ */
(function () {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
  $$(".rv").forEach((el, i) => { el.style.transitionDelay = (i % 3) * 80 + "ms"; io.observe(el); });
})();

/* ============ Câmeras (parede de monitores) ============ */
const SCENES = {
  fachada(c, t, w, h) {
    const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#070d1c"); g.addColorStop(1, "#14223a");
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.fillStyle = "#9fb8d8";
    for (let i = 0; i < 34; i++) { c.globalAlpha = .25 + .45 * (.5 + .5 * Math.sin(t + i * 1.7)); c.fillRect(hash(i, 2) * w, hash(i, 3) * 60, 1, 1); }
    c.globalAlpha = 1;
    c.fillStyle = "#111a2b"; c.fillRect(60, 34, 200, 108); c.fillStyle = "#0d1523"; c.fillRect(56, 28, 208, 7);
    const k = Math.floor(t / 5);
    for (let r = 0; r < 6; r++) for (let col = 0; col < 9; col++) {
      c.fillStyle = hash(col * 7 + r, k) < .32 ? "#ffd27a" : "#18243a"; c.fillRect(68 + col * 21, 42 + r * 16, 13, 10);
    }
    c.fillStyle = "#0a0f17"; c.fillRect(0, 142, w, 38);
    const lg = c.createRadialGradient(160, 142, 2, 160, 142, 70); lg.addColorStop(0, "rgba(255,210,122,.35)"); lg.addColorStop(1, "rgba(255,210,122,0)");
    c.fillStyle = lg; c.fillRect(80, 100, 160, 80);
    c.fillStyle = "#1a2535"; c.fillRect(148, 122, 24, 20);
    c.strokeStyle = "#2a3a4e"; c.lineWidth = 1;
    for (let x = 0; x < w; x += 9) { c.beginPath(); c.moveTo(x, 148); c.lineTo(x, 164); c.stroke(); }
    c.beginPath(); c.moveTo(0, 150); c.lineTo(w, 150); c.moveTo(0, 162); c.lineTo(w, 162); c.stroke();
    const px = ((t * 20) % 380) - 30, y0 = 172, sw = Math.sin(t * 8) * 3;
    c.strokeStyle = "#d6ecf5"; c.fillStyle = "#d6ecf5"; c.lineWidth = 1.6;
    c.beginPath(); c.arc(px, y0 - 29, 3.2, 0, 7); c.fill();
    c.beginPath(); c.moveTo(px, y0 - 25); c.lineTo(px, y0 - 12); c.moveTo(px, y0 - 12); c.lineTo(px - sw, y0); c.moveTo(px, y0 - 12); c.lineTo(px + sw, y0);
    c.moveTo(px, y0 - 22); c.lineTo(px + sw, y0 - 15); c.moveTo(px, y0 - 22); c.lineTo(px - sw, y0 - 15); c.stroke();
    if (px > 12 && px < 308) { box(c, px - 10, y0 - 36, 20, 40, "PESSOA 97%"); return ["PESSOA DETECTADA", true]; }
    return ["SEM MOVIMENTO", false];
  },
  garagem(c, t, w, h) {
    c.fillStyle = "#080d14"; c.fillRect(0, 0, w, h);
    poly(c, [[0, 0], [320, 0], [210, 56], [110, 56]], "#0c141e"); poly(c, [[0, 0], [110, 56], [110, 96], [0, 180]], "#0a111a");
    poly(c, [[320, 0], [210, 56], [210, 96], [320, 180]], "#0a111a"); poly(c, [[0, 180], [320, 180], [210, 96], [110, 96]], "#111a26");
    c.fillStyle = "#070b11"; c.fillRect(110, 56, 100, 40);
    [[6, 84], [20, 58], [32, 38], [42, 24]].forEach(([y, wd], i) => { c.fillStyle = `rgba(190,225,255,${.45 + .4 * hash(i, Math.floor(t * 3))})`; c.fillRect(160 - wd / 2, y, wd, 2.5); });
    c.strokeStyle = "#3a4a5c"; c.lineWidth = 1.4;
    [[30, 125], [110, 143], [210, 177], [290, 195]].forEach(([x, vx]) => { c.beginPath(); c.moveTo(x, 180); c.lineTo(vx, 96); c.stroke(); });
    c.fillStyle = "#18222f"; c.fillRect(8, 112, 14, 68); c.fillRect(298, 112, 14, 68);
    car(c, 30, 140, "#1d2838", false); car(c, 238, 140, "#222d3d", false);
    const u = (t * .11) % 1, x = 340 - u * 420;
    car(c, x, 126, "#2a3a50", true);
    if (x > 10 && x < 290) { box(c, x - 4, 108, 66, 40, "VEÍCULO"); return ["VEÍCULO EM MOVIMENTO", true]; }
    return ["SEM MOVIMENTO", false];
  },
  acesso(c, t, w, h) {
    c.fillStyle = "#0d141d"; c.fillRect(0, 0, w, h); c.fillStyle = "#0f1822"; c.fillRect(0, 130, w, 50);
    c.fillStyle = "#17212e"; c.fillRect(116, 30, 88, 100); c.fillStyle = "#05080c"; c.fillRect(120, 34, 80, 96);
    const p = t % 12; let px = -12, sc = 1, led = "#3a4a5a", a = 0, st = ["AGUARDANDO", false], show = true;
    if (p < 5) px = -12 + (p / 5) * 152;
    else if (p < 6.2) { px = 140; led = "#ffb020"; st = ["LENDO CRACHÁ", true]; }
    else if (p < 7.4) { px = 140; led = "#3dff8b"; a = (p - 6.2) / 1.2; st = ["ACESSO LIBERADO", false]; }
    else if (p < 11) { const q = (p - 7.4) / 3.6; px = 140 + q * 20; sc = 1 - q * .55; led = "#3dff8b"; a = 1; st = ["ACESSO LIBERADO", false]; }
    else { show = false; a = Math.max(0, 1 - (p - 11)); }
    c.save(); c.beginPath(); c.rect(120, 34, 80, 96); c.clip();
    if (show && p > 7.4) { c.fillStyle = "rgba(190,225,255,.12)"; c.fillRect(120, 34, 80, 96); }
    c.fillStyle = "#1c2938"; c.fillRect(120 - a * 40, 34, 40, 96); c.fillRect(160 + a * 40, 34, 40, 96);
    c.restore();
    c.fillStyle = "#0a0f15"; c.fillRect(214, 80, 12, 20); c.fillStyle = led; c.shadowColor = led; c.shadowBlur = 8; c.beginPath(); c.arc(220, 86, 2.6, 0, 7); c.fill(); c.shadowBlur = 0;
    c.strokeStyle = "#35495c"; c.lineWidth = 2; c.beginPath(); c.moveTo(60, 128); c.lineTo(112, 128); c.moveTo(208, 128); c.lineTo(260, 128); c.stroke();
    if (show) {
      const y0 = 170, s = Math.sin(t * 8) * 3 * sc, hh = 46 * sc;
      c.strokeStyle = c.fillStyle = "#d6ecf5"; c.lineWidth = 1.6 * sc + .4;
      c.beginPath(); c.arc(px, y0 - hh * .88, 3.4 * sc, 0, 7); c.fill();
      c.beginPath(); c.moveTo(px, y0 - hh * .8); c.lineTo(px, y0 - hh * .4); c.lineTo(px - s, y0); c.moveTo(px, y0 - hh * .4); c.lineTo(px + s, y0);
      c.moveTo(px, y0 - hh * .72); c.lineTo(px + s, y0 - hh * .5); c.moveTo(px, y0 - hh * .72); c.lineTo(px - s, y0 - hh * .5); c.stroke();
      if (px > 4 && p < 11) box(c, px - 11 * sc, y0 - hh - 4, 22 * sc, hh + 6, p > 6.2 ? "AUTORIZADO" : "VISITANTE");
    }
    return st;
  },
  corredor(c, t, w, h) {
    c.fillStyle = "#070c12"; c.fillRect(0, 0, w, h);
    poly(c, [[0, 180], [320, 180], [200, 96], [120, 96]], "#101a26"); poly(c, [[0, 0], [320, 0], [200, 72], [120, 72]], "#0c141e");
    poly(c, [[0, 0], [120, 72], [120, 96], [0, 180]], "#0a121c"); poly(c, [[320, 0], [200, 72], [200, 96], [320, 180]], "#0a121c");
    c.fillStyle = "#08101a"; c.fillRect(120, 72, 80, 24);
    [[18, 46], [58, 78], [90, 104]].forEach(([a, b]) => { [0, 1].forEach(side => {
      const X = x => side ? 320 - x : x, top = x => x * .6, bot = x => 180 - x * .7;
      poly(c, [[X(a), top(a) + 14 + a * .08], [X(b), top(b) + 10 + b * .08], [X(b), bot(b) - 6], [X(a), bot(a) - 8]], "#162433");
    }); });
    [[8, 70], [30, 44], [48, 26], [60, 16]].forEach(([y, wd], i) => { c.fillStyle = `rgba(200,230,255,${.4 + .5 * hash(i + 3, Math.floor(t * 2.5))})`; c.fillRect(160 - wd / 2, y, wd, 3); });
    const s = .5 + .5 * Math.sin(t * .35), yb = 98 + 80 * s * .75, hh = 12 + 62 * s * .75, sw = Math.sin(t * 6) * 2 * s * 1.4;
    c.strokeStyle = c.fillStyle = "#d6ecf5"; c.lineWidth = 1 + s;
    c.beginPath(); c.arc(160, yb - hh * .88, 2 + 2 * s, 0, 7); c.fill();
    c.beginPath(); c.moveTo(160, yb - hh * .8); c.lineTo(160, yb - hh * .4); c.lineTo(160 - sw, yb); c.moveTo(160, yb - hh * .4); c.lineTo(160 + sw, yb); c.stroke();
    return ["ÁREA OK", false];
  }
};
function poly(c, pts, fill) { c.fillStyle = fill; c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.fill(); }
function car(c, x, y, col, lights) {
  c.fillStyle = col; c.fillRect(x, y + 8, 58, 20); c.fillRect(x + 10, y, 36, 12); c.fillStyle = "#0a111a"; c.fillRect(x + 13, y + 2, 12, 8); c.fillRect(x + 28, y + 2, 15, 8);
  c.fillStyle = "#05080c"; c.fillRect(x + 6, y + 26, 12, 5); c.fillRect(x + 40, y + 26, 12, 5);
  if (lights) { const g = c.createRadialGradient(x, y + 16, 1, x, y + 16, 46); g.addColorStop(0, "rgba(255,240,180,.55)"); g.addColorStop(1, "rgba(255,240,180,0)"); c.fillStyle = g; c.fillRect(x - 50, y - 30, 100, 90); c.fillStyle = "#fff6c8"; c.fillRect(x, y + 13, 4, 4); }
}
function box(c, x, y, w, h, label) {
  c.strokeStyle = "#ffb020"; c.lineWidth = 1; c.strokeRect(x, y, w, h);
  c.fillStyle = "#ffb020"; c.fillRect(x, y - 8, Math.max(w, label.length * 4.6 + 4), 8);
  c.fillStyle = "#000"; c.font = "bold 6px monospace"; c.fillText(label, x + 2, y - 2);
}
(function () {
  const feeds = $$(".feed").map(f => ({ el: f, cv: $("canvas", f), ctx: $("canvas", f).getContext("2d"), st: $(".st", f), ts: $(".ts", f), scene: SCENES[f.dataset.scene], last: "" }));
  let vis = true, tt = 0, lastDraw = 0;
  new IntersectionObserver(es => { vis = es[0].isIntersecting; }, { threshold: 0 }).observe($("#wall"));
  function draw(now) {
    if (vis && !document.hidden && now - lastDraw > 80) {
      lastDraw = now; tt = now / 1000;
      const d = new Date(), stamp = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${hhmmss()}`;
      feeds.forEach(f => {
        const c = f.ctx, [txt, alert] = f.scene(c, tt, 320, 180);
        c.fillStyle = "rgba(255,255,255,.07)";
        for (let i = 0; i < 90; i++) c.fillRect(Math.random() * 320, Math.random() * 180, 1, 1);
        if (Math.random() < .015) { c.fillStyle = "rgba(255,255,255,.08)"; c.fillRect(0, Math.random() * 180, 320, 3 + Math.random() * 6); }
        f.ts.textContent = stamp;
        if (txt !== f.last) { f.last = txt; f.st.textContent = txt; f.st.classList.toggle("alert", alert); }
      });
    }
    if (!RM) requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
  if (RM) { setTimeout(() => draw(1000), 50); }
  const shade = $("#shade");
  function unfocus() { $$(".feed.is-focus").forEach(f => f.classList.remove("is-focus")); shade.classList.remove("on"); }
  feeds.forEach(f => {
    const toggle = () => { const on = !f.el.classList.contains("is-focus"); unfocus(); if (on) { f.el.classList.add("is-focus"); shade.classList.add("on"); } };
    f.el.addEventListener("click", toggle);
    f.el.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
  });
  shade.addEventListener("click", unfocus);
  addEventListener("keydown", e => { if (e.key === "Escape") unfocus(); });
})();

/* ============ utilidades das simulações ============ */
const NS = "http://www.w3.org/2000/svg";
function S(tag, attrs, parent) { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
function logger(ul) {
  return (txt, cls = "") => { const li = document.createElement("li"); if (cls) li.className = cls; li.innerHTML = `<b>${hhmmss()}</b>${txt}`; ul.prepend(li); while (ul.children.length > 6) ul.lastChild.remove(); };
}
function viewFlag(el) { const o = { v: false }; new IntersectionObserver(es => { o.v = es[0].isIntersecting; }, { threshold: 0 }).observe(el); return o; }

/* ============ Simulação: planta do condomínio ============ */
(function () {
  const svg = $("#plan"), log = logger($("#planLog")), led = $("#planLed"), st = $("#planSt"), go = $("#planGo"), reset = $("#planReset");
  S("rect", { x: 0, y: 0, width: 800, height: 480, fill: "#0b0d0a" }, svg);
  for (let x = 0; x <= 800; x += 40) S("path", { d: `M${x} 0V480`, stroke: "#0c141c", "stroke-width": 1 }, svg);
  for (let y = 0; y <= 480; y += 40) S("path", { d: `M0 ${y}H800`, stroke: "#0c141c", "stroke-width": 1 }, svg);
  S("path", { class: "plan-fence", d: "M370 440H60V40H740V440H430" }, svg);
  [[300, 150, 200, 130, "BLOCO A"], [110, 300, 130, 90, "GARAGEM"], [560, 300, 130, 90, "BLOCO B"], [140, 110, 100, 70, "LAZER"]].forEach(([x, y, w, h, l]) => {
    S("rect", { class: "plan-bld", x, y, width: w, height: h, rx: 4 }, svg);
    S("text", { class: "plan-txt", x: x + w / 2, y: y + h / 2 + 4, "text-anchor": "middle" }, svg).textContent = l;
  });
  S("text", { class: "plan-txt", x: 400, y: 466, "text-anchor": "middle" }, svg).textContent = "PORTARIA / ACESSO";
  S("rect", { x: 300, y: 205, width: 6, height: 20, fill: "#dbe88f" }, svg);
  const sensors = [];
  const sp = (x, y) => sensors.push({ x, y, el: S("circle", { class: "sensor", cx: x, cy: y, r: 6 }, svg), hit: false });
  for (let x = 60; x <= 740; x += 56) { sp(x, 40); if (x < 370 || x > 430) sp(x, 440); }
  for (let y = 96; y < 440; y += 56) { sp(60, y); sp(740, y); }
  const cams = [[80, 62, 45], [720, 62, 135], [720, 418, 225], [80, 418, 315]].map(([x, y, a], i) => {
    const cone = S("path", { class: "cone" }, svg); const b = S("circle", { class: "cam-b", cx: x, cy: y, r: 9 }, svg);
    S("text", { class: "plan-txt", x: x + (x < 400 ? 14 : -14), y: y + (y < 240 ? -10 : 18), "text-anchor": x < 400 ? "start" : "end" }, svg).textContent = "CAM " + (i + 1);
    return { x, y, base: a, ang: a, cone, b };
  });
  const dot = S("circle", { class: "intruder", r: 7, cx: -20, cy: -20, opacity: 0 }, svg);
  const route = [[16, 70], [60, 96], [200, 200], [296, 215]];
  const segs = []; let total = 0;
  for (let i = 1; i < route.length; i++) { const l = Math.hypot(route[i][0] - route[i - 1][0], route[i][1] - route[i - 1][1]); segs.push(l); total += l; }
  const SPEED = 75; let running = false, t0 = 0, evs = {};
  const rad = d => d * Math.PI / 180;
  function conePath(c) { const L = 230, h = rad(28), a = rad(c.ang); return `M${c.x} ${c.y}L${c.x + Math.cos(a - h) * L} ${c.y + Math.sin(a - h) * L}A${L} ${L} 0 0 1 ${c.x + Math.cos(a + h) * L} ${c.y + Math.sin(a + h) * L}Z`; }
  function posAt(d) { let i = 0; while (i < segs.length - 1 && d > segs[i]) { d -= segs[i]; i++; } const k = Math.min(1, d / segs[i]); return [route[i][0] + (route[i + 1][0] - route[i][0]) * k, route[i][1] + (route[i + 1][1] - route[i][1]) * k]; }
  function setSt(txt, cls) { st.textContent = txt; led.className = "led" + (cls ? " " + cls : ""); }
  function doReset() {
    running = false; evs = {}; dot.setAttribute("opacity", 0); sensors.forEach(s => { s.hit = false; s.el.classList.remove("hit"); });
    cams.forEach(c => c.cone.classList.remove("alert")); setSt("SISTEMA ARMADO", ""); go.disabled = false; $("#planLog").innerHTML = ""; log("Sistema armado. Perímetro monitorado.", "g");
  }
  go.addEventListener("click", () => { if (running) return; doReset(); running = true; t0 = performance.now(); dot.setAttribute("opacity", 1); go.disabled = true; setSt("MONITORANDO", "warn"); log("Movimento fora do perímetro", "a"); });
  reset.addEventListener("click", doReset);
  const vf = viewFlag(svg);
  function frame(now) {
    if (vf.v) {
      const t = now / 1000; let target = null, near = null;
      if (running) {
        const d = Math.min(total, (now - t0) / 1000 * SPEED), [x, y] = posAt(d); dot.setAttribute("cx", x); dot.setAttribute("cy", y);
        sensors.forEach((s, i) => { if (!s.hit && Math.hypot(s.x - x, s.y - y) < 24) { s.hit = true; s.el.classList.add("hit"); if (!evs.first) { evs.first = 1; setSt("ALARME · SETOR " + (y < 240 ? "NORTE" : "SUL") + (x < 400 ? "/OESTE" : "/LESTE"), "alert"); log(`SENSOR ${pad(i + 1)} · VIOLAÇÃO DE PERÍMETRO`, "r"); } } });
        let best = 1e9; cams.forEach(c => { const dd = Math.hypot(c.x - x, c.y - y); if (dd < best) { best = dd; near = c; } });
        if (evs.first) { target = Math.atan2(y - near.y, x - near.x) * 180 / Math.PI; if (!evs.cam) { evs.cam = 1; log(`CAM ${cams.indexOf(near) + 1} · SEGUINDO ALVO`, "a"); } }
        if (d >= total && !evs.end) { evs.end = now; log("ALVO NA ENTRADA DO BLOCO A", "r"); }
        if (evs.end && !evs.team && now - evs.end > 1500) { evs.team = 1; log("EQUIPE DE RESPOSTA ACIONADA", "g"); log("VÍDEO DO EVENTO GRAVADO", "g"); setSt("OCORRÊNCIA ENCAMINHADA", "warn"); go.disabled = false; running = false; }
      }
      cams.forEach(c => {
        const alert = running && evs.first && c === near;
        if (alert && target !== null) { let diff = ((target - c.ang + 540) % 360) - 180; c.ang += diff * .08; } else { const want = c.base + Math.sin(t * .6 + c.base) * 18; c.ang += (want - c.ang) * .08; }
        c.cone.classList.toggle("alert", !!alert); c.cone.setAttribute("d", conePath(c));
      });
    }
    requestAnimationFrame(frame);
  }
  doReset(); requestAnimationFrame(frame);
})();

/* ============ Simulação: incêndio ============ */
(function () {
  const svg = $("#fire"), log = logger($("#fireLog")), led = $("#fireLed"), st = $("#fireSt"), go = $("#fireGo"), reset = $("#fireReset");
  S("rect", { width: 600, height: 500, fill: "#0b0d0a" }, svg);
  const defs = S("defs", {}, svg);
  const lg = S("linearGradient", { id: "fg", x1: 0, y1: 1, x2: 0, y2: 0 }, defs); S("stop", { offset: 0, "stop-color": "#ff3b1a" }, lg); S("stop", { offset: .6, "stop-color": "#ff9a1a" }, lg); S("stop", { offset: 1, "stop-color": "#ffe27a" }, lg);
  const clip = S("clipPath", { id: "uclip" }, defs); S("rect", { x: 180, y: 220, width: 120, height: 80 }, clip);
  S("rect", { x: 60, y: 60, width: 480, height: 400, fill: "#0b131c", stroke: "#26384a", "stroke-width": 2 }, svg);
  S("path", { d: "M50 60L300 20L550 60", fill: "none", stroke: "#26384a", "stroke-width": 2 }, svg);
  S("rect", { x: 0, y: 460, width: 600, height: 40, fill: "#070b10" }, svg);
  const dets = {};
  for (let f = 0; f < 5; f++) {
    const y = 60 + f * 80;
    if (f) S("path", { d: `M60 ${y}H540`, stroke: "#26384a", "stroke-width": 2 }, svg);
    S("text", { class: "plan-txt", x: 48, y: y + 44, "text-anchor": "end" }, svg).textContent = f === 4 ? "T" : (5 - f) + "º";
    for (let u = 0; u < 3; u++) {
      const x = 60 + u * 120;
      if (u) S("path", { d: `M${x} ${y}V${y + 80}`, stroke: "#1b2a38", "stroke-width": 1.5 }, svg);
      S("rect", { x: x + 38, y: y + 28, width: 44, height: 28, rx: 2, fill: hash(f, u) < .5 ? "#14283a" : "#0f1d2b", stroke: "#1f3547" }, svg);
      dets[f + "" + u] = S("circle", { class: "det", cx: x + 60, cy: y + 12, r: 6 }, svg);
    }
    S("path", { d: `M420 ${y}V${y + 80}`, stroke: "#26384a", "stroke-width": 2 }, svg);
    S("path", { d: `M430 ${y + 74}H530M430 ${y + 74}L530 ${y + 4}`, stroke: "#1b2a38", "stroke-width": 1.5, fill: "none" }, svg);
  }
  S("text", { class: "plan-txt", x: 480, y: 52, "text-anchor": "middle" }, svg).textContent = "ESCADA";
  const strobe = S("rect", { class: "strobe", x: 60, y: 60, width: 480, height: 400 }, svg);
  const arrows = S("path", { class: "arrow", d: "M475 90L440 120L520 150L440 190L520 230L440 270L520 310L440 350L520 390L480 440", opacity: 0 }, svg);
  const fire = S("g", { opacity: 0 }, svg);
  ["M215 300C205 280 215 270 220 250C228 262 238 258 236 240C250 258 262 270 255 300Z", "M240 300C236 285 246 278 250 262C258 274 268 280 262 300Z", "M195 300C195 288 202 282 205 272C212 282 216 290 214 300Z"].forEach(d => S("path", { class: "flame", d, fill: "url(#fg)" }, fire));
  S("circle", { cx: 240, cy: 300, r: 30, fill: "rgba(255,120,30,.18)" }, fire);
  const smokeG = S("g", { "clip-path": "url(#uclip)" }, svg), smoke = [];
  for (let i = 0; i < 16; i++) smoke.push(S("circle", { cx: 240, cy: 300, r: 6, fill: "#6c7a86", opacity: 0 }, smokeG));
  const spr = S("g", { opacity: 0 }, svg), drops = [];
  for (let i = 0; i < 14; i++) drops.push(S("path", { d: "M0 0V8", stroke: "#4db8ff", "stroke-width": 2, "stroke-linecap": "round" }, spr));
  S("circle", { cx: 240, cy: 226, r: 4, fill: "#4db8ff" }, svg);
  const det = dets["21"];
  let phase = "idle", t0 = 0, fired = {};
  function setSt(txt, cls) { st.textContent = txt; led.className = "led" + (cls ? " " + cls : ""); }
  function doReset() {
    phase = "idle"; fired = {}; fire.setAttribute("opacity", 0); fire.style.transform = ""; spr.setAttribute("opacity", 0); arrows.setAttribute("opacity", 0);
    strobe.classList.remove("on"); det.classList.remove("hit"); smoke.forEach(s => s.setAttribute("opacity", 0));
    setSt("CENTRAL NORMAL", ""); go.disabled = false; $("#fireLog").innerHTML = ""; log("Central normal. 15 detectores online.", "g");
  }
  go.addEventListener("click", () => { if (phase !== "idle") return; doReset(); phase = "run"; t0 = performance.now(); go.disabled = true; });
  reset.addEventListener("click", doReset);
  const ev = [
    [.2, () => { fire.setAttribute("opacity", 1); setSt("ANOMALIA", "warn"); log("Calor anormal · 3º andar", "a"); }],
    [1.8, () => { det.classList.add("hit"); setSt("ALARME · 3º ANDAR", "alert"); strobe.classList.add("on"); log("DETECTOR 3B · FUMAÇA CONFIRMADA", "r"); }],
    [2.4, () => { arrows.setAttribute("opacity", 1); log("SIRENE ACIONADA · EVACUAÇÃO INICIADA", "r"); }],
    [3.4, () => log("BOMBEIROS NOTIFICADOS PELA CENTRAL", "a")],
    [4.2, () => { spr.setAttribute("opacity", 1); log("SPRINKLER ACIONADO NA ZONA 3B", "g"); }],
    [8, () => { fired.out = performance.now(); log("FOCO CONTROLADO", "g"); }],
    [10.5, () => { strobe.classList.remove("on"); arrows.setAttribute("opacity", 0); spr.setAttribute("opacity", 0); setSt("OCORRÊNCIA ENCERRADA", "warn"); log("Central aguardando rearme.", "g"); phase = "done"; go.disabled = false; }]
  ];
  const vf = viewFlag(svg);
  function frame(now) {
    if (vf.v && phase === "run") {
      const t = (now - t0) / 1000;
      ev.forEach((e, i) => { if (t >= e[0] && !fired[i]) { fired[i] = true; e[1](); } });
      const burn = t < 8 ? 1 : Math.max(0, 1 - (now - fired.out) / 1500);
      fire.style.transformBox = "fill-box"; fire.style.transformOrigin = "50% 100%"; fire.style.transform = `scale(${burn})`;
      smoke.forEach((s, i) => {
        const life = ((t * .5 + i / smoke.length) % 1), on = t > .6 && t < 10 ? 1 : 0;
        s.setAttribute("cx", 240 + Math.sin(i * 2.1 + t) * (14 + life * 30)); s.setAttribute("cy", 292 - life * 78); s.setAttribute("r", 8 + life * 22);
        s.setAttribute("opacity", on * Math.min(1, t / 3) * (.5 - life * .32));
      });
      if (fired[4]) drops.forEach((d, i) => { const k = ((t * 1.6 + i * .37) % 1); d.setAttribute("transform", `translate(${196 + (i % 7) * 15},${230 + k * 66})`); d.setAttribute("opacity", 1 - k); });
    }
    requestAnimationFrame(frame);
  }
  doReset(); requestAnimationFrame(frame);
})();

/* ============ Porta de acesso (formulário) ============ */
(function () {
  const door = $("#door"), btn = $("#readerBtn"), ring = $("#readerRing"), txt = $("#readerTxt"), reader = $(".reader");
  if (RM) { door.classList.add("open"); return; }
  const L = 276.5, HOLD = 900; let raf = 0, t0 = 0, done = false;
  function open() { if (done) return; done = true; cancelAnimationFrame(raf); ring.style.strokeDashoffset = 0; reader.classList.add("ok"); txt.textContent = "ACESSO LIBERADO"; setTimeout(() => { door.classList.add("open"); door.setAttribute("aria-hidden", "true"); }, 250); }
  function step(now) { const p = Math.min(1, (now - t0) / HOLD); ring.style.strokeDashoffset = L * (1 - p); if (p >= 1) open(); else raf = requestAnimationFrame(step); }
  function down(e) { if (done) return; e.preventDefault(); t0 = performance.now(); txt.textContent = "LENDO CREDENCIAL..."; cancelAnimationFrame(raf); raf = requestAnimationFrame(step); }
  function up() { if (done) return; cancelAnimationFrame(raf); ring.style.strokeDashoffset = L; txt.textContent = "SEGURE PARA AUTENTICAR"; }
  btn.addEventListener("pointerdown", down); ["pointerup", "pointerleave", "pointercancel"].forEach(ev => btn.addEventListener(ev, up));
  btn.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
})();
