"""Draws the lines' images for Luan's social profiles:

    python tools/social.py

assets/social/linkedin-banner.png (1584x396, the LinkedIn background) and one square card per
project, assets/social/<name>.png (1200x1200, the media on each LinkedIn project).

Same world as each line's README banner (its tools/logo.py): a field of dots on a grid,
Bayer-dithered from the night (#110d24) through the dusk (violet, plum, ember, gold) toward a
glow just under each mark, the 32x32 marks scaled up with nearest-neighbour, and words in the
5x7 pixel face. Words sit where the field is still night, never on a cut-out plate. The cards
carry no words: LinkedIn prints the project's name and description beside its media.

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


NIGHT = rgb("#110d24")
DUSK = [rgb("#3a2a6b"), rgb("#7a3361"), rgb("#e0703f"), rgb("#ffd180")]
INK = rgb("#f5f5f5")  # 17.4:1 on the night
SOFT = rgb("#b2b2b2")  # 8.95:1 on the night, 5.75:1 on a violet dot, only 4.0:1 on plum
BAYER = ((0, 8, 2, 10), (12, 4, 14, 6), (3, 11, 1, 9), (15, 7, 13, 5))
RAMP = [NIGHT] + DUSK
CELL = 4  # a 3px dot every 4px, as on the README banners

MARKS = {
    "deskline": os.path.join(REPO, "public", "deskline", "mark.png"),
    "sightline": os.path.join(HERE, "marks", "sightline.png"),
    "hostline": os.path.join(REPO, "public", "hostline", "mark.png"),
    "lanpet": os.path.join(HERE, "marks", "lanpet.png"),
}

# 5x7 pixel face, the same as the lines' tools/logo.py: 35 cells per glyph, rows top to bottom.
FONT = {
    "A": ".###.#...##...#######...##...##...#",
    "C": ".###.#...##....#....#....#...#.###.",
    "D": "####.#...##...##...##...##...#####.",
    "E": "######....#....####.#....#....#####",
    "H": "#...##...##...#######...##...##...#",
    "I": ".###...#....#....#....#....#...###.",
    "K": "#...##..#.#.#..##...#.#..#..#.#...#",
    "L": "#....#....#....#....#....#....#####",
    "N": "#...###..##.#.##..###...##...##...#",
    "O": ".###.#...##...##...##...##...#.###.",
    "P": "####.#...##...#####.#....#....#....",
    "R": "####.#...##...#####.#.#..#..#.#...#",
    "S": ".#####....#.....###.....#....#####.",
    "T": "#####..#....#....#....#....#....#..",
    "Y": "#...##...#.#.#...#....#....#....#..",
    " ": "." * 35,
}


def width(s, scale):
    """Width of `s` in the face: 6 font pixels a letter, less the last letter's gap."""
    return (6 * len(s) - 1) * scale


def text(img, s, x, y, scale, color):
    px = img.load()
    for ch in s:
        for i, c in enumerate(FONT[ch]):
            if c == "#":
                gx, gy = x + (i % 5) * scale, y + (i // 5) * scale
                for yy in range(gy, gy + scale):
                    for xx in range(gx, gx + scale):
                        px[xx, yy] = color
        x += 6 * scale


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


def mark(name, scale):
    m = Image.open(MARKS[name]).convert("RGBA")
    return m.resize((m.width * scale, m.height * scale), Image.NEAREST)


def banner():
    """1584x396. LinkedIn lays the round photo over the lower left and phones crop the sides, so
    everything sits in the centre 70% (x 240 to 1352), the words left and above the photo's top
    edge (near y 240 on desktop), the three lines' marks right, top and bottom edges shared with
    the words. Each mark stands on its own glow; the reach (340) keeps the words on violet dots
    at most, where the soft ink still clears 4.5:1 (at 380, plum reached "NEED")."""
    w, h = 1584, 396
    title, sub = "THE LINES", ("APPS THAT ONLY NEED", "A CODE OR A LINK")
    tx, ty = 240, 72
    s1y, s2y = ty + 63 + 28, ty + 63 + 28 + 40
    marks = ["deskline", "sightline", "hostline"]
    size, gap = 160, 32  # the words sit 91px off: more than twice the gap between marks
    mx0 = 1352 - (len(marks) * size + (len(marks) - 1) * gap)
    my = 72
    glows = [(mx0 + i * (size + gap) + size / 2, my + size + 8, 340) for i in range(len(marks))]
    img = field(w, h, glows)
    text(img, title, tx, ty, 9, INK)
    text(img, sub[0], tx, s1y, 4, SOFT)
    text(img, sub[1], tx, s2y, 4, SOFT)
    for i, name in enumerate(marks):
        img.alpha_composite(mark(name, size // 32), (mx0 + i * (size + gap), my))
    return img


def card(name):
    """1200x1200: the mark at 12x in the middle, standing on its glow the way it does on its
    README banner, so a thumbnail cropped to landscape keeps all of it."""
    w = h = 1200
    size = 384
    mx, my = (w - size) // 2, (h - size) // 2
    img = field(w, h, [(w / 2, my + size, 1100)])
    img.alpha_composite(mark(name, size // 32), (mx, my))
    return img


def main():
    os.makedirs(OUT, exist_ok=True)
    banner().convert("RGB").save(os.path.join(OUT, "linkedin-banner.png"))
    for name in MARKS:
        card(name).convert("RGB").save(os.path.join(OUT, f"{name}.png"))


if __name__ == "__main__":
    main()
