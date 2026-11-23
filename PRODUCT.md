# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16 (App Router, `proxy.ts` host routing), Bun, Biome, Tailwind v4, coss UI (Base UI), better-intl (English and Brazilian Portuguese). Picked by the user. Deployed on Vercel; the user imports the repo and adds each subdomain there himself.

## Users

People who were sent a line's address and need the app running. For Deskline that is mostly the person being helped: often not technical, usually on the phone or in a chat with the helper, told "open deskline.luannzin.com". Second, the helper, who sends the link and wants it to be the one address that works.

## Product Purpose

The websites of Luan Fabri's "lines": apps that do what people assume needs a company server, with only a code or a link. Each line gets a page on its own subdomain of luannzin.com (`deskline.`, `partyline.`), served by one Next.js app that maps the request's host to the line. A page gets someone from the address to the working app: download the right file, open it, take the first step. Success for Deskline: the helped person downloads, opens it and sends their code without being walked through anything else.

## Positioning

Each page runs a piece of the real thing instead of describing it: Deskline's page connects two Deskline windows inside the page over a real WebRTC link and draws the link the way the app does. No company account, no server to run: the same claim the apps make, shown rather than said.

## Operating Context

- The visitor often arrives from a link pasted in WhatsApp, Discord or a call, frequently on a phone, then downloads on a computer.
- Downloads are GitHub's stable `https://github.com/luannzin/<repo>/releases/latest/download/<file>` links, file names from each README's install table. Nothing reads GitHub Releases at build or request time; when a file name changes, the page changes by hand.
- The apps update themselves from their own repo's releases; their code and releases never move into this repo.
- Lines covered: Deskline (first), PartyLine (next). Sightline's subdomain is the Sightline app itself, a separate Vercel project, not a page here. LanPet gets no page yet.

## Capabilities and Constraints

- Every string in English and Brazilian Portuguese; the language follows the visitor (cookie, then Accept-Language) and can be switched.
- Builds are unsigned: Windows SmartScreen needs "More info, Run anyway" and macOS "Open Anyway" the first time. Pages say so next to the download.
- Page views only, through Vercel Web Analytics: no custom events, nothing after a `#`, and a Hostline link's page isn't counted. No accounts, forms or server state.

## Brand Commitments

- Name of each line as its README writes it: Deskline, PartyLine.
- Identity: each line's 32x32 pixel-art mark and the dusk palette (#3a2a6b, #7a3361, #e0703f, #ffd180 on #110d24) in a 4x4 Bayer ordered dither, as drawn by each repo's `tools/logo.py`.
- Family resemblance with luannzin.com (`Documents/luannzin.com/DESIGN.md`) is binding: neutral ink tiers, hairlines, no accent colour in the interface, colour only inside the art.
- Voice: Luan's (`luannzin.com/IDENTITY.md`, `luannzin-online-presence/VOICE.md`): plain, concrete, first person where it fits, no marketing tone. Facts only from each app's README and PRODUCT.md.

## Evidence on Hand

- Deskline: README (install table, features, Coming from AnyDesk, Security, Known limits), PRODUCT.md, DESIGN.md, `tools/logo.py`, `assets/icon.png`. `docs/*.png` are pre-redesign screenshots and must not be used.
- No users, testimonials, download counts or benchmarks exist for any line. Never invent them.

## Product Principles

1. The download is never more than one look away, and the right system's file comes first.
2. Show the real thing working in the page; never a GIF or a mock of it.
3. Say what is true today, in the visitor's words; leave out what the app doesn't do yet only when the README does.
4. A line adds content, its mark and its live piece; the page around them is shared.
5. Colour is the art's; the interface stays neutral.

## Accessibility & Inclusion

Non-technical visitors on phones and old computers: plain words, large targets, everything reachable by keyboard, motion off under reduced motion, both languages complete.
