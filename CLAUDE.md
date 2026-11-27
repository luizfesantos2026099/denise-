# Instruções para o Claude neste repositório

**Regra permanente:** este arquivo é a memória do projeto. Leia-o no começo de toda sessão. Ao terminar uma tarefa que mude decisões, preços, pendências, links ou a estrutura das pastas, **atualize este arquivo antes de encerrar** e faça commit e push. Nunca deixe o arquivo desatualizado.

**Como trabalhar com o usuário:** ele fala português do Brasil, não é programador e vende esses serviços a uma cliente (Denise). Seja direto, explique em linguagem simples, diga com honestidade o que não foi testado ou o que é estimativa, e nunca invente dados de empresa (números, clientes, telefone) sem marcar como exemplo. Depois de mudar o site, teste no navegador (Playwright), faça commit, push e republique o artefato correspondente.

# ADVM tecnologia: memória do projeto

Este arquivo permite retomar o projeto sem depender do histórico de conversa.

## O que é o projeto
Site e identidade visual para a **ADVM tecnologia**, integradora de segurança eletrônica (parceira Intelbras) da cliente Denise. O site foi vendido por R$ 1.400 e serve de porta de entrada para vender identidade visual e conteúdo mensal.

## Links (claude.ai, privados do dono)
- Site (protótipo): https://claude.ai/artifact/F93Aqns9RY1AhPUPmGx6h7
- Manual de marca e mockups: https://claude.ai/artifact/HrkJfp4Pq78eUbK8YWs8Xi
- Apresentação do orçamento: https://claude.ai/artifact/Dyv3ZznLDwLPkKzgFfLyqQ
- Roteiro da reunião: https://claude.ai/artifact/4bdrPCF19LU6SnmsYnAihe
- Checklist do que falta: https://claude.ai/artifact/GsKd6PEFRz5NUBGwbh2eDg
- **Contrato SÓ DO SITE** (R$ 1.400; o Luiz pediu que, por enquanto, o contrato seja só do site; ajustes: a cliente tem 30 dias após a publicação para pedir ajustes, sem limite de rodadas (NÃO são 2 rodadas); campos [ ] a preencher; precisa de revisão de advogado): https://claude.ai/artifact/NtJcvzAW9UhZq2f8emwvno
- Contrato completo (site + identidade + conteúdo mensal, para usar quando vender o resto): https://claude.ai/artifact/BrE4iuhdwk5EAVfw33LtYv

## Mapa das pastas
| Pasta | O que é |
|---|---|
| `index.html`, `style.css`, `script.js`, `assets/`, `fonts/` | O site (protótipo) |
| `identidade-advm/` | Identidade completa: logos SVG/PNG, cores, redes, papelaria, manual (`index.html`) e `mockups/` |
| `advm-site-hospedagem.zip` | Site pronto para enviar à HostGator (inclui `.htaccess` com HTTPS). Refazer o zip depois de qualquer mudança no site |
| `advm-identidade-visual.zip` | Pacote da identidade para baixar |
| `orcamento/` | Apresentação do orçamento (9 slides). Valores no bloco `CFG` no topo |
| `checklist/` | Checklist do que falta (artefato com caixas de marcar) |
| `roteiro/` | Roteiro da reunião, preços e respostas a objeções |
| `ferramentas/` | Scripts que geram logos, PNGs, materiais, manual e mockups |
| `apresentacao/`, `identidade/`, `identidade-v2/`, `identidade-v3/`, `sellix/` | **Histórico**: propostas antigas, ainda com o nome "technology". Não são para entregar |

## Decisões tomadas
- **Nome:** "ADVM tecnologia" (a logo escreve "tecnologia" em letras minúsculas finas sob "ADVM").
- **Símbolo:** "Foco" (A dentro de um enquadramento de câmera). Escolha provisória: há outros 3 símbolos nas propostas v3.
- **Cor atual do site: verde Intelbras** (tema `verde`, padrão, `#06cc3e`; a Denise pediu a mesma cor da Intelbras e o Luiz informou este código). Texto sobre o verde é escuro (`--on`) por contraste. O botão "Testar cores" FOI REMOVIDO do site (o CSS dos outros temas ficou, sem uso).
- **Cores (identidade anterior):** violeta `#7c35fd`, noite `#0b0812`, ameixa `#190926`, lavanda `#c9bff2`, névoa `#f3effd`. O site tem um botão "Testar cores" (violeta, oliva e dourado, azul-marinho) para a cliente escolher na reunião. Esse botão é só do protótipo.
- **Fontes:** Outfit (títulos) e Inter (textos). Ficam em `fonts/`.
- **Circuitos (reforçados):** traços mais fortes e densos no hero (`data-density` no canvas); se a cliente achar fraco ou forte, ajuste alfa em `bake` e `data-density` no `index.html`. Só desenham quando a seção está visível.
- **Site em PÁGINAS (v2, 27/11):** não é mais uma página só rolando. São 6 páginas dentro do mesmo `index.html` (`v-inicio`, `v-projetos`, `v-servicos`, `v-obras`, `v-etapas`, `v-contato`), trocadas pelos botões, com endereço `#projetos` etc. (funciona no botão voltar e em link direto). A cada troca roda a **abertura: o quadrado da câmera fecha e o A cai e encaixa**, com o nome da página (CSS `.intro`, JS no fim do `script.js`). No carregamento também roda a abertura (com plano B só em CSS que some sozinha). Tudo ficou em tema escuro, com um único fundo fixo de circuitos (`<canvas id="bg">`) que **desce junto com a rolagem** (anda mais devagar que o texto, a energia corre para baixo e acelera ao rolar) e um fio na borda esquerda que acende conforme a rolagem. Pedido do Luiz (27/11): menos informação no fundo; **ao rolar, faixas de luz descem em linha reta (`lanes`); quando para, elas somem e a energia fica circulando pelos circuitos** (pulsos fortes que pulam de um circuito para o vizinho e reaparecem na parte visível; o fundo balança de leve parado). O Luiz reclamou que ficou "estático" quando os pulsos eram poucos e fracos: manter a energia bem visível quando parado. Densidade e brilho se ajustam em `BG` no `script.js` (`cols * rows / 64`, alfas do `bake`) e no `.vig` do `style.css`. Sem animação (`prefers-reduced-motion`) a abertura e o movimento ficam desligados. Testado com Playwright (desktop, celular simulado e sem animação), sem erros.
- **Tom do site:** sério. Sem partículas. Tem circuitos de rede com energia no fundo, círculo que segue o mouse, botões principais que pulsam.
- **Preços (estimativas minhas, a confirmar com o custo real do Luiz):** identidade Profissional R$ 5.500 (Essencial R$ 2.800); preparar o conteúdo R$ 2.400 (uma vez); mensal em 3 planos, mín. 6 meses: Presença R$ 1.500 (1 rede, 8 posts, Google), **Completo R$ 3.200** (Instagram + LinkedIn, 12 posts, 2 vídeos, Google, relatório; recomendado), Crescimento R$ 6.500 (20 posts, mais vídeos, funil, anúncios e **1 diária de gravação presencial por mês, feita pelo Luiz, na Grande SP**). Diária extra R$ 900 (estimativa). Oferta combinada: R$ 8.475 para começar + R$ 3.200 por mês (6 meses sem o site = R$ 26.275), com 15% de desconto na identidade. NÃO incluso: verba de anúncios, deslocamento fora da Grande SP, equipamento de proteção de obra, produção física (uniforme, impressão, adesivo, fachada). A Denise não tem identidade nem redes sociais: tudo começa do zero (criar LinkedIn, Instagram sem "Intelbras" no nome, Google Meu Negócio, WhatsApp Business). Cuidado: nunca mostrar posição de câmeras/plantas de clientes e só postar obra com autorização. Equipamento básico de gravação (lapela, tripé) só depois de fechar o contrato.
- **Margem:** a R$ 3.200 o plano Completo dá folga para uns 35 a 40 horas por mês (a R$ 2.200 só até 22 a 25 horas). Revisar o preço com o custo real por hora, imposto e ferramentas.

## Hospedagem
Decisão: comprar na **HostGator** e publicar em advmtech.com.br (domínio já é da Denise, no Registro.br). Enviar o conteúdo de `advm-site-hospedagem.zip` para a pasta `public_html` pelo Gerenciador de Arquivos do cPanel, e apontar o DNS no Registro.br para os servidores de nomes da HostGator. Ainda NÃO feito. Plano escolhido: Plano P (R$ 153,58 no 1º ano, renovação estimada ~R$ 438,79/ano), com e-mails ilimitados de 1 GB (a Denise precisa de 4: valeria.andrade@, denise.barbati@, suporte@ e comercial@advmtech.com.br, pedido dela em 26/11; o plano permite ilimitados). Sugerido trocar o e-mail do site para comercial@ se ela concordar. Não precisa do domínio grátis nem do e-mail profissional pago. Os e-mails dela NÃO estão hospedados em lugar nenhum (confirmado pelo Luiz), então não há risco de perder mensagens ao apontar o DNS; basta criar as 3 caixas no cPanel. O Luiz compra em 26/11 e PAGA a hospedagem; vai pedir os dados da Denise para criar a conta no nome dela. No site ainda ficam placeholders até a Denise responder: "(exemplo)" no número de obras e CNPJ 00.000.000/0000-00 no rodapé.

## Pendências (dados que só o cliente tem)
- **"Enfatizar projetos" (feito em parte):** o site ganhou a seção "Tudo começa pelo projeto" (`#projetos`, 6 cards: levantamento de riscos, planta técnica, cabeamento, equipamentos, normas de incêndio/AVCB, integração; texto veio de uma lista que o Luiz colou, ainda NÃO confirmada pela Denise), o texto do topo diz "Projetamos, instalamos e integramos" e o item Projeto de Como funciona foi reforçado. Falta: nome do software de integração (hoje só "software") e confirmar se a ADVM faz o projeto técnico (plantas, memorial).
- Verde: o manual de marca, logos PNG, cartões e mockups ainda estão em violeta.
- **Contato (já no site):** WhatsApp/telefone (11) 94506-7587, e-mail suporte@advmtech.com.br (a Denise tem também denise.barbati@advmtech.com.br; trocar se preferir), São Paulo e região, SP. Domínio dela: advmtech.com.br (Registro.br). Endereço completo NÃO colocado no site (perguntar se pode). Falta: CNPJ e razão social no rodapé. NUNCA gravar senhas no repositório; a senha do Registro.br foi colada no chat e deve ser trocada.
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

## Identificadores dos artefatos (para republicar nos mesmos links)
Use estes códigos (slug) ao publicar de novo, para atualizar o link em vez de criar outro. Se o código não funcionar, liste os artefatos da conta.
| Artefato | Slug |
|---|---|
| Site | `727f3a7f-a6ff-4b0d-abdb-ab02689443d2` |
| Manual de marca (com mockups, logos, redes e papelaria) | `888459c8-f97f-4ebf-8b76-d0a3de0accb1` |
| Apresentação do orçamento | `69200137-0741-47a4-9dba-a026e790e52f` |
| Roteiro da reunião | `1d216a26-ff6b-4211-a270-440890567311` |
| Checklist do que falta | `807fbeaa-cd97-4212-acda-d8c76768e7fb` |
| Identidade v3 (violeta, 4 símbolos) | `60d61f8d-fbe3-4c33-891e-18fe7b895ee7` |
| Identidade v2 (oliva, verde e dourado) | `d1864f4c-3744-4759-8035-18f693b6b2a2` |

## Como retomar numa conversa nova
Abra uma sessão no repositório `luizfesantos2026099/denise-`. Este arquivo (`CLAUDE.md`) é lido automaticamente. Basta dizer qual é a próxima tarefa.
