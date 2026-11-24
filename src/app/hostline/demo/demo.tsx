"use client";

import { useEffect, useRef, useState } from "react";
import { Window } from "@/components/line/window";
import { Button } from "@/components/ui/button";
import { type Locale, translations } from "@/i18n/generated";
import { who } from "../shell/link";
import { gathered, Tunnel } from "../shell/tunnel";
import { serve } from "./host";

// Hostline in one page, for real: an editor stands in for the port you share, and a phone opens
// the link. They connect over a real WebRTC data channel; the phone's end is the shell's own
// Tunnel (shell/tunnel.ts) and the computer's end answers frame for frame the way the CLI does
// (host.ts). Meeting on the Nostr relays is the one step left out: the offer and answer are
// handed across in memory.

const PAGE = `<!doctype html>
<meta name="viewport" content="width=device-width">
<style>
  body { font: 17px/1.5 system-ui; margin: 0; padding: 28px; color: #18181b; }
  h1 { font-size: 26px; margin: 0 0 8px; }
</style>
<h1>My app</h1>
<p>Edit this file. Each change reaches the phone over the line.</p>
`;

const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
/** A link in Hostline's shape (shell/link.ts), made up for the demo: it opens nothing. */
function newLink() {
  const pick = (chars: string, n: number) =>
    Array.from(
      crypto.getRandomValues(new Uint8Array(n)),
      (b) => chars[b % chars.length],
    ).join("");
  return `https://hostline.luannzin.com/#${pick(BASE62, 22)}~${pick("0123456789abcdef", 22)}`;
}

/** Asks for `/` over the line, as the visitor's page does, and hands over the page. */
function load(tunnel: Tunnel, onPage: (doc: string) => void) {
  const chunks: Uint8Array<ArrayBuffer>[] = [];
  tunnel.request({ m: "GET", u: "/", h: [] }, null, {
    head: () => {},
    body: (chunk) => chunks.push(chunk as Uint8Array<ArrayBuffer>),
    end: () => void new Blob(chunks).text().then(onPage),
    fail: () => {},
  });
}

type Phone =
  | { k: "idle" }
  | { k: "opening" }
  | { k: "live"; doc: string }
  | { k: "ended" };

export function Demo({ locale }: { locale: Locale }) {
  const d = translations[locale].app.hostline.demo;
  const s = translations[locale].app.hostline.shell;
  const [code, setCode] = useState(PAGE);
  const [link, setLink] = useState<string | null>(null);
  const [terminal, setTerminal] = useState<string[]>([]);
  const [phone, setPhone] = useState<Phone>({ k: "idle" });
  const [served, setServed] = useState<number | null>(null);
  // what the computer serves: the editor's text
  const page = useRef(PAGE);
  const line = useRef<{ tunnel: Tunnel; host: RTCPeerConnection } | null>(null);
  const bye = useRef<(() => void) | null>(null);
  // one per run of Hostline, so a phone still opening an old link gives up
  const run = useRef(0);

  const print = (...lines: string[]) => setTerminal((t) => [...t, ...lines]);

  // each save reaches the open page, the way a dev server's reload does
  useEffect(() => {
    page.current = code;
    const timer = setTimeout(() => {
      if (line.current)
        load(line.current.tunnel, (doc) => setPhone({ k: "live", doc }));
    }, 150);
    return () => clearTimeout(timer);
  }, [code]);

  const close = () => {
    line.current?.tunnel.close();
    line.current?.host.close();
    line.current = null;
    bye.current = null;
  };
  // leaving the page hangs up
  useEffect(
    () => () => {
      line.current?.tunnel.close();
      line.current?.host.close();
    },
    [],
  );

  const share = () => {
    run.current++;
    const next = newLink();
    setLink(next);
    setPhone({ k: "idle" });
    setServed(null);
    print(
      "$ hostline 3000",
      "",
      "  hostline  sharing 127.0.0.1:3000",
      "",
      `  ${next}`,
      "  copied · scan it to open on your phone",
      "",
      "  The link ends when you stop hostline (Ctrl+C).",
    );
  };

  const stop = () => {
    run.current++;
    if (bye.current) bye.current();
    else setPhone((p) => (p.k === "opening" ? { k: "ended" } : p));
    setLink(null);
    print("^C", "");
  };

  const open = async () => {
    const mine = run.current;
    setPhone({ k: "opening" });
    const visitor = new RTCPeerConnection();
    const host = new RTCPeerConnection();
    const dc = visitor.createDataChannel("hostline", { ordered: true });
    host.ondatachannel = ({ channel }) => {
      bye.current = serve(channel, () => page.current, setServed).bye;
    };
    await visitor.setLocalDescription();
    await gathered(visitor, 3000);
    if (visitor.localDescription)
      await host.setRemoteDescription(visitor.localDescription);
    await host.setLocalDescription();
    await gathered(host, 3000);
    if (host.localDescription)
      await visitor.setRemoteDescription(host.localDescription);
    if (dc.readyState !== "open")
      await new Promise((r) => dc.addEventListener("open", r, { once: true }));
    if (mine !== run.current) {
      visitor.close();
      host.close();
      return;
    }
    const tunnel = new Tunnel(visitor, dc, {
      t: "answer",
      to: "",
      sdp: "",
      name: "demo",
    });
    tunnel.onBye = () => {
      close();
      setPhone({ k: "ended" });
    };
    line.current = { tunnel, host };
    print(`  ● ${who(navigator.userAgent)} opened the link`);
    load(tunnel, (doc) => setPhone({ k: "live", doc }));
  };

  return (
    <div className="grid gap-x-10 gap-y-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <Window label={d.you}>
        <div className="border-b px-4 py-2.5 font-mono text-sm">index.html</div>
        <textarea
          aria-label="index.html"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="h-64 resize-none bg-transparent px-4 py-3 font-mono text-[13px] text-foreground/80 leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
        />
        <div className="flex flex-col gap-3 border-t bg-tile px-4 py-3">
          <pre
            aria-live="polite"
            className="min-h-20 overflow-x-auto whitespace-pre font-mono text-[13px] text-foreground/70 leading-relaxed"
          >
            {terminal.join("\n") || "$ hostline 3000"}
          </pre>
          <div>
            {link ? (
              <Button variant="outline" onClick={stop}>
                {d.stop}
              </Button>
            ) : (
              <Button onClick={share}>{d.run}</Button>
            )}
          </div>
        </div>
      </Window>

      <Window label={d.phone}>
        <div className="mx-auto my-5 flex aspect-[9/17] w-full max-w-64 flex-col overflow-hidden rounded-[28px] bg-black p-2 shadow-[inset_0_0_0_1px_var(--border)]">
          <div className="relative flex flex-1 flex-col overflow-hidden rounded-[20px] bg-background">
            {phone.k === "live" ? (
              <iframe
                title={d.app}
                srcDoc={phone.doc}
                sandbox="allow-scripts"
                className="size-full flex-1 bg-white"
              />
            ) : (
              <div className="flex flex-1 flex-col justify-center gap-3 p-5">
                {phone.k === "idle" &&
                  (link ? (
                    <Button onClick={open}>{d.open}</Button>
                  ) : (
                    <p className="text-pretty text-muted-foreground">
                      {d.first}
                    </p>
                  ))}
                {phone.k === "opening" && (
                  <p className="font-medium">{s.opening}</p>
                )}
                {phone.k === "ended" && (
                  <>
                    <p className="font-medium">{s.ended}</p>
                    <p className="text-pretty text-foreground/70">
                      {s.endedText}
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <p
          aria-hidden="true"
          className="mb-4 h-5 text-center font-mono text-muted-foreground text-sm tabular-nums"
        >
          {served !== null && `GET / 200 · ${served} bytes`}
        </p>
      </Window>
    </div>
  );
}
