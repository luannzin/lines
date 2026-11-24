import { DownloadIcon } from "lucide-react";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { getLocale, intlConfig, type Locale, t } from "@/i18n/generated";
import { changeLocale } from "@/lib/locale";
import { InstallLine } from "./install-line";
import { NightField } from "./night-field";
import { PixelName } from "./pixel-name";

// The page every line shares: the night field with the line's mark, name and
// download, its live piece in the same field, the line's own sections on the
// ground below, every file, and the footer. A line brings only its words,
// its mark and its live piece.

export type System = "windows" | "mac" | "linux";
export type File = {
  system: System;
  /** The system and versions, as the README's install table names them. */
  label: string;
  /** The release asset's exact name. */
  name: string;
  how: string;
  /** What the system says the first time, and how to get past it. */
  first?: string;
  /** A line to paste in a terminal instead, which the system doesn't stop: what it does, and the line. */
  line?: { text: string; command: string };
};

/** The system a request comes from, read from its client hints and agent. */
async function detect(): Promise<System | "phone"> {
  const h = await headers();
  const hint = h.get("sec-ch-ua-platform")?.replaceAll('"', "") ?? "";
  const agent = h.get("user-agent") ?? "";
  if (/Android|iOS/.test(hint) || /Android|iPhone|iPad|iPod|Mobile/.test(agent))
    return "phone";
  if (hint === "macOS" || /Macintosh|Mac OS X/.test(agent)) return "mac";
  if (hint === "Linux" || (/Linux|X11/.test(agent) && !/CrOS/.test(agent)))
    return "linux";
  return "windows";
}

const SYSTEM_NAMES: Record<System, string> = {
  windows: "Windows",
  mac: "macOS",
  linux: "Linux",
};

export async function Line({
  name,
  repo,
  mark,
  line,
  lead,
  phone,
  files,
  updates,
  command = false,
  steps,
  live,
  children,
}: {
  name: string;
  repo: string;
  mark: string;
  line: string;
  lead: string;
  phone: string;
  /** In the order the README's install table lists them; the first of each system is its default. */
  files: File[];
  updates: string;
  /** A command-line app: the hero offers the visitor's install line instead of a download. */
  command?: boolean;
  steps: ReactNode;
  live: ReactNode;
  children: ReactNode;
}) {
  const l = t.components.line;
  const system = await detect();
  const yours =
    system === "phone" ? null : files.find((f) => f.system === system);
  const url = (file: File) =>
    `https://github.com/${repo}/releases/latest/download/${file.name}`;

  return (
    <>
      <main className="flex-1">
        <section className="relative isolate overflow-hidden">
          {/* the night, short of the section's last 10rem: NightField
              dithers it out onto the ground there */}
          <div className="absolute inset-x-0 top-0 bottom-40 -z-10 bg-night" />
          <NightField />
          <div className="relative mx-auto max-w-6xl px-6 pt-14 pb-44 sm:pt-20 lg:px-10">
            <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_auto]">
              <div data-calm className="flex max-w-xl flex-col">
                <h1 className="text-[42px] leading-none sm:text-[56px]">
                  <span className="sr-only">{name}</span>
                  <PixelName name={name} />
                </h1>
                <p className="mt-8 text-balance font-medium text-lg sm:text-xl">
                  {line}
                </p>
                <p className="mt-3 text-pretty text-foreground/70">{lead}</p>

                {yours ? (
                  <div className="mt-10 flex flex-col items-start gap-3">
                    {!command && (
                      <>
                        <Button
                          size="xl"
                          render={
                            // biome-ignore lint/a11y/useAnchorContent: the button's children fill it
                            <a href={url(yours)} />
                          }
                        >
                          <DownloadIcon aria-hidden="true" strokeWidth={1.5} />
                          {l.downloadFor({
                            system: SYSTEM_NAMES[yours.system],
                          })}
                        </Button>
                        <p className="text-muted-foreground">
                          <span className="font-mono text-foreground text-sm">
                            {yours.name}
                          </span>{" "}
                          · {yours.label}
                        </p>
                      </>
                    )}
                    {yours.first && (
                      <p className="max-w-md text-pretty text-foreground/70">
                        {yours.first}
                      </p>
                    )}
                    {yours.line && (
                      <div className="flex w-full flex-col gap-2">
                        <p className="max-w-md text-pretty text-foreground/70">
                          {yours.line.text}
                        </p>
                        <InstallLine
                          command={yours.line.command}
                          copy={l.copy}
                          copied={l.copied}
                        />
                      </div>
                    )}
                    <a
                      href="#files"
                      className="text-foreground underline decoration-foreground/25 underline-offset-[3px] transition-colors hover:decoration-foreground/60"
                    >
                      {l.otherSystems}
                    </a>
                  </div>
                ) : (
                  <p className="mt-10 max-w-md text-pretty">
                    {phone}{" "}
                    <a
                      href="#files"
                      className="underline decoration-foreground/25 underline-offset-[3px]"
                    >
                      {l.files.title}
                    </a>
                  </p>
                )}

                <div className="mt-8">{steps}</div>
              </div>

              <div
                data-glow
                className="order-first size-24 lg:order-none lg:size-64"
              >
                {/* biome-ignore lint/performance/noImgElement: 32px pixel art, scaled by whole pixels */}
                <img
                  src={mark}
                  alt=""
                  width={32}
                  height={32}
                  className="size-full [image-rendering:pixelated]"
                />
              </div>
            </div>

            <div className="mt-14 sm:mt-16">{live}</div>
          </div>
        </section>

        <div className="mx-auto flex max-w-6xl flex-col gap-28 px-6 pt-16 pb-28 sm:gap-36 sm:pt-20 sm:pb-36 lg:px-10">
          {children}

          <Part id="files" title={l.files.title}>
            <table className="w-full text-left tabular-nums">
              <thead className="sr-only">
                <tr>
                  <th scope="col">{l.files.system}</th>
                  <th scope="col">{l.files.file}</th>
                  <th scope="col">{l.files.how}</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr
                    key={file.name}
                    className="border-b align-top last:border-0 [&>*]:py-4"
                  >
                    <th scope="row" className="pr-6 font-medium">
                      {file.label}
                      {file === yours && (
                        <span className="block font-normal text-muted-foreground">
                          {l.files.yours}
                        </span>
                      )}
                    </th>
                    <td className="flex flex-col gap-1">
                      <a
                        href={url(file)}
                        className="self-start font-mono text-sm underline decoration-foreground/25 underline-offset-[3px] transition-colors hover:decoration-foreground/60"
                      >
                        {file.name}
                      </a>
                      <span className="text-pretty text-muted-foreground">
                        {file.how}
                      </span>
                      {file.line && (
                        <div className="mt-2 flex flex-col gap-2">
                          <span className="text-pretty text-muted-foreground">
                            {file.line.text}
                          </span>
                          <InstallLine
                            command={file.line.command}
                            copy={l.copy}
                            copied={l.copied}
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-6 max-w-prose text-pretty text-foreground/70">
              {updates}
            </p>
          </Part>
        </div>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-4 px-6 py-8 lg:px-10">
          {/* biome-ignore lint/performance/noImgElement: 32px pixel art */}
          <img
            src={mark}
            alt=""
            width={32}
            height={32}
            className="size-8 [image-rendering:pixelated]"
          />
          <a
            href={`https://github.com/${repo}`}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {l.footer.source}
          </a>
          <a
            href="https://www.luannzin.com"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {l.footer.by}
          </a>
          <Languages />
        </div>
      </footer>
    </>
  );
}

/** One of a line's sections: its title beside it on wide screens, above it on narrow ones. */
export function Part({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={id ? `${id}-title` : undefined}
      className="grid scroll-mt-12 gap-x-16 gap-y-6 lg:grid-cols-[14rem_minmax(0,1fr)]"
    >
      <h2 id={id ? `${id}-title` : undefined} className="font-medium">
        {title}
      </h2>
      <div className="min-w-0 max-w-3xl">{children}</div>
    </section>
  );
}

const NAMES: Record<Locale, string> = { en: "English", pt: "Português" };

/** The language, switched by a Server Action that sets the cookie. */
function Languages() {
  return (
    <nav
      aria-label={t.components.line.footer.language}
      className="ml-auto flex gap-4"
    >
      {intlConfig.locales.map((locale) => (
        <form key={locale} action={changeLocale.bind(null, locale)}>
          <button
            type="submit"
            lang={locale}
            className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground aria-[current=true]:text-foreground"
            aria-current={locale === getLocale()}
          >
            {NAMES[locale]}
          </button>
        </form>
      ))}
    </nav>
  );
}
