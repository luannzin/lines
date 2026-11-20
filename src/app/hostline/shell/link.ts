// A Hostline link is `#<secret>~<host>`: the secret is 22 Base62 characters (131 bits), the
// host the first 22 hex characters of the host's Nostr key. Both stay after the `#`, which
// browsers never send to the server, so the page's host never learns the link.

export type Link = { secret: string; host: string };

const LINK = /^#([0-9A-Za-z]{22})~([0-9a-f]{22})$/;

export function parseLink(hash: string): Link | null {
  const m = LINK.exec(hash);
  return m ? { secret: m[1], host: m[2] } : null;
}

// first match wins, so the more specific names come first
const SYSTEMS: [string, RegExp][] = [
  ["iPhone", /iPhone/],
  ["iPad", /iPad/],
  ["Android", /Android/],
  ["Windows", /Windows/],
  ["Mac", /Mac OS X/],
  ["Linux", /Linux/],
];
const BROWSERS: [string, RegExp][] = [
  ["Edge", /Edg\//],
  ["Samsung Internet", /SamsungBrowser/],
  ["Firefox", /Firefox\/|FxiOS/],
  ["Chrome", /Chrome\/|CriOS/],
  ["Safari", /Safari\//],
];

/** How a visitor's browser names itself in the host's terminal: "Safari on iPhone". */
export function who(ua: string): string {
  const os = SYSTEMS.find(([, r]) => r.test(ua))?.[0];
  const browser = BROWSERS.find(([, r]) => r.test(ua))?.[0] ?? "A browser";
  return os ? `${browser} on ${os}` : browser;
}
