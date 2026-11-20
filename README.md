# lines

The websites of my lines, the apps that only need a code or a link: one Next.js app, one subdomain of luannzin.com per line.

- [deskline.luannzin.com](https://deskline.luannzin.com): [Deskline](https://github.com/luannzin/deskline), remote desktop with no server to run. Two copies of its window in the page, connected for real over WebRTC.
- PartyLine is next. [Sightline](https://github.com/luannzin/sightline)'s address is the app itself, so it has no page here.

The apps' code and releases stay in their own repos. Downloads are GitHub's `releases/latest/download/<file>` links, so nothing here reads GitHub.

## Run it

```bash
bun install
bun run dev        # then open http://deskline.localhost:3000
bun test           # the demo's code format and link quality
bun run build
```

`src/proxy.ts` picks the line from the request's host, so `deskline.localhost` serves `/deskline`. Any other host shows the paths as they are (`/deskline` on the Vercel address).

## Deploy

Import the repo in Vercel (it detects Next.js and Bun), then add each line's subdomain to the project under Settings, Domains: `deskline.luannzin.com`. luannzin.com's DNS is on Vercel, so the record is made there.
