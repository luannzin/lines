"use client";

import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import { NightField } from "@/components/line/night-field";
import { type Locale, translations } from "@/i18n/generated";
import { bayer, DUSK } from "@/lib/dusk";
import { cn } from "@/lib/utils";
import { parseLink } from "./link";
import { connect, type Head, type SocketSink, type Tunnel } from "./tunnel";

type State =
  | { k: "opening" }
  | { k: "waiting" }
  | { k: "loading"; name: string }
  | { k: "live"; name: string }
  | { k: "lost"; name: string }
  | { k: "ended" }
  | { k: "unsupported" };

declare global {
  interface Window {
    /** What the frame's helper (public/__hostline/inject.js) calls on this page. */
    __hostline?: {
      socket: Tunnel["socket"];
      at(path: string): void;
      ready(): void;
    };
  }
}

/** A request from the service worker, to carry over the line. */
type Ask =
  | {
      k: "req";
      id: number;
      m: string;
      u: string;
      h: [string, string][];
      r: string;
      b: ArrayBuffer | null;
    }
  | { k: "cancel"; id: number };

/** How long the globe stays gold at least before the app shows, in ms. */
const LIT = 450;

/**
 * The page a Hostline link opens. Renders nothing without a link in the address; with one, it
 * covers the page, reaches the host's machine, and shows the shared app in a frame.
 */
export function Shell({ locale }: { locale: Locale }) {
  const s = translations[locale].app.hostline.shell;
  const [state, setState] = useState<State | null>(null);
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const link = parseLink(location.hash);
    if (!link) return;
    if (!("serviceWorker" in navigator)) {
      setState({ k: "unsupported" });
      return;
    }
    setState({ k: "opening" });
    const sw = navigator.serviceWorker;
    const home = document.title;
    let tunnel: Tunnel | null = null;
    let over = false;
    // the service worker's request id, to the line's
    const ids = new Map<number, number>();

    const onAsk = (e: MessageEvent<Ask>) => {
      const ask = e.data;
      const reply = e.source as ServiceWorker;
      if (ask.k === "cancel") {
        const id = ids.get(ask.id);
        if (id) tunnel?.cancel(id);
        return;
      }
      if (!tunnel) {
        reply.postMessage({ k: "err", id: ask.id, e: "not connected" });
        return;
      }
      const h = ask.h;
      if (ask.r) h.push(["referer", ask.r]);
      const id = tunnel.request({ m: ask.m, u: ask.u, h }, ask.b, {
        head: (head: Head) =>
          reply.postMessage({ k: "res", id: ask.id, ...head }),
        body: (c) =>
          reply.postMessage({ k: "body", id: ask.id, c }, [c.buffer]),
        end: () => {
          ids.delete(ask.id);
          reply.postMessage({ k: "end", id: ask.id });
        },
        fail: (reason) => {
          ids.delete(ask.id);
          reply.postMessage({ k: "err", id: ask.id, e: reason });
        },
      });
      ids.set(ask.id, id);
    };

    const claim = (url: string) =>
      sw.controller?.postMessage({ k: "claim", url });

    // the app's first page is in: the night gives way to it, once the globe has been gold long
    // enough to be seen turning
    let litAt = 0;
    const ready = () => {
      const wait = litAt + LIT - performance.now();
      if (wait > 0) return void setTimeout(ready, wait);
      setState((now) =>
        now?.k === "loading" ? { k: "live", name: now.name } : now,
      );
    };

    const show = () => {
      const iframe = frame.current;
      if (!iframe || iframe.src) return;
      // Navigations inside the frame are claimed before they start, so the service worker
      // sends each one down this page's line.
      iframe.addEventListener("load", () => {
        const win = iframe.contentWindow as
          | (Window & { navigation?: EventTarget })
          | null;
        win?.navigation?.addEventListener("navigate", (e) => {
          const url = (e as Event & { destination?: { url?: string } })
            .destination?.url;
          if (url) claim(url);
        });
        const title = iframe.contentDocument?.title;
        if (title) document.title = title;
        // a response with no page in it (an image, JSON) never runs the frame's helper
        ready();
      });
      const path = location.pathname + location.search;
      claim(new URL(path, location.origin).href);
      iframe.src = path;
    };

    const open = async () => {
      const next = await connect(link, () => {
        if (!over) setState({ k: "waiting" });
      });
      if (over) return next.close();
      tunnel = next;
      const { name } = next.answer;
      next.onBye = () => {
        over = true;
        sw.controller?.postMessage({ k: "idle" });
        next.close();
        document.title = home;
        setState({ k: "ended" });
      };
      next.onLost = () => {
        if (over || tunnel !== next) return;
        tunnel = null;
        sw.controller?.postMessage({ k: "idle" });
        setState({ k: "lost", name });
        void open();
      };
      // the service worker sends frames it can't place to the newest open line
      sw.controller?.postMessage({ k: "live" });
      // back from a lost line, the app is already there
      if (frame.current?.src) setState({ k: "live", name });
      else {
        litAt = performance.now();
        setState({ k: "loading", name });
      }
      show();
    };

    // another link pasted into this tab: start over with it
    const onHash = () => location.reload();
    addEventListener("hashchange", onHash);

    window.__hostline = {
      socket: (url, protocols, sink: SocketSink) => {
        if (!tunnel) throw new Error("Hostline isn't connected");
        return tunnel.socket(url, protocols, sink);
      },
      at: (path) =>
        history.replaceState(history.state, "", path + location.hash),
      ready,
    };

    void (async () => {
      try {
        await sw.register("/hostline-sw.js", { scope: "/" });
        if (!sw.controller)
          await new Promise((r) =>
            sw.addEventListener("controllerchange", r, { once: true }),
          );
      } catch {
        setState({ k: "unsupported" });
        return;
      }
      if (over) return;
      sw.addEventListener("message", onAsk);
      sw.startMessages();
      await open();
    })();

    return () => {
      over = true;
      sw.controller?.postMessage({ k: "idle" });
      removeEventListener("hashchange", onHash);
      sw.removeEventListener("message", onAsk);
      tunnel?.close();
    };
  }, []);

  // the globe's other states, fetched before they're needed so a change never shows a gap
  preload("/hostline/mark-spin-lit.png", { as: "image" });
  preload("/hostline/mark-out.png", { as: "image" });
  if (!state) return null;
  const app = state.k === "live" || state.k === "lost";
  // the globe: turning in the dusk while the link opens, turning gold once the line is up,
  // still and dim when nobody's there or the link can't open here
  const globe =
    state.k === "opening"
      ? "mark-spin"
      : state.k === "loading" || app
        ? "mark-spin-lit"
        : "mark-out";
  const [title, text] =
    state.k === "waiting"
      ? [s.waiting, s.waitingText]
      : state.k === "ended"
        ? [s.ended, s.endedText]
        : state.k === "unsupported"
          ? [s.unsupported, s.unsupportedText]
          : [s.opening, s.notice];

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* in the page from the start, so the line can load it the moment it's up */}
      <iframe
        ref={frame}
        // out of the tab order while the night covers it
        inert={!app}
        title={"name" in state ? state.name : ""}
        className="size-full border-0 bg-white"
        allow="camera; microphone; geolocation; clipboard-read; clipboard-write; fullscreen; display-capture; screen-wake-lock"
      />
      {/* the night over the app until its first page is in, and again when the link ends */}
      <section
        inert={app}
        className={cn(
          "absolute inset-0 isolate flex items-center justify-center overflow-hidden bg-night px-6 transition-opacity duration-300 ease-out motion-reduce:transition-none",
          app && "pointer-events-none opacity-0",
        )}
      >
        {/* nothing below the screen, so the night runs to the edge; the night's dots run under
            the words, so their calm never reads as a plate */}
        <NightField band={0} under="dots" />
        {/* Phones: the globe over the words. From 1024px, the README banner's composition: the
            words left, the globe right in its glow, far enough apart that the glow fades into
            the words' calm instead of being cut by it */}
        <div className="relative flex flex-col items-center text-center lg:flex-row-reverse lg:gap-40 lg:text-left">
          {/* the turning globe is a strip of 16 frames (hostline's tools/logo.py), stepped
              through with no easing, like the apps' pixel art; still under reduced motion */}
          <div
            data-glow
            aria-hidden="true"
            className={cn(
              "size-24 shrink-0 bg-no-repeat [image-rendering:pixelated] lg:size-64",
              globe === "mark-out"
                ? "bg-[length:100%_100%]"
                : "animate-turn bg-[length:1600%_100%] motion-reduce:animate-none",
            )}
            style={{ backgroundImage: `url(/hostline/${globe}.png)` }}
          />
          {/* on phones, far enough under the globe that its glow ends round before the words */}
          <div data-calm className="mt-24 max-w-md lg:mt-0" aria-live="polite">
            <h1 className="text-balance font-medium">{title}</h1>
            <p className="mt-2 text-pretty text-foreground/70">{text}</p>
          </div>
        </div>
      </section>
      {app && (
        <Status
          live={state.k === "live"}
          word={state.k === "live" ? s.live : s.reconnecting}
        />
      )}
    </div>
  );
}

/**
 * The one control over the shared app: live or reconnecting, in dots and a word. A click folds
 * it to the dots, so it stays out of the app's way. Bottom right, because Next.js puts its dev
 * indicator bottom left, and shared dev servers are what Hostline is for.
 */
function Status({ live, word }: { live: boolean; word: string }) {
  const [open, setOpen] = useState(true);
  return (
    <button
      type="button"
      aria-expanded={open}
      title={open ? undefined : word}
      onClick={() => setOpen(!open)}
      className="absolute right-[max(0.75rem,env(safe-area-inset-right))] bottom-[max(0.75rem,env(safe-area-inset-bottom))] flex h-8 cursor-pointer items-center rounded-full bg-background px-3 font-medium text-sm shadow-[inset_0_0_0_1px_var(--border),0_8px_24px_-8px_rgb(0_0_0/0.6)] after:absolute after:-inset-1.5 after:content-['']"
    >
      <Dots live={live} />
      <span
        aria-live="polite"
        className={cn(
          "grid transition-[grid-template-columns,margin-left] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none",
          open ? "ml-2 grid-cols-[1fr]" : "ml-0 grid-cols-[0fr]",
        )}
      >
        <span className="overflow-hidden whitespace-nowrap">{word}</span>
      </span>
    </button>
  );
}

const CELLS = Array.from({ length: 9 }, (_, i) => ({
  c: i % 3,
  r: Math.floor(i / 3),
}));

/**
 * Nine 2px dots on the field's 3px grid. Live: all of them, gold with ember in Bayer order.
 * Reconnecting: a quarter of them in ember, the lit quarter drifting in Bayer order like a lost
 * link; under reduced motion the same quarter stays put.
 */
function Dots({ live }: { live: boolean }) {
  return (
    <svg
      viewBox="0 0 8 8"
      shapeRendering="crispEdges"
      aria-hidden="true"
      className="size-2 shrink-0"
    >
      {CELLS.map(({ c, r }) => (
        <rect
          key={`${c}${r}`}
          x={c * 3}
          y={r * 3}
          width="2"
          height="2"
          fill={live && bayer(c, r) < 0.6 ? DUSK[3] : DUSK[2]}
          // a dot is there or not, never faded
          opacity={live || bayer(c, r) < 0.25 ? 1 : 0}
          className={
            live ? undefined : "animate-drift motion-reduce:animate-none"
          }
          style={
            live ? undefined : { animationDelay: `${-bayer(c, r) * 1200}ms` }
          }
        />
      ))}
    </svg>
  );
}
