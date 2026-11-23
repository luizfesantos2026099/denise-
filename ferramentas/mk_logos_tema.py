src = open('/home/user/denise-/ferramentas/logos.py').read()
src = src.replace("OUT='/home/user/denise-/identidade-advm/logos/'", "OUT='/home/user/denise-/assets/'")
a = src.index('SCHEMES=')
b = src.index('def symbol')
novo = "SCHEMES={'tema-violeta':('#7c35fd','#c9bff2','#f3effd','#c9bff2'),'tema-oliva':('#c9a24a','#d6dca8','#eff0e1','#d6dca8'),'tema-azul':('#2f7bff','#bcd6ff','#eef4fb','#bcd6ff')}\n"
src = src[:a] + novo + src[b:]
i = src.index('    # vertical')
j = src.index('for n,sc in SCHEMES.items()')
src = src[:i] + src[j:]
k = src.index('# ícone de app')
src = src[:k] + "print('ok')\n"
open('/home/user/denise-/ferramentas/logos_tema.py', 'w').write(src)
