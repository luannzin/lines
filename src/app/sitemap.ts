import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { lineOf, origin } from "@/lib/lines";

// One sitemap per host: a line's page in English and at /pt, each naming the
// other (hreflang).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const line = lineOf((await headers()).get("host"));
  if (!line) return [];
  const languages = { en: origin(line), pt: `${origin(line)}/pt` };
  return Object.values(languages).map((url) => ({
    url,
    alternates: { languages },
  }));
}
