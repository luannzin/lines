import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { lineOf, origin } from "@/lib/lines";

// One robots.txt per host: every crawler is welcome on a line's subdomain,
// AI ones included (llms.txt is there for them); the deployment's own
// addresses only repeat the subdomains' pages, so nothing there is crawled.
export default async function robots(): Promise<MetadataRoute.Robots> {
  const line = lineOf((await headers()).get("host"));
  if (!line) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${origin(line)}/sitemap.xml`,
  };
}
