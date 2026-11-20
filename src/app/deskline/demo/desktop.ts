import { bayer, DUSK, dither, NIGHT } from "@/lib/dusk";

// The screen the first window shares: a desktop drawn on a canvas (the
// banner's field for a wallpaper, Deskline's mark in its glow) with the
// pointers on it. Its captureStream() is the video the second window gets.

const W = 640;
const H = 400;
const CELL = 4; // dots big enough to survive a video encoder
const LINE = "#1a1424";
const WHITE = "#f5f5f5";
// the mark's pointer (tools/logo.py), o = outline, w = white
const POINTER = [
  "o......",
  "oo.....",
  "owo....",
  "owwo...",
  "owwwo..",
  "owwwwo.",
  "owwwwwo",
  "owwoooo",
  "owo....",
  "oo.....",
];
const PX = 3; // canvas pixels per pointer pixel
const BURST = 600; // ms a click mark stays

export type Who = "you" | "them";
type Point = { x: number; y: number };

export function createDesktop(mark: HTMLImageElement) {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // the wallpaper is drawn once
  const paper = document.createElement("canvas");
  paper.width = W;
  paper.height = H;
  const p = paper.getContext("2d") as CanvasRenderingContext2D;
  p.fillStyle = NIGHT;
  p.fillRect(0, 0, W, H);
  const ramp = [NIGHT, ...DUSK];
  for (let y = 0; y < H; y += CELL)
    for (let x = 0; x < W; x += CELL) {
      const near = Math.max(
        0,
        1 - Math.hypot(x - W / 2, (y - H * 0.62) * 1.6) / 420,
      );
      const t = Math.max(near ** 1.6, 0.08 + 0.25 * (y / H) ** 2);
      const i = dither(5, t, x / CELL, y / CELL);
      if (i === 0) continue;
      p.fillStyle = ramp[i];
      p.fillRect(x, y, CELL - 1, CELL - 1);
    }
  p.imageSmoothingEnabled = false;
  const size = 128; // the 32px mark at 4x
  p.drawImage(mark, (W - size) / 2, H * 0.62 - size / 2 - 12, size, size);

  const pointers: Record<Who, Point | null> = { you: null, them: null };
  let bursts: (Point & { at: number })[] = [];
  let frame = 0;

  const drawPointer = ({ x, y }: Point) => {
    POINTER.forEach((row, dy) => {
      [...row].forEach((c, dx) => {
        if (c === ".") return;
        ctx.fillStyle = c === "o" ? LINE : WHITE;
        ctx.fillRect(
          Math.round(x * W) + dx * PX,
          Math.round(y * H) + dy * PX,
          PX,
          PX,
        );
      });
    });
  };

  // a click leaves a ring of dusk dots that opens and thins out
  const drawBurst = (b: Point & { at: number }, now: number) => {
    const k = still ? 0.5 : Math.min(1, (now - b.at) / BURST);
    const r = 6 + 22 * (1 - (1 - k) ** 3);
    for (let a = 0; a < 24; a++) {
      const angle = (a / 24) * Math.PI * 2;
      if (bayer(a, Math.round(k * 4)) < k * 0.9) continue;
      ctx.fillStyle = DUSK[3 - Math.min(3, Math.floor(k * 4))];
      ctx.fillRect(
        Math.round(b.x * W + Math.cos(angle) * r) - 1,
        Math.round(b.y * H + Math.sin(angle) * r) - 1,
        3,
        3,
      );
    }
  };

  const draw = (now: number) => {
    ctx.drawImage(paper, 0, 0);
    bursts = bursts.filter((b) => now - b.at < BURST);
    for (const b of bursts) drawBurst(b, now);
    if (pointers.them) drawPointer(pointers.them);
    if (pointers.you) drawPointer(pointers.you);
    frame = requestAnimationFrame(draw);
  };

  return {
    canvas,
    start() {
      if (!frame) frame = requestAnimationFrame(draw);
    },
    stop() {
      cancelAnimationFrame(frame);
      frame = 0;
      pointers.you = pointers.them = null;
      bursts = [];
    },
    move(who: Who, at: Point | null) {
      pointers[who] = at;
    },
    click(at: Point) {
      bursts.push({ ...at, at: performance.now() });
    },
  };
}

export type Desktop = ReturnType<typeof createDesktop>;
