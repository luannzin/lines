import type { Metadata } from "next";
import { InstallLine } from "@/components/line/install-line";
import { type File, Line, Part } from "@/components/line/line";
import { getLocale, setLocale, t } from "@/i18n/generated";
import { Demo } from "./demo/demo";

// public/deskline/install.sh, served at the subdomain's root (src/proxy.ts)
const INSTALL = "curl -fsSL https://deskline.luannzin.com/install.sh | sh";
const REPO = "https://github.com/luannzin/deskline";

/** The releases, newest first: version and the day it came out (GitHub's release dates). */
const RELEASES = [
  ["0.9.0", "2026-11-24", "v090"],
  ["0.8.0", "2026-11-19", "v080"],
  ["0.7.0", "2026-11-19", "v070"],
  ["0.6.0", "2026-11-19", "v060"],
  ["0.4.0", "2026-11-18", "v040"],
  ["0.3.0", "2026-11-18", "v030"],
  ["0.2.1", "2026-11-18", "v021"],
  ["0.2.0", "2026-11-18", "v020"],
] as const;

export async function generateMetadata(): Promise<Metadata> {
  await setLocale();
  const m = t.app.deskline.meta;
  return {
    title: m.title,
    description: m.description,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      url: "/",
      siteName: "Deskline",
      locale: m.ogLocale,
      title: m.title,
      description: m.description,
    },
    twitter: { card: "summary_large_image", creator: "@__luannzin" },
  };
}

export default async function Deskline() {
  await setLocale();
  const p = t.app.deskline;
  const c = t.components.line;
  const f = p.files;
  // README's install table, in its order; names are the release assets'
  const files: File[] = [
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

  return (
    <Line
      name="Deskline"
      repo="luannzin/deskline"
      mark="/deskline/mark.png"
      line={p.hero.line}
      lead={p.hero.lead}
      phone={p.hero.phone}
      files={files}
      updates={f.updates}
      steps={
        <>
          <p className="font-medium">{p.hero.sent}</p>
          <ol className="mt-3 flex list-decimal flex-col gap-2 ps-5 text-foreground/70 marker:font-mono marker:text-muted-foreground">
            <li>{p.hero.steps.download}</li>
            <li>{p.hero.steps.copy}</li>
            <li>{p.hero.steps.accept}</li>
          </ol>
        </>
      }
      live={
        <section aria-labelledby="try-title">
          <h2 id="try-title" className="font-medium">
            {p.try.title}
          </h2>
          <p className="mt-2 max-w-2xl text-pretty text-foreground/70">
            {p.try.lead}
          </p>
          <div className="mt-8">
            <Demo locale={getLocale()} />
          </div>
        </section>
      }
    >
      <Part title={p.first.title}>
        <p className="max-w-prose text-pretty text-foreground/70">
          {p.first.lead}
        </p>
        <dl className="mt-10 flex max-w-prose flex-col gap-8">
          <div className="flex flex-col gap-1.5">
            <dt className="font-medium">Windows</dt>
            <dd className="text-pretty text-foreground/70">
              {p.first.windows}
            </dd>
          </div>
          <div className="flex flex-col gap-1.5">
            <dt className="font-medium">macOS</dt>
            <dd>
              <ol className="flex list-decimal flex-col gap-3 ps-5 text-foreground/70 marker:font-mono marker:text-muted-foreground">
                <li className="text-pretty">
                  {p.first.mac.install}
                  <div className="mt-3">
                    <InstallLine
                      command={INSTALL}
                      copy={c.copy}
                      copied={c.copied}
                    />
                  </div>
                </li>
                <li className="text-pretty">{p.first.mac.allow}</li>
                <li className="text-pretty">{p.first.mac.restart}</li>
              </ol>
            </dd>
          </div>
          <div className="flex flex-col gap-1.5">
            <dt className="font-medium">Linux</dt>
            <dd className="text-pretty text-foreground/70">{p.first.linux}</dd>
          </div>
        </dl>
      </Part>

      <Part title={p.inside.title}>
        <p className="max-w-prose text-pretty text-foreground/70">
          {p.inside.lead}
        </p>
        <dl className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {Object.entries(p.inside.rows).map(([key, row]) => (
            <div key={key} className="flex flex-col gap-1.5">
              <dt className="font-medium">{row.term}</dt>
              <dd className="text-pretty text-foreground/70">{row.text}</dd>
            </div>
          ))}
        </dl>
      </Part>

      <Part title={p.anydesk.title}>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b [&>*]:pb-3 [&>*]:font-medium">
              <th scope="col" className="w-2/5 pr-6">
                {p.anydesk.them}
              </th>
              <th scope="col">{p.anydesk.us}</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(p.anydesk.rows).map(([key, row]) => (
              <tr key={key} className="border-b align-top [&>*]:py-3">
                <th
                  scope="row"
                  className="pr-6 font-normal text-muted-foreground"
                >
                  {row.them}
                </th>
                <td className="text-pretty text-foreground/70">{row.us}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-6 text-muted-foreground">{p.anydesk.missing}</p>
      </Part>

      <Part title={p.safe.title}>
        <ul className="flex flex-col gap-5">
          {Object.entries(p.safe.rows).map(([key, text]) => (
            <li
              key={key}
              className="max-w-prose text-pretty text-foreground/70"
            >
              {text}
            </li>
          ))}
        </ul>
      </Part>

      <Part id="trouble" title={p.trouble.title}>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b [&>*]:pb-3 [&>*]:font-medium">
              <th scope="col" className="w-2/5 pr-6">
                {p.trouble.see}
              </th>
              <th scope="col">{p.trouble.do}</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(p.trouble.rows).map(([key, row]) => (
              <tr key={key} className="border-b align-top [&>*]:py-3">
                <th
                  scope="row"
                  className="pr-6 font-normal text-muted-foreground"
                >
                  {row.see}
                </th>
                <td className="text-pretty text-foreground/70">{row.do}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <a
          href={`${REPO}/issues/new/choose`}
          className="mt-6 inline-block underline decoration-foreground/25 underline-offset-[3px] transition-colors hover:decoration-foreground/60"
        >
          {p.trouble.issue}
        </a>
      </Part>

      <Part id="news" title={p.news.title}>
        <ol>
          {RELEASES.map(([version, date, key]) => (
            <li
              key={version}
              className="grid gap-x-6 gap-y-1 border-b py-4 first:pt-0 sm:grid-cols-[7rem_minmax(0,1fr)]"
            >
              <p className="flex gap-3 font-mono text-sm sm:flex-col sm:gap-1">
                <a
                  href={`${REPO}/releases/tag/v${version}`}
                  className="self-start underline decoration-foreground/25 underline-offset-[3px] transition-colors hover:decoration-foreground/60"
                >
                  {version}
                </a>
                <time dateTime={date} className="text-muted-foreground">
                  {date}
                </time>
              </p>
              <p className="text-pretty text-foreground/70">
                {p.news.releases[key]}
              </p>
            </li>
          ))}
        </ol>
        <a
          href={`${REPO}/releases`}
          className="mt-6 inline-block underline decoration-foreground/25 underline-offset-[3px] transition-colors hover:decoration-foreground/60"
        >
          {p.news.all}
        </a>
      </Part>
    </Line>
  );
}
