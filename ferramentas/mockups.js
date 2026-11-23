const {chromium}=require('playwright');const fs=require('fs');
const FD='/home/user/denise-/fonts/';
const fo=FD,fi=FD;
const b64=p=>fs.readFileSync(p).toString('base64');
const faces=[['Outfit',300,fo+'outfit-latin-300-normal.woff'],['Outfit',400,fo+'outfit-latin-400-normal.woff'],['Outfit',500,fo+'outfit-latin-500-normal.woff'],['Inter',400,fi+'inter-latin-400-normal.woff'],['Inter',500,fi+'inter-latin-500-normal.woff']].map(([f,w,p])=>`@font-face{font-family:${f};font-weight:${w};src:url(data:font/woff;base64,${b64(p)}) format("woff")}`).join('');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1600,height:1000},deviceScaleFactor:1600/1240});const e=[];p.on('pageerror',x=>e.push(x.message));
await p.goto('file:///home/user/denise-/identidade-advm/mockups/index.html');await p.addStyleTag({content:faces});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1200);
for(const id of ['cartoes','camisas','fachada','escritorio','carro']){
  const el=await p.$(`.sc[data-id="${id}"]`);await el.screenshot({path:`/home/user/denise-/identidade-advm/mockups/png/${id}.png`});}
console.log('errors',e);
const m=await b.newPage({viewport:{width:390,height:844}});await m.goto('file:///home/user/denise-/identidade-advm/mockups/index.html');await m.waitForTimeout(900);console.log('mobile',await m.evaluate(()=>document.documentElement.scrollWidth));
await b.close();})();
