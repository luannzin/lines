# Deskline's page

## Purpose

- `deskline.luannzin.com`: get the person being helped from the address to a running Deskline and their code sent, and show the helper what Deskline does, from `luannzin/deskline`'s README facts

## Ownership

- `page.tsx`: metadata, the five release files in the README's install-table order, the steps, and the sections (Once you're in, Coming from AnyDesk, Who can get in)
- `t.ts`: every string of the page, English and Brazilian Portuguese
- `demo/`: the live piece. `demo.tsx` draws two copies of Deskline's window and connects them with a real `RTCPeerConnection` pair (offer and answer handed across in memory, candidates gathered before each is sent); the first answers only after Accept and sends `desktop.ts`'s canvas as video, the second sends the pointer over a data channel. `link.ts`: the code (52 z-base-32 characters), the route and round trip from `getStats()`, and Deskline's link quality. `dots.tsx`: the link drawn as Deskline draws it (forming, live, lost). `t.ts`: the window's words, copied from Deskline's `src/i18n.rs`
- `icon.png`, `opengraph-image.png` (+ `.alt.txt`): `assets/icon.png` and `assets/preview.png` from the Deskline repo, drawn by its `tools/logo.py`

## Local Contracts

- The window copies Deskline's own design (its `DESIGN.md`) in the page's type: the ground, the prompt on the tile, 14px corners, the red sharing bar, green "You have control", the dusk only as the link. When Deskline's window changes, this copy follows (this repo's `DESIGN.md`, Window Copy)
- Window strings are Deskline's (`src/i18n.rs`), never reworded here
- The quality measure must stay Deskline's (`src/look.rs` `link_quality`): LAN 1.0, Direct 0.9, Relay 0.6, less the round trip over 600 ms, between 0.15 and 1

## Verification

- `bun test` covers `link.ts`
- In the browser: copy the code, paste, Connect, Accept with and without "Let them control", move and click on the video, Take back control, Stop sharing, Disconnect, Decline, a wrong code
