import type { File } from "@/components/line/line";
import { type Locale, translations } from "@/i18n/generated";
import type { About } from "@/lib/seo";

// public/hostline/install.sh and install.ps1, served at the subdomain's root (src/proxy.ts)
const UNIX = "curl -fsSL https://hostline.luannzin.com/install.sh | sh";
const WINDOWS = "irm https://hostline.luannzin.com/install.ps1 | iex";

/** The README's install table, in its order; names are the release assets'. */
const files = (locale: Locale): File[] => {
  const f = translations[locale].app.hostline.files;
  return [
    {
      system: "linux",
      label: f.linux.system,
      name: "hostline-linux-x86_64",
      how: f.linux.how,
      line: { text: f.linux.line, command: UNIX },
    },
    {
      system: "linux",
      label: f.arm.system,
      name: "hostline-linux-arm64",
      how: f.arm.how,
    },
    {
      system: "mac",
      label: f.mac.system,
      name: "hostline-macos",
      how: f.mac.how,
      line: { text: f.mac.line, command: UNIX },
    },
    {
      system: "windows",
      label: f.windows.system,
      name: "hostline-windows-x86_64.exe",
      how: f.windows.how,
      line: { text: f.windows.line, command: WINDOWS },
    },
  ];
};

export const about: About = {
  line: "hostline",
  name: "Hostline",
  repo: "luannzin/hostline",
  category: "DeveloperApplication",
  files,
  run: ["hostline 3000", "npx hostline 3000"],
};
