"use client";

import { useEffect, useRef, useState } from "react";
import { type Locale, translations } from "@/i18n/generated";
import { parseLink } from "./link";
import { connect, type Head, type SocketSink, type Tunnel } from "./tunnel";

type State =
  | { k: "opening" }
  | { k: "waiting" }
  | { k: "live"; name: string; ends?: number }
  | { k: "lost"; name: string; ends?: number }
  | { k: "ended" }
  | { k: "unsupported" };

declare global {
  interface Window {
    /** What the frame's helper (public/__hostline/inject.js) calls on this page. */
    __hostline?: {
      socket: Tunnel["socket"];
      at(path: string): void;
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

/**
 * The page a Hostline link opens. Renders nothing without a link in the address; with one, it
 * covers the page, reaches the host's machine, and shows the shared app in a frame.
 */
export function Shell({ locale }: { locale: Locale }) {
  const s = translations[locale].app.hostline.shell;
  const [state, setState] = useState<State | null>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [, tick] = useState(0);

  useEffect(() => {
    const link = parseLink(location.hash);
    if (!link) return;
    if (!("serviceWorker" in navigator)) {
      setState({ k: "unsupported" });
      return;
    }
    setState({ k: "opening" });
    const sw = navigator.serviceWorker;
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
      const { name, ends } = next.answer;
      next.onBye = () => {
        over = true;
        sw.controller?.postMessage({ k: "idle" });
        next.close();
        setState({ k: "ended" });
      };
      next.onLost = () => {
        if (over || tunnel !== next) return;
        tunnel = null;
        sw.controller?.postMessage({ k: "idle" });
        setState({ k: "lost", name, ends });
        void open();
      };
      // the service worker sends frames it can't place to the newest open line
      sw.controller?.postMessage({ k: "live" });
      setState({ k: "live", name, ends });
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

  // the countdown in the pill
  const ends = state && "ends" in state ? state.ends : undefined;
  useEffect(() => {
    if (!ends) return;
    const timer = setInterval(() => tick((n) => n + 1), 30_000);
    return () => clearInterval(timer);
  }, [ends]);

  if (!state) return null;
  const app = state.k === "live" || state.k === "lost";

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* in the page from the start, so the line can load it the moment it's up */}
      <iframe
        ref={frame}
        title={app ? state.name : ""}
        hidden={!app}
        className="size-full border-0 bg-white"
        allow="camera; microphone; geolocation; clipboard-read; clipboard-write; fullscreen; display-capture; screen-wake-lock"
      />
      {app ? (
        <output className="pointer-events-none fixed bottom-3 left-3 rounded-full bg-black/80 px-3 py-1.5 font-mono text-white text-xs backdrop-blur">
          {state.k === "live" ? s.live : s.reconnecting} · {state.name}
          {state.ends && ` · ${s.ends} ${relative(state.ends, locale)}`}
        </output>
      ) : (
        <div className="flex size-full flex-col items-center justify-center gap-3 px-6 text-center">
          <p className="font-medium">
            {state.k === "opening"
              ? s.opening
              : state.k === "waiting"
                ? s.waiting
                : state.k === "ended"
                  ? s.ended
                  : s.unsupported}
          </p>
          <p className="max-w-md text-pretty text-muted-foreground">
            {state.k === "opening"
              ? s.notice
              : state.k === "waiting"
                ? s.waitingText
                : state.k === "ended"
                  ? s.endedText
                  : null}
          </p>
        </div>
      )}
    </div>
  );
}

function relative(ends: number, locale: Locale) {
  const minutes = Math.max(1, Math.round((ends - Date.now()) / 60_000));
  const rtf = new Intl.RelativeTimeFormat(locale, { style: "short" });
  return minutes >= 120
    ? rtf.format(Math.round(minutes / 60), "hour")
    : rtf.format(minutes, "minute");
}
