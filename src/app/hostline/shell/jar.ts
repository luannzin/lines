// `document.cookie` for a shared app. Its cookies live in a jar on the host's machine (the CLI's
// `Cookies`, src/peer.rs): every response brings the ones JavaScript may read, and a cookie the
// app sets goes there in a COOKIE frame. It's applied to the copy here too, so the page reads it
// back at once, like in a browser.

/** (name, value, path), as the CLI sends them. */
export type Cookie = [string, string, string];

/** What `document.cookie` reads on a page at `path`: longer paths first, as browsers do. */
export function read(jar: Cookie[], path: string): string {
  return jar
    .filter(([, , at]) => covers(at, path))
    .sort((a, b) => b[2].length - a[2].length)
    .map(([name, value]) => (name ? `${name}=${value}` : value))
    .join("; ");
}

/** `document.cookie = text` on a page at `path`, applied to the copy here. */
export function write(jar: Cookie[], text: string, path: string): Cookie[] {
  const [pair, ...attributes] = text.split(";");
  const eq = pair.indexOf("=");
  const name = eq < 0 ? "" : pair.slice(0, eq).trim();
  const value = (eq < 0 ? pair : pair.slice(eq + 1)).trim();
  // RFC 6265's default path: the page's path up to its last slash
  let at = path.slice(0, path.lastIndexOf("/")) || "/";
  let gone = false;
  for (const attribute of attributes) {
    const [key, ...rest] = attribute.split("=");
    const k = key.trim().toLowerCase();
    const v = rest.join("=").trim();
    if (k === "httponly") return jar; // JavaScript can't set one
    if (k === "path" && v.startsWith("/")) at = v;
    if (k === "max-age" && Number(v) <= 0) gone = true;
    if (k === "expires" && Date.parse(v) <= Date.now()) gone = true;
  }
  const others = jar.filter(([n, , p]) => !(n === name && p === at));
  return gone ? others : [...others, [name, value, at]];
}

/** Whether a cookie for `at` goes with a request to `path` (RFC 6265 path-match). */
function covers(at: string, path: string): boolean {
  return (
    path === at ||
    (path.startsWith(at) && (at.endsWith("/") || path[at.length] === "/"))
  );
}
