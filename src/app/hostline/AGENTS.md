# Hostline's page and shell

## Purpose

- `hostline.luannzin.com`: Hostline's page, and the page every Hostline link opens. Without a link after the `#` it's the page about Hostline; with one (`#<secret>~<host>`) the shell covers it, reaches the host's machine over WebRTC and shows the shared app in a frame
- The other half is the CLI in `luannzin/hostline` (`src/peer.rs`, `src/signal.rs`); `PROTOCOL.md` there is the spec both follow

## Ownership

- `page.tsx`, `t.ts`, `layout.tsx`: metadata and the page about Hostline (a placeholder heading until the landing is built on the shared template). `page.tsx` also holds an inline script that marks `<html data-link>` while the page parses when the address carries a link, which hides the page about Hostline before React loads (the root layout's `suppressHydrationWarning` is for that attribute)
- `icon.png`, `opengraph-image.png` (+ `.alt.txt`), `public/hostline/mark.png` (the globe), `mark-out.png` (dim), `mark-spin.png` and `mark-spin-lit.png` (16 frames of it turning, in the dusk and gold): copied from the hostline repo's `assets/`, drawn by its `tools/logo.py`
- `shell/shell.tsx`: the shell. Registers `/hostline-sw.js`, connects, answers the worker's requests over the line, loads the frame at the address's path, claims each navigation inside the frame for this tab, and keeps the address bar and title on the app. Until the app's first page is in, and again when the link ends, the night field covers it with the globe in its glow (the night runs to the screen's edge, `band={0}`, and its dots run under the words, `under="dots"`): the globe turns in the dusk while opening, turns gold once the line is up and stays gold at least 450 ms, and goes still and dim while nobody answers, when the link ended and where the browser can't open it (the title goes back to Hostline's). Over the live app, one control (`Status`) says live or reconnecting in dots and a word and folds to the dots on a click; it sits bottom right because Next.js's dev indicator is bottom left in shared apps
- `shell/tunnel.ts`: the `RTCPeerConnection`, the offer, and the data channel frames (requests, bodies, WebSockets, `BYE`)
- `shell/signal.ts`: the Nostr room, its key, sealing and the offer loop; `shell/link.ts`: reading the link, naming the visitor's browser; `shell/t.ts`: the shell's words; `shell/signal.test.ts`: the shared room vector
- `public/hostline-sw.js`: sends every request from a frame to its shell, and adds `/__hostline/inject.js` to every page the app serves; `public/__hostline/inject.js`: carries the app's WebSockets over the line, reports its path, and calls the shell's `ready()` on `DOMContentLoaded` (the frame's `load` does too, for responses with no page)

## Local Contracts

- A change to the frames, the room, the relays or the messages changes the CLI too, and `PROTOCOL.md`
- The room for secret `0123456789abcdefABCDEF` is `239d7edac96ad773488af98bf4b8e368` on both sides (both test it)
- A top-level document on this host is always the shell; the shared app only ever runs in the frame. The worker relies on it to tell the two apart
- The worker routes a frame's requests by the client that made them; navigations by the shell's claim; anything it can't place goes to the newest tab with an open line (`live` and `idle` messages)
- The shell says where the page comes from before anything of the app shows (`notice`)
- The control over the app holds only live or reconnecting and folds to a dot (Luan's choice, 2026-11-20: no copy-link, QR, folder name or time left)
- The globe turns by stepping through its strip (`animate-turn` in `globals.css`, 16 frames at 90 ms, `steps(16, jump-none)`), with no easing, like the apps' pixel art, and is still under reduced motion; its states change by swapping the image. Redraw the art in the hostline repo and copy it here, never edit it here; a different frame count changes `animate-turn` and the strip's `bg-[length:…]` too

## Verification

- `bun test src/app/hostline`
- In the browser: run the CLI with `HOSTLINE_SHELL=http://hostline.localhost:3100/` against a static site and a Vite dev server, open the link, follow a link inside the app, reload on a deep path, save a file (hot reload and a full reload), and let `--for 30s` run out (the page says the link ended, the globe goes still and dim, the title goes back). Open a second tab with another link and check the first keeps working. A link to a host that isn't running (any 22 characters, `~`, 22 hex) shows opening, then waiting after 8 s. Check the screens at 375 and 1280 wide with the Browser pane shown: a hidden pane doesn't run the field's develop or the fade
