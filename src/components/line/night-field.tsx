"use client";

import { useEffect, useRef } from "react";
import { bayer, DUSK, dither, grid, NIGHT } from "@/lib/dusk";

// The banner's field, live: 2px dots on a 3px grid, dithered from the night
// toward the dusk glow around the element marked `data-glow` in the same
// section (the line's mark). The element marked `data-calm` (the words) keeps
// the glow off itself so the text reads: with `under` "night" (the hero) it
// sits on plain night 24px around, the field back to full strength 176px
// further out; with "dots" (Hostline's shell, words alone on a whole screen,
// where an empty box around them reads as a plate) the night's sparse violet
// dots run under it and only the glow fades, from its box out over 240px.
// The night itself ends in a dither too: across the section's last `band`
// pixels its cells thin out in Bayer order onto the ground below (line.tsx
// leaves that much of the section unfilled, bottom-40; the shell has nothing
// below, so its night runs to the edge with no band). The dots develop once,
// settling in Bayer order behind a front; under reduced motion they are
// simply there.

const RAMP = 5; // night, then the four dusk colours
const DEVELOP = 1400; // ms

export function NightField({
  band: bandCss = 160,
  under = "night",
}: {
  band?: number;
  under?: "night" | "dots";
}) {
  const [clear, fade] = under === "night" ? [24, 176] : [0, 240];
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    const section = canvas?.parentElement;
    if (!canvas || !ctx || !section) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

    // per colour, the cells it owns, with the order each one develops in
    let cells: { x: number; y: number; at: number }[][] = [];
    // the night's own cells in the band at the bottom
    let seam: { x: number; y: number }[] = [];
    let dot = 2;
    let step = 3;
    let frame = 0;
    let start = 0;

    const build = () => {
      const dpr = devicePixelRatio || 1;
      const box = section.getBoundingClientRect();
      canvas.width = Math.round(box.width * dpr);
      canvas.height = Math.round(box.height * dpr);
      const g = grid(dpr);
      dot = g.dot;
      step = g.step;
      const band = bandCss * dpr;
      const bandTop = canvas.height - band;
      // the words' box, in device pixels
      const calmEl = section
        .querySelector("[data-calm]")
        ?.getBoundingClientRect();
      const calm = calmEl && {
        left: (calmEl.left - box.left) * dpr,
        right: (calmEl.right - box.left) * dpr,
        top: (calmEl.top - box.top) * dpr,
        bottom: (calmEl.bottom - box.top) * dpr,
      };
      const glowEl = section.querySelector("[data-glow]");
      const glow = glowEl?.getBoundingClientRect();
      // the glow's centre and reach, in device pixels
      const gx = glow
        ? (glow.left + glow.width / 2 - box.left) * dpr
        : canvas.width * 0.8;
      const gy = glow
        ? (glow.top + glow.height / 2 - box.top) * dpr
        : canvas.height * 0.3;
      const reach =
        Math.max(420, Math.min(box.width * 0.62, 900)) *
        dpr *
        (box.width < 640 ? 0.75 : 1);
      const cols = Math.ceil(canvas.width / g.step);
      const rows = Math.ceil(canvas.height / g.step);
      cells = DUSK.map(() => []);
      seam = [];
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const x = c * g.step;
          const y = r * g.step;
          // a row straddling the band's top is band too, or the ground shows through the gap
          // between the night's edge and the first full row
          if (y + g.step > bandTop) {
            // full cells of night, fewer the lower they sit
            if (bayer(c, r) < 1 - (y - bandTop) / band) seam.push({ x, y });
            continue;
          }
          const near = Math.max(
            0,
            1 - Math.hypot(x - gx, (y - gy) * 1.6) / reach,
          );
          // the dusk thins toward the band, so the night ends before it does
          const thin = 1 - (y / bandTop) ** 3;
          // how far outside the words' box this cell is: plain night under
          // them and `clear` px around, the field back to full strength
          // `fade` px further out
          const out = calm
            ? Math.min(
                1,
                Math.max(
                  0,
                  Math.hypot(
                    Math.max(calm.left - x, 0, x - calm.right),
                    Math.max(calm.top - y, 0, y - calm.bottom),
                  ) -
                    clear * dpr,
                ) /
                  (fade * dpr),
              )
            : 1;
          let i = dither(RAMP, near ** 1.6 * thin * out, c, r);
          // away from the glow the night keeps one violet dot in sixteen,
          // thinning out at random toward the words, so the calm has no edge
          // (or, under "dots", running on under them)
          if (i === 0 && bayer(c, r) > 0.9) {
            const hash = (((c * 73856093) ^ (r * 19349663)) >>> 0) % 1024;
            if (under === "dots" || hash / 1024 < out) i = 1;
          }
          if (i === 0) continue;
          // the front crosses left to right; each dot lands at its Bayer turn
          const at = (x / canvas.width) * 0.6 + bayer(c, r) * 0.4;
          cells[i - 1].push({ x, y, at });
        }
      }
    };

    const draw = (p: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = NIGHT;
      for (const cell of seam) ctx.fillRect(cell.x, cell.y, step, step);
      cells.forEach((list, i) => {
        ctx.fillStyle = DUSK[i];
        for (const cell of list)
          if (cell.at <= p) ctx.fillRect(cell.x, cell.y, dot, dot);
      });
    };

    const develop = (now: number) => {
      if (!start) start = now;
      // exponential ease-out: quick to appear, slow to settle
      const k = Math.min(1, (now - start) / DEVELOP);
      draw(1 - 2 ** (-10 * k));
      frame = k < 1 ? requestAnimationFrame(develop) : 0;
    };

    let first = true;
    const resize = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      build();
      if (first && !still) frame = requestAnimationFrame(develop);
      else draw(1);
      first = false;
    });
    resize.observe(section);
    return () => {
      resize.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [bandCss, clear, fade, under]);

  return (
    // biome-ignore lint/a11y/noAriaHiddenOnFocusable: a canvas isn't focusable; this one is art
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full"
    />
  );
}
