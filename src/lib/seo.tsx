import type { Metadata } from "next";
import type { File } from "@/components/line/line";
import { type Locale, translations } from "@/i18n/generated";
import { type Line, origin } from "@/lib/lines";

// What search engines and agents read about a line, kept beside its page
// (`src/app/<line>/about.ts`) and used by its metadata, its structured data,
// its llms.txt and the sitemap.
export type About = {
  line: Line;
  name: string;
  /** `owner/repo` on GitHub */
  repo: string;
  /** schema.org's applicationCategory */
  category: "UtilitiesApplication" | "DeveloperApplication";
  /** the latest release, when the page lists releases */
  version?: string;
  /** the post about it on luannzin.com, as a path (`/writing/<slug>`) */
  post?: string;
  /** a command-line app's commands, as its page shows them */
  run?: string[];
  files: (locale: Locale) => File[];
};

// The page's address in a language: each line's Portuguese page also lives at
// /pt (src/proxy.ts), which is what search engines index for Portuguese.
export const localized = (locale: Locale) => (locale === "pt" ? "/pt" : "/");

// luannzin.com's page in a language: its Portuguese pages live under /pt too.
export const site = (path: string, locale: Locale) =>
  `https://www.luannzin.com${locale === "pt" ? `/pt${path === "/" ? "" : path}` : path}`;

export const download = (repo: string, file: File) =>
  `https://github.com/${repo}/releases/latest/download/${file.name}`;

export function lineMetadata(
  about: About,
  locale: Locale,
  meta: { title: string; description: string; ogLocale: string },
): Metadata {
  const url = localized(locale);
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: url,
      languages: { en: "/", pt: "/pt", "x-default": "/" },
      types: { "text/markdown": "/llms.txt" },
    },
    openGraph: {
      type: "website",
      url,
      siteName: about.name,
      locale: meta.ogLocale,
      title: meta.title,
      description: meta.description,
    },
    twitter: { card: "summary_large_image", creator: "@__luannzin" },
  };
}

// Luan, by the @id his own site gives him (luannzin.com's src/lib/json-ld.tsx),
// so the app, its post and his profiles read as one author's.
const author = {
  "@type": "Person",
  "@id": "https://www.luannzin.com/#person",
  name: "Luan Fabri",
  url: "https://www.luannzin.com",
};

/** The line as a SoftwareApplication, with the @id luannzin.com points at (`<origin>/#app`). */
export function structuredData(about: About, locale: Locale) {
  const home = origin(about.line);
  const meta = translations[locale].app[about.line].meta;
  const systems = { windows: "Windows", mac: "macOS", linux: "Linux" };
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${home}/#website`,
        url: home,
        name: about.name,
        inLanguage: ["en", "pt-BR"],
        publisher: { "@id": author["@id"] },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${home}/#app`,
        name: about.name,
        url: home,
        description: meta.description,
        applicationCategory: about.category,
        operatingSystem: [
          ...new Set(about.files("en").map((f) => systems[f.system])),
        ].join(", "),
        softwareVersion: about.version,
        downloadUrl: `https://github.com/${about.repo}/releases/latest`,
        image: `${home}/${about.line}/opengraph-image.png`,
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        inLanguage: locale === "pt" ? "pt-BR" : "en",
        author,
        sameAs: [`https://github.com/${about.repo}`],
        subjectOf: about.post
          ? { "@id": `https://www.luannzin.com${about.post}#article` }
          : undefined,
      },
    ],
  };
}

/** The line for agents, at /llms.txt: what it is, how to get it, where to read more. */
export function llms(about: About) {
  const p = translations.en.app[about.line];
  const home = origin(about.line);
  const files = about
    .files("en")
    .map(
      (f) =>
        `- ${f.label}: [${f.name}](${download(about.repo, f)}). ${f.how}${
          f.line ? ` ${f.line.text} \`${f.line.command}\`` : ""
        }`,
    );
  return `# ${about.name}

> ${p.meta.description}

${p.hero.line} ${p.hero.lead}

## Install

${files.join("\n")}
${about.run ? `\n## Run\n\n\`\`\`sh\n${about.run.join("\n")}\n\`\`\`\n` : ""}
## Links

- Page: ${home} (in Portuguese: ${home}/pt)
- Source: https://github.com/${about.repo}
- Releases: https://github.com/${about.repo}/releases
${about.post ? `- How it works: https://www.luannzin.com${about.post}\n` : ""}- Made by Luan Fabri: https://www.luannzin.com
`;
}

// `<` is escaped so a string in the data can never close the script tag.
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: serialised data, with "<" escaped
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
