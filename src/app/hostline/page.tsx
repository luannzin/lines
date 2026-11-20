import type { Metadata } from "next";
import { getLocale, setLocale, t } from "@/i18n/generated";
import { Shell } from "./shell/shell";

export async function generateMetadata(): Promise<Metadata> {
  await setLocale();
  const m = t.app.hostline.meta;
  return {
    title: m.title,
    description: m.description,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      url: "/",
      siteName: "Hostline",
      locale: m.ogLocale,
      title: m.title,
      description: m.description,
    },
    twitter: { card: "summary_large_image", creator: "@__luannzin" },
  };
}

// Every path on hostline.luannzin.com lands here (src/proxy.ts): without a link after the `#`
// it's Hostline's page, with one it's the shared app at that path.
export default async function Hostline() {
  await setLocale();
  const p = t.app.hostline;
  return (
    <>
      <main className="mx-auto w-full max-w-5xl px-6 py-24">
        <h1 className="font-medium">Hostline</h1>
        <p className="mt-2 text-foreground/70">{p.hero.line}</p>
      </main>
      <Shell locale={getLocale()} />
    </>
  );
}
