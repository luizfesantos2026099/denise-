// Troque pelo número real, com DDI e DDD, só dígitos (ex.: 5518999999999)
const WHATSAPP = "5500000000000";
const EMPRESA = "NOME DA EMPRESA";

document.getElementById("ano").textContent = new Date().getFullYear();

const btn = document.querySelector(".menu-btn");
const menu = document.getElementById("menu");
btn.addEventListener("click", () => {
  const aberto = menu.classList.toggle("aberto");
  btn.setAttribute("aria-expanded", aberto);
});
menu.addEventListener("click", e => { if (e.target.tagName === "A") menu.classList.remove("aberto"); });

document.getElementById("zap").href =
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Olá! Gostaria de um orçamento.")}`;

document.getElementById("form").addEventListener("submit", e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const texto = `Olá, ${EMPRESA}! Meu nome é ${f.get("nome")}.\nTelefone: ${f.get("tel")}\nProjeto: ${f.get("tipo")}\n${f.get("msg") || ""}`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`, "_blank");
});
