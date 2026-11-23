import os, sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
FD='/home/user/denise-/fonts/'
F5=TTFont(FD+'outfit-latin-500-normal.woff'); F3=TTFont(FD+'outfit-latin-300-normal.woff')
OUT='/home/user/denise-/identidade-advm/logos/'
def glyphs(font,text):
    cmap=font.getBestCmap(); gs=font.getGlyphSet(); upm=font['head'].unitsPerEm
    return [(gs[cmap[ord(c)]], gs[cmap[ord(c)]].width) for c in text], upm
def natural(font,text,size,track):
    g,upm=glyphs(font,text); return sum(w*size/upm for _,w in g)+track*(len(text)-1)
def path(font,text,size,track,x,base):
    g,upm=glyphs(font,text); sc=size/upm; d=[]; cx=x
    for gl,w in g:
        pen=SVGPathPen(font.getGlyphSet()); tp=TransformPen(pen,(sc,0,0,-sc,cx,base)); gl.draw(tp); d.append(pen.getCommands()); cx+=w*sc+track
    return ' '.join(d)
SCHEMES={ # brackets, A, ADVM, tecnologia
 'fundo-escuro':('#7c35fd','#c9bff2','#f3effd','#c9bff2'),
 'fundo-claro':('#7c35fd','#190926','#190926','#6a2be0'),
 'fundo-violeta':('#f3effd','#ffffff','#ffffff','#e2d9ff'),
 'branco':('#ffffff',)*4,
 'preto':('#0b0812',)*4,
}
def symbol(b,a,ox=0,oy=0,s=1):
    t=f'transform="translate({ox} {oy}) scale({s})"'
    return (f'<g {t}><path d="M12 34V12H34M66 12H88V34M88 66V88H66M34 88H12V66" fill="none" stroke="{b}" stroke-width="7" stroke-linecap="square"/>'
            f'<path d="M32 70L50 30L68 70" fill="none" stroke="{a}" stroke-width="7.5" stroke-linejoin="miter"/><path d="M40 58H60" fill="none" stroke="{a}" stroke-width="5"/></g>')
def lockups(name,sc):
    b,a,t1,t2=sc
    # horizontal
    SZ=64; W1=natural(F5,'ADVM',SZ,SZ*.08); S2=21; nat=natural(F3,'tecnologia',S2,0); tr2=(W1-nat)/9
    gap=30; x0=100+gap; wtot=x0+W1; H=100
    d1=path(F5,'ADVM',SZ,SZ*.08,x0,57); d2=path(F3,'tecnologia',S2,tr2,x0,86)
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 {wtot+4:.2f} {H+4}" width="{(wtot+4)*4:.0f}" height="{(H+4)*4}" role="img" aria-label="ADVM tecnologia">{symbol(b,a)}<path d="{d1}" fill="{t1}"/><path d="{d2}" fill="{t2}"/></svg>'
    open(OUT+f'logo-horizontal-{name}.svg','w').write(svg)
    # vertical
    SZ=70; W1=natural(F5,'ADVM',SZ,SZ*.08); S2=22; nat=natural(F3,'tecnologia',S2,0); tr2=(W1-nat)/9
    sym=150; Wd=max(W1,sym); cx=Wd/2
    d1=path(F5,'ADVM',SZ,SZ*.08,cx-W1/2,sym+30+SZ*.7); d2=path(F3,'tecnologia',S2,tr2,cx-W1/2,sym+30+SZ*.7+34); Hh=sym+30+SZ*.7+34+8
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 {Wd+4:.2f} {Hh+4:.2f}" width="{(Wd+4)*3:.0f}" height="{(Hh+4)*3:.0f}" role="img" aria-label="ADVM tecnologia">{symbol(b,a,cx-sym/2,0,sym/100)}<path d="{d1}" fill="{t1}"/><path d="{d2}" fill="{t2}"/></svg>'
    open(OUT+f'logo-vertical-{name}.svg','w').write(svg)
    # símbolo
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="400" height="400" role="img" aria-label="ADVM">{symbol(b,a)}</svg>'
    open(OUT+f'simbolo-{name}.svg','w').write(svg)
for n,sc in SCHEMES.items(): lockups(n,sc)
# ícone de app / favicon (cantos arredondados, fundo ameixa)
open(OUT+'icone-app.svg','w').write('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="512" height="512" role="img" aria-label="ADVM"><rect width="100" height="100" rx="22" fill="#190926"/>'+symbol('#7c35fd','#c9bff2',14,14,.72)+'</svg>')
open(OUT+'favicon.svg','w').write('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="#190926"/>'+symbol('#7c35fd','#c9bff2',10,10,.8)+'</svg>')
print(sorted(os.listdir(OUT)))
