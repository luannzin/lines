# Hostline's page and shell

## Purpose

- `hostline.luannzin.com`: Hostline's page, and the page every Hostline link opens. Without a link after the `#` it's the page about Hostline; with one (`#<secret>~<host>`) the shell covers it, reaches the host's machine over WebRTC and shows the shared app in a frame
- The other half is the CLI in `luannzin/hostline` (`src/peer.rs`, `src/signal.rs`); `PROTOCOL.md` there is the spec both follow

## Ownership

- `page.tsx`, `t.ts`, `layout.tsx`: metadata and the page about Hostline (a placeholder heading until the landing is built on the shared template)
- `shell/shell.tsx`: the shell. Registers `/hostline-sw.js`, connects, answers the worker's requests over the line, loads the frame at the address's path, claims each navigation inside the frame for this tab, keeps the address bar and title on the app, and shows opening, waiting, ended and the pill
- `shell/tunnel.ts`: the `RTCPeerConnection`, the offer, and the data channel frames (requests, bodies, WebSockets, `BYE`)
- `shell/signal.ts`: the Nostr room, its key, sealing and the offer loop; `shell/link.ts`: reading the link, naming the visitor's browser; `shell/t.ts`: the shell's words; `shell/signal.test.ts`: the shared room vector
- `public/hostline-sw.js`: sends every request from a frame to its shell, and adds `/__hostline/inject.js` to every page the app serves; `public/__hostline/inject.js`: carries the app's WebSockets over the line and reports its path

## Local Contracts

- A change to the frames, the room, the relays or the messages changes the CLI too, and `PROTOCOL.md`
- The room for secret `0123456789abcdefABCDEF` is `239d7edac96ad773488af98bf4b8e368` on both sides (both test it)
- A top-level document on this host is always the shell; the shared app only ever runs in the frame. The worker relies on it to tell the two apart
- The worker routes a frame's requests by the client that made them; navigations by the shell's claim; anything it can't place goes to the newest tab with an open line (`live` and `idle` messages)
- The shell says where the page comes from before anything of the app shows (`notice`)

## Verification

- `bun test src/app/hostline`
- In the browser: run the CLI with `HOSTLINE_SHELL=http://hostline.localhost:3100/` against a static site and a Vite dev server, open the link, follow a link inside the app, reload on a deep path, save a file (hot reload and a full reload), and let `--for 30s` run out (the page says the link ended). Open a second tab with another link and check the first keeps working
