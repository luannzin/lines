// Hostline's service worker. The page that opens a link (the shell) is always the top-level
// document; the shared app runs in a frame inside it. Every request the app makes lands here
// and goes to the shell, which carries it over WebRTC to the host's machine and streams the
// answer back. Requests from the shell itself, and anything on another origin, go to the
// network as usual.

const pending = new Map(); // request id -> { resolve, controller }
const owner = new Map(); // app client id -> shell client id
const claims = []; // { url, shell, at }: a shell saying "the next navigation to url is mine"
const live = []; // shells with an open line, the most recent last
let next = 1;

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("message", (e) => {
  const m = e.data;
  const p = pending.get(m.id);
  switch (m.k) {
    case "live":
    case "idle": {
      const i = live.indexOf(e.source.id);
      if (i >= 0) live.splice(i, 1);
      if (m.k === "live") live.push(e.source.id);
      break;
    }
    case "claim":
      claims.push({ url: m.url, shell: e.source.id, at: Date.now() });
      if (claims.length > 32) claims.shift();
      break;
    case "res":
      p?.resolve(m);
      break;
    case "body":
      p?.controller.enqueue(new Uint8Array(m.c));
      break;
    case "end":
      p?.controller.close();
      pending.delete(m.id);
      break;
    case "err":
      if (p?.started) p.controller.error(new Error(m.e));
      else
        p?.resolve({
          s: 502,
          t: "Bad Gateway",
          h: [["content-type", "text/plain"]],
          e: m.e,
        });
      pending.delete(m.id);
      break;
  }
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (
    url.pathname.startsWith("/__hostline/") ||
    url.pathname === "/hostline-sw.js"
  )
    return;
  // a top-level page is always the shell, served by the site
  if (req.mode === "navigate" && req.destination === "document") return;
  e.respondWith(
    shellFor(e).then((shell) =>
      shell ? forward(req, url, shell) : fetch(req),
    ),
  );
});

async function shellFor(e) {
  if (e.clientId && owner.has(e.clientId)) return owner.get(e.clientId);
  const tops = (await self.clients.matchAll({ type: "window" })).filter(
    (c) => c.frameType === "top-level",
  );
  // the newest shell whose line is open
  const latest = live.findLast((id) => tops.some((t) => t.id === id));
  if (e.request.mode === "navigate") {
    const now = Date.now();
    const i = claims.findLastIndex(
      (c) => c.url === e.request.url && now - c.at < 10_000,
    );
    const shell = i >= 0 ? claims.splice(i, 1)[0].shell : latest;
    if (shell && e.resultingClientId) owner.set(e.resultingClientId, shell);
    return shell;
  }
  if (!e.clientId || tops.some((t) => t.id === e.clientId)) return null; // the shell's own files
  // ponytail: a frame we don't know (a navigation nobody claimed, or this worker restarted)
  // goes to the newest open line; two links open at once in one browser can cross then.
  if (latest) owner.set(e.clientId, latest);
  return latest;
}

async function forward(req, url, shellId) {
  const shell = await self.clients.get(shellId);
  if (!shell)
    return new Response("This link's page was closed.", { status: 502 });
  const id = next++;
  const body =
    req.method === "GET" || req.method === "HEAD"
      ? null
      : await req.arrayBuffer();
  let controller;
  const stream = new ReadableStream({
    start: (c) => {
      controller = c;
    },
    cancel: () => {
      pending.delete(id);
      shell.postMessage({ k: "cancel", id });
    },
  });
  const head = await new Promise((resolve) => {
    pending.set(id, { resolve, controller });
    shell.postMessage(
      {
        k: "req",
        id,
        m: req.method,
        u: url.pathname + url.search,
        h: [...req.headers],
        r: req.referrer,
        b: body,
      },
      body ? [body] : [],
    );
  });
  if (head.e)
    return new Response(
      `Hostline couldn't reach the shared port: ${head.e}`,
      head2init(head),
    );
  const p = pending.get(id);
  if (p) p.started = true;
  const empty =
    req.method === "HEAD" || [101, 103, 204, 205, 304].includes(head.s);
  if (empty) {
    pending.delete(id);
    return new Response(null, head2init(head));
  }
  const html =
    req.mode === "navigate" && /text\/html/i.test(header(head, "content-type"));
  return new Response(html ? inject(stream) : stream, head2init(head));
}

function header(head, name) {
  return head.h.find(([k]) => k.toLowerCase() === name)?.[1] ?? "";
}

function head2init(head) {
  const headers = new Headers();
  for (const [k, v] of head.h) {
    try {
      headers.append(k, v);
    } catch {
      // a header the browser won't take in a response
    }
  }
  return { status: head.s, statusText: head.t, headers };
}

// Puts the frame's helper first in every page the app serves, right after the doctype (before
// it, the page would render in quirks mode). The helper carries the app's WebSockets over the
// line and keeps the address bar on the app's path. It works on bytes, so any encoding passes
// through untouched.
function inject(stream) {
  const tag = new TextEncoder().encode(
    '<script src="/__hostline/inject.js"></script>',
  );
  let head = new Uint8Array();
  let done = false;
  const place = (c) => {
    // one character per byte, enough to find an ASCII doctype
    const text = String.fromCharCode(...head.subarray(0, 512));
    const at = /^(\xEF\xBB\xBF)?\s*(<!doctype[^>]*>)?/i.exec(text)[0].length;
    c.enqueue(head.subarray(0, at));
    c.enqueue(tag);
    c.enqueue(head.subarray(at));
    done = true;
  };
  return stream.pipeThrough(
    new TransformStream({
      transform(chunk, c) {
        if (done) return c.enqueue(chunk);
        const both = new Uint8Array(head.length + chunk.length);
        both.set(head);
        both.set(chunk, head.length);
        head = both;
        if (head.length >= 512) place(c);
      },
      flush(c) {
        if (!done) place(c);
      },
    }),
  );
}
