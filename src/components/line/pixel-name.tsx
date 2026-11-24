// A line's name in the 5x7 pixel face its tools/logo.py draws the banner
// with, one rect per font pixel. The glyphs are copied from that script.
const FONT: Record<string, string> = {
  D: "####.#...##...##...##...##...#####.",
  E: "######....#....####.#....#....#####",
  H: "#...##...##...#######...##...##...#",
  I: ".###...#....#....#....#....#...###.",
  K: "#...##..#.#.#..##...#.#..#..#.#...#",
  L: "#....#....#....#....#....#....#####",
  N: "#...###..##.#.##..###...##...##...#",
  O: ".###.#...##...##...##...##...#.###.",
  S: ".#####....#.....###.....#....#####.",
  T: "#####..#....#....#....#....#....#..",
};

/** Draws `name`; its width follows the font size (7 rows = the cap height). */
export function PixelName({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const letters = name.toUpperCase().split("");
  const width = letters.length * 6 - 1;
  return (
    <svg
      viewBox={`0 0 ${width} 7`}
      shapeRendering="crispEdges"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      style={{ width: `${width / 7}em`, height: "1em" }}
    >
      {letters.flatMap((ch, i) =>
        [...FONT[ch]].map((cell, j) =>
          cell === "#" ? (
            <rect
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed glyph grid
              key={`${i}-${j}`}
              x={i * 6 + (j % 5)}
              y={Math.floor(j / 5)}
              width="1"
              height="1"
            />
          ) : null,
        ),
      )}
    </svg>
  );
}
