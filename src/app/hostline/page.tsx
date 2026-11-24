import type { Metadata } from "next";
import { Line, Part } from "@/components/line/line";
import { getLocale, setLocale, t } from "@/i18n/generated";
import { lineMetadata } from "@/lib/seo";
import { about } from "./about";
import { Demo } from "./demo/demo";
import { LINK } from "./shell/link";
import { Shell } from "./shell/shell";

export async function generateMetadata(): Promise<Metadata> {
  return lineMetadata(about, await setLocale(), t.app.hostline.meta);
}

// Every path on hostline.luannzin.com lands here (src/proxy.ts): without a link after the `#`
// it's Hostline's page, with one it's the shared app at that path.
export default async function Hostline() {
  await setLocale();
  const p = t.app.hostline;
  const f = p.files;

  return (
    <>
      {/* Runs as the page parses: with a link in the address, the page about Hostline never
          shows, not even before the shell starts */}
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: a constant, no input in it
        dangerouslySetInnerHTML={{
          __html: `if(/${LINK.source}/.test(location.hash))document.documentElement.dataset.link=""`,
        }}
      />
      <div className="flex flex-1 flex-col [html[data-link]_&]:hidden">
        <Line
          about={about}
          mark="/hostline/mark.png"
          line={p.hero.line}
          lead={p.hero.lead}
          phone={p.hero.phone}
          updates={f.updates}
          command
          steps={
            <>
              <p className="font-medium">{p.hero.use}</p>
              <ol className="mt-3 flex list-decimal flex-col gap-2 ps-5 text-foreground/70 marker:font-mono marker:text-muted-foreground">
                <li>{p.hero.steps.start}</li>
                <li>
                  {p.hero.steps.run}{" "}
                  <code className="whitespace-nowrap font-mono text-foreground text-sm">
                    hostline 3000
                  </code>
                </li>
                <li>{p.hero.steps.send}</li>
              </ol>
              <p className="mt-4 text-pretty text-foreground/70">
                {p.hero.npx}{" "}
                <code className="whitespace-nowrap font-mono text-foreground text-sm">
                  npx hostline 3000
                </code>
              </p>
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
          <Part title={p.see.title}>
            <Terms rows={p.see.rows} />
          </Part>

          <Part title={p.use.title}>
            <Rows rows={p.use.rows} />
          </Part>

          <Part title={p.inside.title}>
            <Terms rows={p.inside.rows} />
          </Part>

          <Part title={p.safe.title}>
            <Rows rows={p.safe.rows} />
          </Part>

          <Part title={p.limits.title}>
            <Rows rows={p.limits.rows} />
          </Part>
        </Line>
      </div>
      <Shell locale={getLocale()} />
    </>
  );
}

/** A term with its explanation under it, two to a row on wide screens. */
function Terms({
  rows,
}: {
  rows: Record<string, { term: string; text: string }>;
}) {
  return (
    <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
      {Object.entries(rows).map(([key, row]) => (
        <div key={key} className="flex flex-col gap-1.5">
          <dt className="font-medium">{row.term}</dt>
          <dd className="text-pretty text-foreground/70">{row.text}</dd>
        </div>
      ))}
    </dl>
  );
}

/** One plain sentence or two per item. */
function Rows({ rows }: { rows: Record<string, string> }) {
  return (
    <ul className="flex flex-col gap-5">
      {Object.entries(rows).map(([key, text]) => (
        <li key={key} className="max-w-prose text-pretty text-foreground/70">
          {text}
        </li>
      ))}
    </ul>
  );
}
