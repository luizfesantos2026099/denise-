# ADVM tecnologia: nota de continuidade

Este arquivo existe para qualquer pessoa (ou qualquer nova conversa com o Claude) retomar o projeto sem depender do histórico.

## O que é o projeto
Site e identidade visual para a **ADVM tecnologia**, integradora de segurança eletrônica (parceira Intelbras) da cliente Denise. O site foi vendido por R$ 1.400 e serve de porta de entrada para vender identidade visual e conteúdo mensal.

## Links (claude.ai, privados do dono)
- Site (protótipo): https://claude.ai/artifact/F93Aqns9RY1AhPUPmGx6h7
- Manual de marca e mockups: https://claude.ai/artifact/HrkJfp4Pq78eUbK8YWs8Xi
- Apresentação do orçamento: https://claude.ai/artifact/Dyv3ZznLDwLPkKzgFfLyqQ
- Roteiro da reunião: https://claude.ai/artifact/4bdrPCF19LU6SnmsYnAihe

## Mapa das pastas
| Pasta | O que é |
|---|---|
| `index.html`, `style.css`, `script.js`, `assets/`, `fonts/` | O site (protótipo) |
| `identidade-advm/` | Identidade completa: logos SVG/PNG, cores, redes, papelaria, manual (`index.html`) e `mockups/` |
| `advm-identidade-visual.zip` | Pacote da identidade para baixar |
| `orcamento/` | Apresentação do orçamento (9 slides). Valores no bloco `CFG` no topo |
| `roteiro/` | Roteiro da reunião, preços e respostas a objeções |
| `ferramentas/` | Scripts que geram logos, PNGs, materiais, manual e mockups |
| `apresentacao/`, `identidade/`, `identidade-v2/`, `identidade-v3/`, `sellix/` | **Histórico**: propostas antigas, ainda com o nome "technology". Não são para entregar |

## Decisões tomadas
- **Nome:** "ADVM tecnologia" (a logo escreve "tecnologia" em letras minúsculas finas sob "ADVM").
- **Símbolo:** "Foco" (A dentro de um enquadramento de câmera). Escolha provisória: há outros 3 símbolos nas propostas v3.
- **Cores:** violeta `#7c35fd`, noite `#0b0812`, ameixa `#190926`, lavanda `#c9bff2`, névoa `#f3effd`. O site tem um botão "Testar cores" (violeta, oliva e dourado, azul-marinho) para a cliente escolher na reunião. Esse botão é só do protótipo.
- **Fontes:** Outfit (títulos) e Inter (textos). Ficam em `fonts/`.
- **Tom do site:** sério. Sem partículas. Tem circuitos de rede com energia no fundo, círculo que segue o mouse, botões principais que pulsam.
- **Preços (estimativas minhas, a confirmar):** identidade Profissional R$ 5.500 (Essencial R$ 2.800); preparar o conteúdo R$ 2.400; conteúdo mensal R$ 2.200 (mín. 6 meses); oferta combinada R$ 8.475 para começar mais R$ 2.200 por mês, com 15% de desconto na identidade se fechar o mensal. A produção física (uniforme, impressão, adesivo, fachada) NÃO está inclusa.
- **Margem:** a R$ 2.200 o plano mensal só dá lucro se a produção levar até uns 22 a 25 horas. Revisar o preço com o custo real por hora, imposto e ferramentas.

## Pendências (dados que só o cliente tem)
- Telefone, e-mail, WhatsApp (constante `WHATSAPP` no topo de `script.js`), CNPJ, cidade e UF.
- **Número real de obras atendidas:** hoje "+50" é exemplo (linha `data-count="50"` no `index.html`; apagar `data-exemplo="1"`).
- Selo oficial da Intelbras (baixar no portal Sou Parceiro) e a classificação da ADVM no programa.
- Autorização para citar UNESP, ADN MRV e Grupo Field.
- Escolha final de cor e símbolo. Busca no INPI antes de registrar ou imprimir em quantidade.
- Dados de exemplo nos cartões, papel timbrado e assinatura de e-mail.

## Regras da Intelbras para parceiros (resumo do manual 2025)
Usar só o selo oficial (nunca o logotipo isolado), sem "Intelbras" no nome de perfis, Google ou e-mail, sem comparar com outras marcas, sem promoções ou garantias em nome da Intelbras, e avisar que os dados de formulário ficam com a ADVM.

## Como regenerar as logos e materiais (pasta `ferramentas/`)
Precisa de Python com `fonttools` (`pip install fonttools`), Node com Playwright e as fontes de `fonts/`.
1. `python3 ferramentas/logos.py` gera os SVG em `identidade-advm/logos/` (texto convertido em curvas). Para trocar o nome ou as cores, edite `SCHEMES` e as palavras dentro do arquivo.
2. `python3 ferramentas/mk_logos_tema.py` e depois `python3 ferramentas/logos_tema.py` geram as 3 logos do site (`assets/logo-horizontal-tema-*.svg`).
3. `node ferramentas/png.js <pasta-de-teste>` gera os PNGs transparentes das logos.
4. `node ferramentas/mk.js` gera avatar, capa do LinkedIn, posts, cartão e papel timbrado (PNG). Os PDFs foram feitos a partir dos PNG em 300 dpi com a biblioteca Pillow.
5. `python3 ferramentas/manual.py` reconstrói `identidade-advm/index.html`; `node ferramentas/mockups.js` refaz os PNG dos mockups.
Os caminhos nos scripts podem precisar de ajuste dependendo de onde o repositório estiver.

## Cuidados que já deram problema
- Não sobrescrever o `style.css` sem manter o bloco `@font-face` do topo (sem ele o site cai para uma fonte comum).
- O site foi testado em navegador simulado no computador, não em celular real.
- As vozes da apresentação animada (`apresentacao/`) dizem "ADVM Technology" e não foram regeneradas.
