// ===== CONFIGURAÇÃO =====
// Número do WhatsApp com DDI e DDD, só dígitos (ex.: 5518999999999)
const WHATSAPP = "5500000000000";
const EMPRESA = "NOME DA EMPRESA";

document.getElementById("ano").textContent = new Date().getFullYear();

// ===== menu mobile =====
const burger = document.getElementById("burger"), nav = document.getElementById("nav");
burger.addEventListener("click", () => {
  const on = nav.classList.toggle("on");
  burger.classList.toggle("on", on);
  burger.setAttribute("aria-expanded", on);
});
nav.addEventListener("click", e => { if (e.target.tagName === "A") { nav.classList.remove("on"); burger.classList.remove("on"); } });

// ===== WhatsApp =====
document.getElementById("zap").href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Olá! Gostaria de um orçamento.")}`;
document.getElementById("form").addEventListener("submit", e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const t = `Olá, ${EMPRESA}! Meu nome é ${f.get("nome")}.\nTelefone: ${f.get("tel")}\nProjeto: ${f.get("tipo")}\n${f.get("msg") || ""}`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(t)}`, "_blank");
});

// ===== relógio da "câmera" =====
const clock = document.getElementById("clock");
setInterval(() => { clock.textContent = new Date().toTimeString().slice(0, 8); }, 1000);

// ===== rede de pontos (canvas) =====
(function () {
  const c = document.getElementById("net"), x = c.getContext("2d");
  let w, h, pts, mx = -999, my = -999;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function size() {
    const r = c.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
    w = r.width; h = r.height; c.width = w * d; c.height = h * d; x.setTransform(d, 0, 0, d, 0, 0);
    const n = Math.round(Math.min(90, (w * h) / 16000));
    pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 }));
  }
  function draw() {
    x.clearRect(0, 0, w, h);
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    }
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      for (let j = i + 1; j < pts.length; j++) {
        const b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 150) { x.strokeStyle = `rgba(0,229,255,${(1 - d / 150) * .28})`; x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.stroke(); }
      }
      const dm = Math.hypot(a.x - mx, a.y - my);
      if (dm < 180) { x.strokeStyle = `rgba(0,229,255,${(1 - dm / 180) * .6})`; x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(mx, my); x.stroke(); }
      x.fillStyle = "rgba(0,229,255,.85)"; x.fillRect(a.x - 1.5, a.y - 1.5, 3, 3);
    }
    if (!reduce) requestAnimationFrame(draw);
  }
  size(); draw();
  addEventListener("resize", size);
  c.parentElement.addEventListener("pointermove", e => { const r = c.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
})();

// ===== cursor =====
const cur = document.getElementById("cursor");
addEventListener("pointermove", e => { cur.classList.add("on"); cur.style.left = e.clientX + "px"; cur.style.top = e.clientY + "px"; });
document.querySelectorAll("[data-hover],a,button").forEach(el => {
  el.addEventListener("mouseenter", () => cur.classList.add("big"));
  el.addEventListener("mouseleave", () => cur.classList.remove("big"));
});

// ===== GSAP + Lenis (se falhar, a página continua legível) =====
if (window.gsap && window.ScrollTrigger && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.documentElement.classList.add("js");
  gsap.registerPlugin(ScrollTrigger);

  if (window.Lenis) {
    const lenis = new Lenis({ lerp: 0.09 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener("click", e => {
      const id = a.getAttribute("href"); if (id.length > 1 && document.querySelector(id)) { e.preventDefault(); lenis.scrollTo(id, { offset: -10 }); }
    }));
  }

  // hero: máscara subindo linha a linha
  gsap.fromTo(".hero .line>span", { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: "power4.out", stagger: .12, delay: .15 });
  gsap.from([".hero .tag", ".hero__foot", ".hud"], { opacity: 0, y: 24, duration: 1, ease: "power3.out", stagger: .15, delay: .6 });

  // títulos de seção e blocos
  gsap.utils.toArray(".head, .stat, .row, .sobre__g > *, .contato__g > *, .marq").forEach(el => {
    el.classList.add("rv");
    gsap.to(el, { opacity: 1, y: 0, duration: .9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } });
  });

  // contadores
  document.querySelectorAll("[data-n]").forEach(el => {
    const alvo = parseInt(el.dataset.n, 10), pre = el.textContent.startsWith("+") ? "+" : "";
    const o = { v: 0 };
    gsap.to(o, { v: alvo, duration: 1.6, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 90%" }, onUpdate() { el.textContent = pre + String(Math.round(o.v)).padStart(2, "0"); } });
  });

  // segmentos: rolagem horizontal fixada (só no desktop)
  ScrollTrigger.matchMedia({
    "(min-width: 901px)": function () {
      const track = document.getElementById("track");
      gsap.to(track, {
        x: () => -(track.scrollWidth - innerWidth + innerWidth * 0.08),
        ease: "none",
        scrollTrigger: { trigger: ".seg", start: "top top", end: () => "+=" + track.scrollWidth, pin: ".seg__pin", scrub: 1, invalidateOnRefresh: true }
      });
    }
  });
}
