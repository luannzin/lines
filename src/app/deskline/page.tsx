import type { Metadata } from "next";
import { type File, Line, Part } from "@/components/line/line";
import { getLocale, setLocale, t } from "@/i18n/generated";
import { Demo } from "./demo/demo";

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
    </Line>
  );
}
