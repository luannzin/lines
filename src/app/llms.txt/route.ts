import { headers } from "next/headers";
import { about as deskline } from "@/app/deskline/about";
import { about as hostline } from "@/app/hostline/about";
import { lineOf } from "@/lib/lines";
import { llms } from "@/lib/seo";

const abouts = { deskline, hostline };

// A line for agents, at its subdomain's /llms.txt: text/plain, since some
// fetchers refuse text/markdown, pointing at its page as the copy to index.
export async function GET() {
  const line = lineOf((await headers()).get("host"));
  if (!line) return new Response("Not found", { status: 404 });
  return new Response(llms(abouts[line]), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      Link: `<https://${line}.luannzin.com/>; rel="canonical"`,
    },
  });
}
