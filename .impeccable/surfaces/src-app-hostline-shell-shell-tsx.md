---
version: 1
slug: "src-app-hostline-shell-shell-tsx"
primary_target: "src/app/hostline/shell/shell.tsx"
related_targets: ["public/hostline-sw.js","public/__hostline/inject.js"]
---

Scope: the shell every Hostline link opens at hostline.luannzin.com (src/app/hostline/shell, with public/hostline-sw.js and public/__hostline/inject.js). Mode: Operate. An extension of the lines' established world (DESIGN.md); no new visual identity.

Audience and job: a friend of the developer, or the developer on their own phone, who opened a pasted link. Job: see where the page comes from, then use the shared app as if it were deployed. Second: someone whose link ended or whose host is offline needs to know what happened and what to ask for.

States: opening (connecting, with the notice), loading (connected, the app's first page on its way), live, reconnecting, waiting (nobody answering), ended (the link self-destructed), unsupported.

Luan's answers (2026-11-20/21): the mark is a globe (he rejected the house as too simple: "the ugliest line"; he asked for a globe or a cloud with juice, and okayed the glowing dusk wireframe globe); the corner control over the app only collapses to a dot (no copy-link, no QR, no folder name or time left).

## Direction contract

THESIS: The shell is your localhost going out on the world. Every moment that isn't the app is the lines' night field with Hostline's globe in its glow, and the globe tells the state: turning in the dusk while the link opens, turning gold once the line is up, still and dim when nobody answers, the link ended or the browser can't open it. Over the app, one small control says live or reconnecting and gets out of the way. Refuses the spinner-and-card loading page and a toolbar framing the app.

OWN-WORLD: Night #110d24 filling the screen to its bottom edge (nothing below it), 2px dots on a 3px grid dithered toward the dusk around the globe, the night's sparse violet dots running on under the words so their calm never reads as a plate. The globe: 32x32 pixel art, meridians and parallels drawn as 1px lines in the dusk by height (violet high, gold low) on a dark sphere, seen from a little above, a spark running the equator; a strip of 16 frames stepped at 90ms with no easing, still under reduced motion; at 3x on phones and 8x from 1024px, pixelated. Words in Inter 16px: title weight 500 in paper ink, text in soft ink, max 28rem. The live control: ground #161616 pill, 32px tall, inset hairline and a soft lift, a 3x3 cluster of 2px dots (gold and ember while live, sparse ember drifting while reconnecting) and the word.

STORY: The visitor reads that the page comes from someone's computer while the dusk globe turns; it turns gold when the line is up and holds that for a beat; the night fades and the app is there. If the link ends, the night comes back with the globe still and dim and says to ask for a new link.

FIRST VIEWPORT: Full-screen night. Phones: the globe at 96px as the glow's subject, centred, with the title ("Opening the link") and the notice centred 96px under it (so the glow ends round before the words). From 1024px, the README banner's composition centred on the screen: the words left-aligned on the left, the globe at 256px on the right in its glow, 160px apart. No button. Live: the app edge to edge, the pill bottom right, 12px from the edges with safe areas (Next.js's dev indicator holds bottom left in shared dev apps).

FORM: Extension of the established night field (DESIGN.md "The Banner Becomes the Page"); no concept roll for an extension. Seed key: none (extension).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
