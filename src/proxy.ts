import { type NextRequest, NextResponse } from "next/server";
import { lines } from "@/lib/lines";

// One app, one subdomain per line: deskline.luannzin.com/x is served from
// /deskline/x. Other hosts (the Vercel address, localhost) see the paths as
// they are, so /deskline works there too.
export function proxy(request: NextRequest) {
  const sub = request.headers.get("host")?.split(".")[0];
  if (!sub || !(lines as readonly string[]).includes(sub)) return;
  const url = request.nextUrl.clone();
  if (url.pathname === `/${sub}` || url.pathname.startsWith(`/${sub}/`)) return;
  url.pathname = `/${sub}${url.pathname === "/" ? "" : url.pathname}`;
  return NextResponse.rewrite(url);
}

// Pages only: Next's own files and anything with an extension (icons,
// images, fonts) are served as they are.
export const config = {
  matcher: ["/((?!_next/|.*\\..*).*)"],
};
