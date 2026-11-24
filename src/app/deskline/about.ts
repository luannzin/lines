import type { File } from "@/components/line/line";
import { type Locale, translations } from "@/i18n/generated";
import type { About } from "@/lib/seo";

// public/deskline/install.sh, served at the subdomain's root (src/proxy.ts)
export const INSTALL =
  "curl -fsSL https://deskline.luannzin.com/install.sh | sh";
export const REPO = "https://github.com/luannzin/deskline";

/** The releases, newest first: version and the day it came out (GitHub's release dates). */
export const RELEASES = [
  ["0.9.0", "2026-11-24", "v090"],
  ["0.8.0", "2026-11-19", "v080"],
  ["0.7.0", "2026-11-19", "v070"],
  ["0.6.0", "2026-11-19", "v060"],
  ["0.4.0", "2026-11-18", "v040"],
  ["0.3.0", "2026-11-18", "v030"],
  ["0.2.1", "2026-11-18", "v021"],
  ["0.2.0", "2026-11-18", "v020"],
] as const;

/** README's install table, in its order; names are the release assets'. */
const files = (locale: Locale): File[] => {
  const f = translations[locale].app.deskline.files;
  return [
    {
      system: "windows",
      label: f.windows.system,
      name: "deskline.exe",
      how: f.windows.how,
      first: f.windows.first,
    },
    {
      system: "linux",
      label: f.deb.system,
      name: "deskline_amd64.deb",
      how: f.deb.how,
    },
    {
      system: "linux",
      label: f.portable.system,
      name: "deskline-linux-x86_64",
      how: f.portable.how,
    },
    {
      system: "mac",
      label: f.dmg.system,
      name: "Deskline.dmg",
      how: f.dmg.how,
      first: f.dmg.first,
      line: { text: f.dmg.line, command: INSTALL },
    },
    {
      system: "mac",
      label: f.zip.system,
      name: "Deskline-macos.zip",
      how: f.zip.how,
    },
  ];
};

export const about: About = {
  line: "deskline",
  name: "Deskline",
  repo: "luannzin/deskline",
  category: "UtilitiesApplication",
  version: RELEASES[0][0],
  post: "/writing/no-server-to-run",
  files,
};
