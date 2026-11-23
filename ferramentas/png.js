const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const L='/home/user/denise-/identidade-advm/logos/';
(async()=>{const b=await chromium.launch();const pg=await b.newPage({deviceScaleFactor:1});
const files=fs.readdirSync(L).filter(f=>f.endsWith('.svg'));
for(const f of files){
  const svg=fs.readFileSync(L+f,'utf8');
  const m=svg.match(/width="(\d+)" height="(\d+)"/);const w=+m[1],h=+m[2];
  // exporta com largura de 2000 px para logos e 1024 para símbolo/ícone
  const target=/simbolo|icone|favicon/.test(f)?1024:2000;const k=target/w;
  await pg.setViewportSize({width:Math.round(w*k),height:Math.round(h*k)});
  await pg.setContent(`<html><body style="margin:0;background:transparent"><img src="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}" style="width:${Math.round(w*k)}px;height:${Math.round(h*k)}px;display:block"></body></html>`);
  await pg.screenshot({path:L+'png/'+f.replace('.svg','.png'),omitBackground:true});
}
console.log(files.length+' png');
// folha de conferência
const bgs={'fundo-escuro':'#0b0812','fundo-claro':'#f3effd','fundo-violeta':'#7c35fd','branco':'#2b2340','preto':'#e9e4f7'};
let html='<body style="margin:0;background:#222;display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;padding:6px">';
for(const n of Object.keys(bgs)){for(const t of ['horizontal','vertical','simbolo']){const f=(t==='simbolo'?'simbolo-':`logo-${t}-`)+n+'.svg';html+=`<div style="background:${bgs[n]};height:170px;display:grid;place-items:center"><img src="data:image/svg+xml;base64,${fs.readFileSync(L+f).toString('base64')}" style="max-width:85%;max-height:130px"></div>`;}}
await pg.setViewportSize({width:1000,height:900});await pg.setContent(html);await pg.screenshot({path:process.argv[2]+'/logos_sheet.png',fullPage:true});
await b.close();})();
