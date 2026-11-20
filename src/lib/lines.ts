// The lines with a page here. Each is served at its own subdomain of
// luannzin.com (src/proxy.ts) and at /<line> everywhere else.
export const lines = ["deskline", "hostline"] as const;
export type Line = (typeof lines)[number];

export const origin = (line: Line) => `https://${line}.luannzin.com`;
