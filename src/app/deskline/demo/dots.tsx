"use client";

import { useEffect, useRef } from "react";
import { bayer, DUSK, grid, warm } from "@/lib/dusk";
import { cn } from "@/lib/utils";

// The link between the two windows, drawn the way Deskline draws it: dusk
// dots that reach further, grow denser and warm toward gold as the link gets
// better; a front sweeping while it forms; sparse violet drifting while it's
// lost.

export type LinkState =
  | { kind: "none" }
  | { kind: "forming" }
  | { kind: "live"; quality: number; since: number }
  | { kind: "lost" };

type Cell = (
  col: number,
  row: number,
  cols: number,
  ms: number,
) => string | null;

const SETTLE = 700; // ms for a new link to fill in behind its front

function cellFor(link: LinkState): { cell: Cell; every: number | null } {
  switch (link.kind) {
    case "none":
      // at rest the two windows are already joined: a band of the night's
      // violet, every other dot (the field around it keeps one in sixteen),
      // waiting for a link to warm it
      return {
        every: null,
        cell: (c, r) => (bayer(c, r) < 0.5 ? DUSK[0] : null),
      };
    case "forming":
      return {
        every: 50,
        cell: (c, r, cols, ms) => {
          const x = c / cols;
          const lit = Math.max(0, Math.min(1, ((ms / 2400) % 1) * 1.3 - x));
          return bayer(c, r) < lit ? warm(x) : null;
        },
      };
    case "lost":
      return {
        every: 120,
        cell: (c, r, _, ms) =>
          bayer(c + Math.floor(ms / 120), r) < 0.2 ? DUSK[0] : null,
      };
    case "live":
      return {
        every: 50,
        cell: (c, r, cols, ms) => {
          const x = c / cols;
          // the front runs out to where the link reaches, dots landing behind it
          const front = ((ms - link.since) / SETTLE) * 1.3 - x;
          const lit = Math.min(0.35 + 0.65 * link.quality, front);
          return x <= link.quality && bayer(c, r) < lit ? warm(x) : null;
        },
      };
  }
}

export function Dots({
  link,
  className,
  label,
}: {
  link: LinkState;
  className?: string;
  label?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const { cell, every } = cellFor(link);
    const settled = link.kind === "live" ? link.since + SETTLE * 1.5 : 0;
    let timer = 0;
    const paint = () => {
      const dpr = devicePixelRatio || 1;
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      const { step, dot } = grid(dpr);
      const cols = Math.floor(canvas.width / step);
      const rows = Math.floor(canvas.height / step);
      // reduced motion: one frame, a little way into the motion, or settled
      const now = performance.now();
      const ms = still ? (link.kind === "live" ? settled : 1800) : now;
      for (let c = 0; c < cols; c++)
        for (let r = 0; r < rows; r++) {
          const color = cell(c, r, cols, ms);
          if (!color) continue;
          ctx.fillStyle = color;
          ctx.fillRect(c * step, r * step, dot, dot);
        }
      // a live link stops repainting once it has settled
      if (link.kind === "live" && now > settled) clearInterval(timer);
    };
    paint();
    if (every === null || still) return;
    timer = window.setInterval(paint, every);
    return () => clearInterval(timer);
  }, [link]);

  return (
    <canvas
      ref={ref}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("block", className)}
    />
  );
}
