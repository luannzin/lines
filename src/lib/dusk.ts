// The lines' shared world, as each app's tools/logo.py draws it: luannzin.com's
// dusk, sky to horizon, over the night, in a 4x4 Bayer ordered dither.

export const NIGHT = "#110d24";
export const DUSK = ["#3a2a6b", "#7a3361", "#e0703f", "#ffd180"] as const;

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

/** The Bayer threshold of cell (col, row), 0 to 15/16. */
export function bayer(col: number, row: number) {
  return BAYER[(row & 3) * 4 + (col & 3)] / 16;
}

/** Which of `n` colours along a ramp cell (col, row) takes at t (0..1). */
export function dither(n: number, t: number, col: number, row: number) {
  return Math.max(
    0,
    Math.min(n - 1, Math.round(t * (n - 1) + bayer(col, row) - 0.5)),
  );
}

/** The dusk colour at x (0..1) along a strip: violet first, gold last. */
export const warm = (x: number) => DUSK[Math.min(3, Math.floor(x * 4))];

/** Dots are 2px on a 3px grid, rounded to whole device pixels. */
export function grid(dpr: number) {
  return {
    step: Math.max(2, Math.round(3 * dpr)),
    dot: Math.max(1, Math.round(2 * dpr)),
  };
}
