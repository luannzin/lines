import { type NextRequest, NextResponse } from "next/server";
import { lines } from "@/lib/lines";

// One app, one subdomain per line: deskline.luannzin.com/x is served from
// /deskline/x. Other hosts (the Vercel address, localhost) see the paths as
// they are, so /deskline works there too.
//
// Hostline's subdomain is also every shared link, and there the path belongs
// to the app being shared: every path shows the one page, which reads the
// path itself.
export function proxy(request: NextRequest) {
  const sub = request.headers.get("host")?.split(".")[0];
  if (!sub || !(lines as readonly string[]).includes(sub)) return;
  const url = request.nextUrl.clone();
  if (url.pathname === `/${sub}` || url.pathname.startsWith(`/${sub}/`)) return;
  url.pathname =
    sub === "hostline"
      ? "/hostline"
      : `/${sub}${url.pathname === "/" ? "" : url.pathname}`;
  return NextResponse.rewrite(url);
}

// Pages only: Next's own files, Vercel's (/_vercel: the page view counter)
// and anything with an extension (icons, images, fonts) are served as they
// are. /install.sh is the exception: a line's one-line installer, kept in
// public/<line>/. On Hostline's subdomain a shared app's paths can have
// extensions too (/about.html), so there only Next's and Vercel's files, the
// service worker and the frame's helper pass.
export const config = {
  matcher: [
    "/((?!_next/|_vercel/|.*\\..*).*)",
    "/install.sh",
    {
      source: "/((?!_next/|_vercel/|hostline-sw\\.js|__hostline/).*\\..*)",
      has: [{ type: "host", value: "hostline\\..*" }],
    },
  ],
};
