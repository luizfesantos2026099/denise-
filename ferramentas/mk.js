const {chromium}=require('playwright');const fs=require('fs');
const R='/home/user/denise-/identidade-advm/';const L=R+'logos/';
const FD='file:///home/user/denise-/fonts/';
const fo=FD,fi=FD;
const b64=p=>fs.readFileSync(p.replace('file://','')).toString('base64');
const ff=(fam,w,u)=>`@font-face{font-family:${fam};font-weight:${w};src:url(data:font/woff;base64,${b64(u)}) format("woff")}`;
const faces=ff('Outfit',300,fo+'outfit-latin-300-normal.woff')+ff('Outfit',500,fo+'outfit-latin-500-normal.woff')+ff('Outfit',600,fo+'outfit-latin-600-normal.woff')+ff('Inter',400,fi+'inter-latin-400-normal.woff')+ff('Inter',500,fi+'inter-latin-500-normal.woff')+ff('Inter',600,fi+'inter-latin-600-normal.woff');
const img=(f,s='')=>`<img src="data:image/svg+xml;base64,${fs.readFileSync(L+f).toString('base64')}" style="${s}">`;
const base=`<style>${faces}*{box-sizing:border-box;margin:0;padding:0}body{font-family:Inter,sans-serif;-webkit-font-smoothing:antialiased}h1,h2,h3,.o{font-family:Outfit,sans-serif;font-weight:500;letter-spacing:-.02em}</style>`;
const brk=(c,w)=>`<svg viewBox="0 0 100 100" style="position:absolute;inset:0;width:100%;height:100%" preserveAspectRatio="none"><path d="M12 34V12H34M66 12H88V34M88 66V88H66M34 88H12V66" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="square" vector-effect="non-scaling-stroke"/></svg>`;
const T=[
 ['redes/avatar-1080.png',1080,1080,`<div style="width:1080px;height:1080px;background:#190926;display:grid;place-items:center">${img('simbolo-fundo-escuro.svg','width:640px')}</div>`],
 ['redes/capa-linkedin-1584x396.png',1584,396,`<div style="width:1584px;height:396px;background:radial-gradient(ellipse 50% 140% at 100% 0,#4a23a8 0,transparent 70%),#0b0812;position:relative;overflow:hidden;padding:0 110px;display:flex;align-items:center">
    <div style="position:absolute;right:70px;top:40px;width:316px;height:316px;opacity:.55">${brk('#7c35fd',6)}</div>
    <div style="position:absolute;right:140px;top:110px;width:176px;height:176px;opacity:.35">${brk('#c9bff2',4)}</div>
    <div>${img('logo-horizontal-fundo-escuro.svg','height:150px;display:block')}<div class="o" style="color:#f3effd;font-size:40px;margin-top:34px;max-width:900px">Segurança que vigia, detecta e responde.</div></div></div>`],
 ['redes/post-1-apresentacao.png',1080,1080,`<div style="width:1080px;height:1080px;background:#7c35fd;position:relative;padding:90px;display:flex;flex-direction:column;justify-content:space-between;color:#fff">
    ${img('logo-horizontal-fundo-violeta.svg','height:96px;align-self:flex-start')}
    <h1 style="font-size:128px;line-height:1.0;font-weight:500">Segurança eletrônica para edifícios que não podem parar.</h1>
    <div style="font-size:34px;color:#e2d9ff">Controle de acesso, câmeras, alarme e incêndio.</div></div>`],
 ['redes/post-2-servico.png',1080,1080,`<div style="width:1080px;height:1080px;background:#f3effd;position:relative;padding:90px;display:flex;flex-direction:column;justify-content:space-between;color:#190926">
    ${img('logo-horizontal-fundo-claro.svg','height:96px;align-self:flex-start')}
    <div><div style="font-size:34px;color:#6a2be0;margin-bottom:26px;font-weight:600">Controle de acesso</div><h1 style="font-size:122px;line-height:1.0">Cada pessoa entra só onde pode.</h1></div>
    <div style="font-size:32px;color:#4a3d66">Leitores, catracas e cancelas com biometria e crachá.</div></div>`],
 ['redes/post-3-obra.png',1080,1080,`<div style="width:1080px;height:1080px;background:#0b0812;position:relative;padding:70px;color:#f3effd;display:flex;flex-direction:column;gap:34px">
    <div style="position:relative;flex:1;background:linear-gradient(135deg,#1b1233,#2a1a52);border-radius:6px"><div style="position:absolute;inset:36px">${brk('#7c35fd',7)}</div><div style="position:absolute;inset:0;display:grid;place-items:center;color:#8e84b3;font-size:30px;text-align:center">Foto da obra aqui<br><span style="font-size:22px">use foto real, na horizontal</span></div></div>
    <div style="display:flex;justify-content:space-between;align-items:flex-end"><div><div style="font-size:26px;color:#c9bff2;margin-bottom:8px">Obra em andamento</div><h2 style="font-size:64px;line-height:1.05">Nome da obra,<br>cidade</h2></div>${img('simbolo-fundo-escuro.svg','width:110px')}</div></div>`],
 ['papelaria/cartao-frente.png',1063,591,`<div style="width:1063px;height:591px;background:#7c35fd;display:grid;place-items:center">${img('logo-vertical-fundo-violeta.svg','height:330px')}</div>`],
 ['papelaria/cartao-verso.png',1063,591,`<div style="width:1063px;height:591px;background:#0b0812;color:#f3effd;position:relative;padding:62px 72px;display:flex;flex-direction:column;justify-content:space-between">
    ${img('simbolo-fundo-escuro.svg','width:96px;position:absolute;right:72px;top:62px')}
    <div><div class="o" style="font-size:54px">Nome Sobrenome</div><div style="font-size:26px;color:#c9bff2;margin-top:8px">Cargo</div></div>
    <div style="font-size:25px;line-height:1.7;color:#d9d0f5">(00) 00000-0000<br>contato@seudominio.com.br<br>seudominio.com.br<br>Cidade, UF</div></div>`],
 ['papelaria/papel-timbrado-a4.png',2480,3508,`<div style="width:2480px;height:3508px;background:#fff;position:relative;color:#190926">
    <div style="position:absolute;left:220px;top:200px">${img('logo-horizontal-fundo-claro.svg','height:170px')}</div>
    <div style="position:absolute;right:0;top:0;width:560px;height:560px;opacity:.14">${brk('#7c35fd',16)}</div>
    <div style="position:absolute;left:220px;right:220px;bottom:200px;border-top:4px solid #7c35fd;padding-top:40px;font-size:38px;color:#4a3d66;display:flex;justify-content:space-between"><span>ADVM tecnologia · CNPJ 00.000.000/0000-00</span><span>(00) 00000-0000 · contato@seudominio.com.br</span></div></div>`],
 ['papelaria/assinatura-logo.png',560,150,`<div style="width:560px;height:150px;background:#fff;display:grid;place-items:center;justify-content:start">${img('logo-horizontal-fundo-claro.svg','height:130px')}</div>`]
];
(async()=>{const b=await chromium.launch();const pg=await b.newPage();
for(const [f,w,h,body] of T){await pg.setViewportSize({width:w,height:h});await pg.setContent(`<html><head>${base}</head><body>${body}</body></html>`);await pg.evaluate(()=>document.fonts.ready);await pg.waitForTimeout(250);await pg.screenshot({path:R+f});}
// PDFs: cartão (90x50mm, frente e verso) e papel timbrado A4
for(const [f,w,h,pdf,wi,he] of [['cartao-frente',1063,591,'cartao-frente.pdf','90mm','50mm'],['cartao-verso',1063,591,'cartao-verso.pdf','90mm','50mm'],['papel-timbrado-a4',2480,3508,'papel-timbrado-a4.pdf','210mm','297mm']]){
  const body=T.find(t=>t[0].includes(f))[3];const bgc={'cartao-frente':'#7c35fd','cartao-verso':'#0b0812','papel-timbrado-a4':'#fff'}[f];await pg.setViewportSize({width:w,height:h});
  await pg.setContent(`<html><head>${base}<style>@page{size:${wi} ${he};margin:0}html,body{width:${w}px;height:${h}px;background:${bgc};overflow:hidden}</style></head><body>${body}</body></html>`);await pg.evaluate(()=>document.fonts.ready);
  await pg.pdf({path:R+'papelaria/'+pdf,width:wi,height:he,printBackground:true,scale:((parseFloat(wi)*3.7795)/w)*1.012});}
await b.close();console.log('ok');})();
