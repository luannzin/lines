"""Draws Luan's social images:

    python tools/social.py

assets/social/linkedin-banner.png (1584x396, the LinkedIn background) and one square card per
project, assets/social/<name>.png (1200x1200, the media on each LinkedIn project).

The banner is the one he used before, redrawn in the lines' pixel face: an AMOLED black ground
and "luannzin" in the middle, its final dot in rose. Nothing else.

The cards are the README banners' world: a field of dots on a grid, Bayer-dithered from the
night (#110d24) through the dusk (violet, plum, ember, gold) toward a glow just under the
32x32 mark, scaled up with nearest-neighbour. No words: LinkedIn prints the project's name and
description beside its media.

The marks come from public/<line>/mark.png (Deskline, Hostline) and tools/marks/ (Sightline's,
taken from its 512px copy at 16x; LanPet's frog, the first frame of lanpet/assets/frog.png).
"""

import os

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.join(HERE, "..")
OUT = os.path.join(REPO, "assets", "social")


def rgb(h):
    return tuple(int(h[i : i + 2], 16) for i in (1, 3, 5)) + (255,)


BLACK = rgb("#000000")
INK = rgb("#f5f5f5")
ROSE = rgb("#f43f5e")  # his old banner's rose; the exact value wasn't kept, this is rose-500
NIGHT = rgb("#110d24")
DUSK = [rgb("#3a2a6b"), rgb("#7a3361"), rgb("#e0703f"), rgb("#ffd180")]
BAYER = ((0, 8, 2, 10), (12, 4, 14, 6), (3, 11, 1, 9), (15, 7, 13, 5))
RAMP = [NIGHT] + DUSK
CELL = 4  # a 3px dot every 4px, as on the README banners

MARKS = {
    "deskline": os.path.join(REPO, "public", "deskline", "mark.png"),
    "sightline": os.path.join(HERE, "marks", "sightline.png"),
    "hostline": os.path.join(REPO, "public", "hostline", "mark.png"),
    "lanpet": os.path.join(HERE, "marks", "lanpet.png"),
}

# The lowercase the lines' 5x7 face (tools/logo.py, capitals only) never needed: 5 cells by 7
# rows, x-height of 5 rows, l and the i's dot reaching the top row. The full stop is the face's
# one-pixel dot, set against the letter before it.
FONT = {
    "l": [".##..", "..#..", "..#..", "..#..", "..#..", "..#..", ".###."],
    "u": [".....", ".....", "#...#", "#...#", "#...#", "#..##", ".##.#"],
    "a": [".....", ".....", ".###.", "....#", ".####", "#...#", ".####"],
    "n": [".....", ".....", "#.##.", "##..#", "#...#", "#...#", "#...#"],
    "z": [".....", ".....", "#####", "...#.", "..#..", ".#...", "#####"],
    "i": ["..#..", ".....", ".##..", "..#..", "..#..", "..#..", ".###."],
    ".": [".", ".", ".", ".", ".", ".", "#"],
}


def word(s, scale, colors):
    """`s` in the face on a transparent layer cropped to its ink, one font pixel between
    letters; `colors` maps a character to its colour, INK otherwise."""
    layer = Image.new("RGBA", ((6 * len(s)) * scale, 7 * scale), (0, 0, 0, 0))
    px = layer.load()
    x = 0
    for ch in s:
        rows = FONT[ch]
        for r, row in enumerate(rows):
            for c, cell in enumerate(row):
                if cell == "#":
                    for yy in range(r * scale, (r + 1) * scale):
                        for xx in range(x + c * scale, x + (c + 1) * scale):
                            px[xx, yy] = colors.get(ch, INK)
        x += (max(len(r) for r in rows) + 1) * scale
    return layer.crop(layer.getbbox())


def banner():
    """1584x396: black, and "luannzin." in the middle at 12 image pixels per font pixel. The
    middle is clear of everything LinkedIn lays over it (the round photo at the lower left) and of
    a phone's side crop."""
    w, h = 1584, 396
    img = Image.new("RGBA", (w, h), BLACK)
    name = word("luannzin.", 12, {".": ROSE})
    img.alpha_composite(name, ((w - name.width) // 2, (h - name.height) // 2))
    return img


def field(w, h, glows):
    """Dots on the grid, night dithering toward the dusk at each glow (x, y, reach), the glow
    stretched 1.6x across as on the README banners."""
    img = Image.new("RGBA", (w, h), NIGHT)
    px = img.load()
    for y in range(0, h, CELL):
        for x in range(0, w, CELL):
            cx, cy = x + CELL / 2, y + CELL / 2
            near = 0.0
            for gx, gy, reach in glows:
                d = ((cx - gx) ** 2 + ((cy - gy) * 1.6) ** 2) ** 0.5
                near = max(near, 1 - d / reach)
            t = max(near ** 1.6, 0.08 + 0.25 * (y / h) ** 2)
            step = t * 4 + BAYER[(y // CELL) % 4][(x // CELL) % 4] / 16 - 0.5
            c = RAMP[max(0, min(4, round(step)))]
            if c != NIGHT:
                for yy in range(y, min(h, y + CELL - 1)):
                    for xx in range(x, min(w, x + CELL - 1)):
                        px[xx, yy] = c
    return img


def card(name):
    """1200x1200: the mark at 12x in the middle, standing on its glow the way it does on its
    README banner, so a thumbnail cropped to landscape keeps all of it."""
    w = h = 1200
    size = 384
    mx, my = (w - size) // 2, (h - size) // 2
    img = field(w, h, [(w / 2, my + size, 1100)])
    m = Image.open(MARKS[name]).convert("RGBA")
    img.alpha_composite(m.resize((size, size), Image.NEAREST), (mx, my))
    return img


def main():
    os.makedirs(OUT, exist_ok=True)
    banner().convert("RGB").save(os.path.join(OUT, "linkedin-banner.png"))
    for name in MARKS:
        card(name).convert("RGB").save(os.path.join(OUT, f"{name}.png"))


if __name__ == "__main__":
    main()
