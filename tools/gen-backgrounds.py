# Oyun arka planı SVG üretici.
# Kullanım: python3 tools/gen-backgrounds.py img/bg
import math, random, sys, os
OUT = sys.argv[1]
W, H = 1600, 900

def svg(body, defs="", extra=""):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" '
            f'preserveAspectRatio="xMidYMax slice" {extra}>\n<defs>{defs}</defs>\n{body}\n</svg>\n')

def save(name, s):
    with open(os.path.join(OUT, name), "w") as f: f.write(s)
    print(name, len(s)//1024, "KB")

def ridge(rnd, y0, amp, step, rough, x0=-20, x1=W+20):
    pts, y = [], y0
    for x in range(x0, x1 + step, step):
        y = y0 + amp * math.sin(x / 260 + rnd.random()) * 0.6 + rnd.uniform(-rough, rough)
        pts.append((x, round(y)))
    return pts

def poly_to_bottom(pts, fill, op=1):
    d = "M" + " L".join(f"{x},{y}" for x, y in pts) + f" L{pts[-1][0]},{H} L{pts[0][0]},{H} Z"
    return f'<path d="{d}" fill="{fill}" opacity="{op}"/>'

# ------------------------------------------------------------------ CS 1.6 – de_dust2 akşamı
def cs16():
    r = random.Random(16)
    defs = '''
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0" stop-color="#16130d"/><stop offset=".45" stop-color="#3b2e1b"/>
 <stop offset=".72" stop-color="#9a6e3c"/><stop offset=".8" stop-color="#d4a062"/></linearGradient>
<radialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
 <stop offset="0" stop-color="#ffe2a8" stop-opacity=".9"/><stop offset=".15" stop-color="#ffc77a" stop-opacity=".5"/>
 <stop offset="1" stop-color="#d4a062" stop-opacity="0"/></radialGradient>
<linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0" stop-color="#c8955a" stop-opacity="0"/><stop offset="1" stop-color="#c8955a" stop-opacity=".25"/></linearGradient>
<linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0" stop-color="#5a4429"/><stop offset="1" stop-color="#2a1f13"/></linearGradient>
<linearGradient id="wall2" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0" stop-color="#47351f"/><stop offset="1" stop-color="#1f170e"/></linearGradient>
<pattern id="brick" width="60" height="30" patternUnits="userSpaceOnUse">
 <path d="M0 0H60M0 15H60M30 0V15M0 15V30M60 15V30" stroke="#000" stroke-opacity=".12" fill="none"/></pattern>'''
    b = ['<rect width="1600" height="900" fill="url(#sky)"/>',
         '<circle cx="1180" cy="600" r="420" fill="url(#sun)"/>',
         '<circle cx="1180" cy="600" r="46" fill="#ffe6b5" opacity=".85"/>']
    # uzak şehir siluetleri (düz çatılı evler)
    x = -20
    while x < W:
        w = r.randint(60, 150); h = r.randint(40, 120)
        b.append(f'<rect x="{x}" y="{650-h}" width="{w}" height="{h+260}" fill="#6b5233" opacity=".55"/>')
        if r.random() < .25:
            b.append(f'<path d="M{x+w/2-25},{650-h} a25,25 0 0 1 50,0 Z" fill="#6b5233" opacity=".55"/>')
        x += w - r.randint(0, 20)
    # sol: uzun A kapıları – kemerli duvar
    b.append('<rect x="80" y="470" width="640" height="430" fill="url(#wall)"/>')
    b.append('<rect x="80" y="470" width="640" height="430" fill="url(#brick)"/>')
    b.append('<rect x="70" y="458" width="660" height="16" fill="#6e5432"/>')
    b.append('<path d="M250,900 V640 a150,150 0 0 1 300,0 V900 Z" fill="#120d08"/>')
    b.append('<path d="M262,900 V650 a138,138 0 0 1 138,-138 V900 Z" fill="#3e2a16"/>')  # açık kapı kanadı
    b.append('<path d="M262,900 V650 a138,138 0 0 1 138,-138" stroke="#2a1b0d" stroke-width="6" fill="none"/>')
    for y in range(560, 900, 48):
        b.append(f'<line x1="268" y1="{y}" x2="396" y2="{y}" stroke="#2a1b0d" stroke-width="3"/>')
    # kule
    b.append('<rect x="700" y="330" width="190" height="570" fill="url(#wall2)"/>')
    b.append('<rect x="700" y="330" width="190" height="570" fill="url(#brick)"/>')
    b.append('<rect x="690" y="318" width="210" height="16" fill="#5e4629"/>')
    b.append('<rect x="770" y="400" width="44" height="64" fill="#120d08"/>')
    b.append('<rect x="770" y="520" width="44" height="64" fill="#120d08"/>')
    # sağ: alçak duvar + sandıklar
    b.append('<rect x="1240" y="640" width="400" height="260" fill="url(#wall2)"/>')
    b.append('<rect x="1240" y="640" width="400" height="260" fill="url(#brick)"/>')
    def crate(x, y, s):
        return (f'<rect x="{x}" y="{y}" width="{s}" height="{s}" fill="#5b4122" stroke="#2b1d0e" stroke-width="5"/>'
                f'<path d="M{x},{y} L{x+s},{y+s} M{x+s},{y} L{x},{y+s}" stroke="#2b1d0e" stroke-width="5"/>'
                f'<rect x="{x+6}" y="{y+6}" width="{s-12}" height="{s-12}" fill="none" stroke="#7a5a32" stroke-width="2" opacity=".6"/>')
    b += [crate(1000, 740, 130), crate(1130, 740, 130), crate(1065, 610, 130), crate(1300, 780, 120)]
    # zemin
    b.append('<rect x="0" y="860" width="1600" height="40" fill="#1e160d"/>')
    b.append('<rect width="1600" height="900" fill="url(#haze)"/>')
    # toz zerreleri
    for _ in range(90):
        b.append(f'<circle cx="{r.randint(0,W)}" cy="{r.randint(300,H)}" r="{r.uniform(.8,2.4):.1f}" fill="#ffd9a0" opacity="{r.uniform(.15,.5):.2f}"/>')
    save("cs16.svg", svg("\n".join(b), defs))

# ------------------------------------------------------------------ CS2 – Mirage alacakaranlığı
def cs2():
    r = random.Random(2)
    defs = '''
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0" stop-color="#070b14"/><stop offset=".45" stop-color="#16233b"/>
 <stop offset=".66" stop-color="#3c3a52"/><stop offset=".78" stop-color="#d0743c"/></linearGradient>
<radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
 <stop offset="0" stop-color="#ffb070" stop-opacity=".7"/><stop offset="1" stop-color="#ff8a40" stop-opacity="0"/></radialGradient>
<linearGradient id="rim" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0" stop-color="#1a2336"/><stop offset="1" stop-color="#070a12"/></linearGradient>'''
    b = ['<rect width="1600" height="900" fill="url(#sky)"/>',
         '<ellipse cx="420" cy="700" rx="700" ry="260" fill="url(#glow)"/>']
    for _ in range(120):
        b.append(f'<circle cx="{r.randint(0,W)}" cy="{r.randint(0,380)}" r="{r.uniform(.5,1.6):.1f}" fill="#cfe0ff" opacity="{r.uniform(.2,.8):.2f}"/>')
    sil = "#0a0f1a"
    # saray: büyük kubbe + kemerler
    b.append(f'<rect x="520" y="560" width="560" height="340" fill="url(#rim)"/>')
    b.append(f'<path d="M610,560 a190,170 0 0 1 380,0 Z" fill="url(#rim)"/>')
    b.append(f'<rect x="795" y="360" width="10" height="40" fill="{sil}"/><circle cx="800" cy="356" r="8" fill="{sil}"/>')
    b.append(f'<path d="M610,560 a190,170 0 0 1 380,0" fill="none" stroke="#e08a4a" stroke-opacity=".35" stroke-width="3"/>')
    for i in range(6):
        x = 548 + i * 88
        b.append(f'<path d="M{x},900 V700 a30,34 0 0 1 60,0 V900 Z" fill="#04060b"/>')
        b.append(f'<path d="M{x},700 a30,34 0 0 1 60,0" fill="none" stroke="#e08a4a" stroke-opacity=".25" stroke-width="2"/>')
    # minareler
    for x, h in [(470, 300), (1110, 260)]:
        top = 560 - h
        b.append(f'<rect x="{x}" y="{top}" width="34" height="{900-top}" fill="{sil}"/>')
        b.append(f'<rect x="{x-8}" y="{top+70}" width="50" height="10" fill="{sil}"/>')
        b.append(f'<path d="M{x-4},{top} a21,30 0 0 1 42,0 Z" fill="{sil}"/>')
        b.append(f'<rect x="{x+15}" y="{top-55}" width="4" height="30" fill="{sil}"/>')
    # yan binalar (düz çatı, balkon, tente)
    b.append(f'<path d="M0,620 H300 V600 H380 V900 H0 Z" fill="#0b111d"/>')
    b.append(f'<path d="M1180,600 H1420 V640 H1600 V900 H1180 Z" fill="#0b111d"/>')
    b.append(f'<path d="M1210,680 h120 l-14,26 h-92 Z" fill="#7a2f20" opacity=".7"/>')
    for x in (60, 160, 260, 1230, 1300, 1460, 1530):
        b.append(f'<rect x="{x}" y="700" width="34" height="50" fill="#ffb06a" opacity=".18"/>')
    # palmiyeler
    def palm(x, y, s):
        out = [f'<path d="M{x},{y} q{-10*s},{-120*s} {12*s},{-230*s}" stroke="{sil}" stroke-width="{9*s}" fill="none"/>']
        cx, cy = x + 12*s, y - 230*s
        for a in (-170, -140, -110, -70, -40, -10, 200, 160, 20):
            t = math.radians(a)
            tx, ty = math.cos(t) * 110*s, math.sin(t) * 45*s + 55*s  # yaprak ucu (aşağı sarkar)
            nx, ny = -math.sin(t) * 16*s, math.cos(t) * 16*s       # yaprak genişliği
            out.append(f'<path d="M{cx},{cy} Q{cx+tx*.5+nx},{cy+ty*.1-30*s+ny} {cx+tx},{cy+ty} '
                       f'Q{cx+tx*.5-nx*.3},{cy+ty*.1-30*s-ny*.3} {cx},{cy} Z" fill="{sil}"/>')
        return "".join(out)
    b += [palm(410, 900, 1.2), palm(1210, 900, 1.0)]
    b.append('<rect x="0" y="870" width="1600" height="30" fill="#04060b"/>')
    save("cs2.svg", svg("\n".join(b), defs))

# ------------------------------------------------------------------ Minecraft – piksel blok manzarası
def minecraft():
    r = random.Random(7)
    B, P = 48, 6  # blok ve piksel boyutu
    def tex(pid, base, shades, top=None):
        cells = []
        for py in range(8):
            for px in range(8):
                c = base
                if top and py < top[1] + (1 if r.random() < .4 else 0): c = r.choice(top[0])
                elif r.random() < .45: c = r.choice(shades)
                cells.append(f'<rect x="{px*P}" y="{py*P}" width="{P}" height="{P}" fill="{c}"/>')
        return f'<pattern id="{pid}" width="{B}" height="{B}" patternUnits="userSpaceOnUse">{"".join(cells)}</pattern>'
    dirt = ("#79553a", ["#6a4a31", "#8a6444", "#5d4029"])
    defs = (tex("grass", dirt[0], dirt[1], (["#5f9f35", "#4f8a2b", "#6db33e"], 2)) +
            tex("dirt", *dirt) +
            tex("stone", "#7d7d7d", ["#6e6e6e", "#8a8a8a", "#747474"]) +
            tex("leaves", "#3d7a26", ["#2f6420", "#4a8f2e", "#285619"]) +
            tex("log", "#6a5032", ["#56401f", "#7a5c39", "#4a361b"]) +
            tex("water", "#3f62d8", ["#3757c4", "#4a6fe6"]) +
            '''<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0" stop-color="#3f63c8"/><stop offset=".7" stop-color="#8db0f0"/><stop offset="1" stop-color="#b8cff5"/></linearGradient>''')
    b = ['<g shape-rendering="crispEdges">', '<rect width="1600" height="900" fill="url(#sky)"/>',
         '<rect x="1150" y="40" width="96" height="96" fill="#fff8b0"/>',
         '<rect x="1162" y="52" width="72" height="72" fill="#fffde0"/>']
    for cx, cy, w in [(120, 120, 7), (520, 70, 9), (900, 150, 6), (1340, 200, 5)]:
        b.append(f'<rect x="{cx}" y="{cy}" width="{w*B}" height="{B}" fill="#fff" opacity=".9"/>')
        b.append(f'<rect x="{cx+B}" y="{cy-B//2}" width="{(w-3)*B}" height="{B//2}" fill="#fff" opacity=".9"/>')
    cols = W // B + 2
    rows = H // B + 1
    # yükseklik haritası (satır numarası olarak yüzey)
    heights, h = [], 12
    for c in range(cols):
        h += r.choice([-1, 0, 0, 0, 1]) if c % 2 == 0 else 0
        h = max(10, min(15, h))
        heights.append(h)
    water_row = 14
    for c, h in enumerate(heights):
        x = c * B
        if h > water_row:  # çukurlar su ile dolu
            b.append(f'<rect x="{x}" y="{water_row*B}" width="{B}" height="{(h-water_row)*B}" fill="url(#water)" opacity=".85"/>')
        b.append(f'<rect x="{x}" y="{h*B}" width="{B}" height="{B}" fill="url(#grass)"/>')
        b.append(f'<rect x="{x}" y="{(h+1)*B}" width="{B}" height="{3*B}" fill="url(#dirt)"/>')
        b.append(f'<rect x="{x}" y="{(h+4)*B}" width="{B}" height="{max(0,(rows-h-4))*B+B}" fill="url(#stone)"/>')
    # ağaçlar
    for c in (3, 22, 31):
        h = heights[c]; x = c * B
        b.append(f'<rect x="{x}" y="{(h-4)*B}" width="{B}" height="{4*B}" fill="url(#log)"/>')
        b.append(f'<rect x="{x-2*B}" y="{(h-6)*B}" width="{5*B}" height="{2*B}" fill="url(#leaves)"/>')
        b.append(f'<rect x="{x-B}" y="{(h-7)*B}" width="{3*B}" height="{B}" fill="url(#leaves)"/>')
    b.append('</g>')
    save("minecraft.svg", svg("\n".join(b), defs))

# ------------------------------------------------------------------ Rust – radtown, hurda ve duman
def rust():
    r = random.Random(28)
    defs = '''
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0" stop-color="#120e0b"/><stop offset=".4" stop-color="#2c1e15"/>
 <stop offset=".66" stop-color="#7a3f1f"/><stop offset=".76" stop-color="#c0622c"/></linearGradient>
<radialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
 <stop offset="0" stop-color="#ffb060" stop-opacity=".8"/><stop offset="1" stop-color="#c0622c" stop-opacity="0"/></radialGradient>
<filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="22"/></filter>
<pattern id="corr" width="14" height="10" patternUnits="userSpaceOnUse">
 <rect width="14" height="10" fill="#2a1a12"/><rect width="5" height="10" fill="#3b2516"/><rect x="5" width="2" height="10" fill="#1a100a"/></pattern>
<pattern id="rustspots" width="90" height="90" patternUnits="userSpaceOnUse">
 <circle cx="20" cy="30" r="9" fill="#8a3a18" opacity=".35"/><circle cx="64" cy="70" r="13" fill="#6a2a10" opacity=".35"/>
 <circle cx="70" cy="14" r="5" fill="#a04a20" opacity=".3"/></pattern>'''
    sil = "#0d0907"
    b = ['<rect width="1600" height="900" fill="url(#sky)"/>',
         '<circle cx="1050" cy="640" r="360" fill="url(#sun)"/>',
         '<circle cx="1050" cy="640" r="40" fill="#ffc890" opacity=".75"/>']
    # uzak tepeler
    b.append(poly_to_bottom(ridge(r, 680, 30, 40, 10), "#3a2216", .9))
    # duman sütunları
    for x in (330, 1380):
        for i in range(7):
            b.append(f'<ellipse cx="{x + i*22 + r.randint(-20,20)}" cy="{600 - i*80}" rx="{50 + i*14}" ry="{40+i*8}" fill="#1c1410" opacity="{.55 - i*.06:.2f}" filter="url(#blur)"/>')
    # su kulesi
    b.append(f'<path d="M1300,900 L1340,560 M1460,900 L1420,560 M1320,760 L1440,700 M1440,760 L1320,700 M1310,840 L1450,800 M1450,840 L1310,800" stroke="{sil}" stroke-width="10"/>')
    b.append(f'<path d="M1290,560 V470 a90,40 0 0 1 180,0 V560 Z" fill="{sil}"/>')
    b.append(f'<rect x="1290" y="545" width="180" height="15" fill="{sil}"/>')
    # yıkık bina
    b.append(f'<path d="M60,900 V430 L140,410 L170,450 L230,420 L300,470 V900 Z" fill="{sil}"/>')
    for y in (500, 600, 700):
        for x in (95, 175, 245):
            if r.random() < .8:
                b.append(f'<rect x="{x}" y="{y}" width="34" height="46" fill="#5a2a14" opacity=".55"/>')
    # elektrik direkleri + teller
    poles = [(470, 560), (820, 590), (1130, 610)]
    for x, y in poles:
        b.append(f'<rect x="{x-6}" y="{y}" width="12" height="{900-y}" fill="{sil}"/><rect x="{x-50}" y="{y+16}" width="100" height="8" fill="{sil}"/>')
    for (x1, y1), (x2, y2) in zip(poles, poles[1:]):
        for o in (-44, 44):
            mx = (x1 + x2) / 2
            b.append(f'<path d="M{x1+o},{y1+16} Q{mx},{(y1+y2)/2+70} {x2+o},{y2+16}" stroke="{sil}" stroke-width="2" fill="none"/>')
    # hurda baraka (oluklu sac)
    b.append('<path d="M560,900 V700 L600,690 L760,705 L800,690 V900 Z" fill="url(#corr)"/>')
    b.append('<path d="M560,900 V700 L600,690 L760,705 L800,690 V900 Z" fill="url(#rustspots)"/>')
    b.append('<path d="M540,705 L610,676 L820,694" stroke="#1a100a" stroke-width="12" fill="none"/>')
    b.append('<rect x="640" y="770" width="70" height="130" fill="#0f0a07"/>')
    b.append('<rect x="880" y="760" width="160" height="140" fill="url(#corr)"/><rect x="880" y="760" width="160" height="140" fill="url(#rustspots)"/>')
    b.append('<rect x="870" y="750" width="180" height="14" fill="#1a100a"/>')
    # varil
    for x in (1070, 1110):
        b.append(f'<rect x="{x}" y="836" width="38" height="56" rx="4" fill="#4a1e10"/><rect x="{x}" y="850" width="38" height="5" fill="#2a120a"/>')
    # zemin + kayalar
    b.append(poly_to_bottom(ridge(r, 880, 6, 30, 6), "#0a0705"))
    for _ in range(60):
        b.append(f'<circle cx="{r.randint(0,W)}" cy="{r.randint(250,H)}" r="{r.uniform(.6,1.8):.1f}" fill="#ffb070" opacity="{r.uniform(.15,.45):.2f}"/>')
    save("rust.svg", svg("\n".join(b), defs))

# ------------------------------------------------------------------ Arma 3 – Altis haritası + dağlar
def arma3():
    r = random.Random(3)
    defs = '''
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0" stop-color="#151a1e"/><stop offset=".4" stop-color="#36424a"/>
 <stop offset=".6" stop-color="#8a8068"/><stop offset=".66" stop-color="#d0a868"/></linearGradient>
<linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0" stop-color="#4f5c60"/><stop offset="1" stop-color="#1e272b"/></linearGradient>
<radialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
 <stop offset="0" stop-color="#ffd890" stop-opacity=".8"/><stop offset="1" stop-color="#d0a868" stop-opacity="0"/></radialGradient>'''
    b = ['<rect width="1600" height="900" fill="url(#sky)"/>',
         '<circle cx="380" cy="590" r="330" fill="url(#sun)"/>',
         '<circle cx="380" cy="590" r="34" fill="#ffe2a8" opacity=".85"/>',
         '<rect x="0" y="592" width="1600" height="308" fill="url(#sea)"/>',
         '<rect x="330" y="596" width="100" height="3" fill="#ffd890" opacity=".5"/>',
         '<rect x="350" y="608" width="60" height="3" fill="#ffd890" opacity=".35"/>']
    # dağ katmanları
    for y0, amp, col in [(560, 70, "#4a4f45"), (640, 60, "#353a31"), (730, 50, "#23271f"), (830, 30, "#14170f")]:
        pts = [(x, round(y0 - amp*abs(math.sin(x/310 + r.random()*.4)) - r.uniform(0, amp*.4))) for x in range(-40, W+80, 40)]
        b.append(poly_to_bottom(pts, col))
    # helikopter silueti
    hx, hy, s = 1200, 120, 1.0
    b.append(f'<g fill="#0e1114" transform="translate({hx},{hy}) rotate(-6)">'
             '<path d="M0,20 q10,-26 60,-24 h70 q22,2 30,22 l-4,10 h-150 q-10,0 -6,-8 Z"/>'
             '<path d="M150,10 h120 l20,-18 h10 l-12,30 h-140 Z"/>'
             '<rect x="40" y="-14" width="70" height="8"/><rect x="-80" y="-18" width="300" height="3"/>'
             '<path d="M20,36 h110 M30,30 v8 M110,30 v8" stroke="#0e1114" stroke-width="4"/></g>')
    # topografik kontur çizgileri (harita katmanı)
    topo = ['<g fill="none" stroke="#e6d6a8" stroke-opacity=".10" stroke-width="1.4">']
    for cx, cy, base in [(300, 250, 60), (1250, 420, 50), (800, 760, 70), (1500, 120, 40)]:
        phase = [r.uniform(0, 6.28) for _ in range(4)]
        for k in range(1, 9):
            rad = base * k * .55
            pts = []
            for i in range(0, 361, 8):
                t = math.radians(i)
                rr = rad * (1 + .18*math.sin(3*t+phase[0]) + .1*math.sin(5*t+phase[1]) + .05*math.sin(7*t+phase[2]))
                pts.append(f"{cx + rr*math.cos(t)*1.4:.0f},{cy + rr*math.sin(t):.0f}")
            topo.append(f'<polygon points="{" ".join(pts)}"/>')
    topo.append('</g>')
    # harita ızgarası + koordinatlar
    topo.append('<g stroke="#e6d6a8" stroke-opacity=".07">')
    topo += [f'<line x1="{x}" y1="0" x2="{x}" y2="{H}"/>' for x in range(0, W+1, 100)]
    topo += [f'<line x1="0" y1="{y}" x2="{W}" y2="{y}"/>' for y in range(0, H+1, 100)]
    topo.append('</g><g fill="#e6d6a8" fill-opacity=".22" font-family="monospace" font-size="12">')
    topo += [f'<text x="{x+4}" y="14">{40 + x//100:03d}</text>' for x in range(0, W, 100)]
    topo += [f'<text x="4" y="{y+16}">{120 - y//100:03d}</text>' for y in range(100, H, 100)]
    topo.append('</g>')
    b += topo
    save("arma3.svg", svg("\n".join(b), defs))

for f in (cs16, cs2, minecraft, rust, arma3): f()
