import { type NextRequest, NextResponse } from "next/server";
import { lineOf } from "@/lib/lines";

// One app, one subdomain per line: deskline.luannzin.com/x is served from
// /deskline/x. Other hosts (the Vercel address, localhost) see the paths as
// they are, so /deskline works there too.
//
// Hostline's subdomain is also every shared link, and there the path belongs
// to the app being shared: every path shows the one page, which reads the
// path itself.
//
// Each line's page is also at /pt, in Portuguese, so search engines can index
// both languages (they send no locale cookie and read pages in English): it's
// served as the page, with the locale cookie set to pt on the request, so the
// page renders in it, and on the response. The page points at both (hreflang,
// src/lib/seo.tsx).
export function proxy(request: NextRequest) {
  const sub = lineOf(request.headers.get("host"));
  if (!sub) return;
  const url = request.nextUrl.clone();
  if (url.pathname === `/${sub}` || url.pathname.startsWith(`/${sub}/`)) return;
  const pt = url.pathname === "/pt";
  url.pathname =
    sub === "hostline" && !INSTALLERS.includes(url.pathname)
      ? "/hostline"
      : `/${sub}${url.pathname === "/" || pt ? "" : url.pathname}`;
  if (!pt) return NextResponse.rewrite(url);
  request.cookies.set("locale", "pt");
  const response = NextResponse.rewrite(url, {
    request: { headers: request.headers },
  });
  // better-intl's own cookie: same name, path and lifetime (updateLocale)
  response.cookies.set("locale", "pt", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

// A line's one-line installers, kept in public/<line>/. On Hostline's subdomain they're the
// only paths that aren't the shared app's.
const INSTALLERS = ["/install.sh", "/install.ps1"];

// Pages only: Next's own files, Vercel's (/_vercel: the page view counter)
// and anything with an extension (icons, images, fonts, robots.txt, the
// sitemap, llms.txt) are served as they are. The installers are the exception
// (INSTALLERS). On Hostline's subdomain a shared app's paths can have
// extensions too (/about.html), so there only Next's and Vercel's files, the
// service worker, the frame's helper and the files for crawlers pass.
export const config = {
  matcher: [
    "/((?!_next/|_vercel/|.*\\..*).*)",
    "/install.sh",
    "/install.ps1",
    {
      source:
        "/((?!_next/|_vercel/|hostline-sw\\.js|__hostline/|robots\\.txt|sitemap\\.xml|llms\\.txt).*\\..*)",
      has: [{ type: "host", value: "hostline\\..*" }],
    },
  ],
};
