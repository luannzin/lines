---
name: The lines
description: One page per line, on a night field of dithered dusk dots, with the real app running in it.
colors:
  paper-ink: "#f5f5f5"
  button-ink: "#262626"
  ground: "#161616"
  ink-soft: "#b2b2b2"
  ink-muted: "#818181"
  hairline: "#242424"
  field-well: "#1c1c1c"
  focus-ring: "#737373"
  night: "#110d24"
  dusk-violet: "#3a2a6b"
  dusk-plum: "#7a3361"
  dusk-ember: "#e0703f"
  dusk-gold: "#ffd180"
  tile: "#1f1f1f"
  sharing-red: "#9b2c2c"
  on-red: "#ffffff"
  control-green: "#5ac878"
typography:
  name:
    fontFamily: "5x7 pixel face (SVG, one rect per font pixel)"
    fontSize: "42px"
    lineHeight: 1
  name-wide:
    fontFamily: "5x7 pixel face (SVG, one rect per font pixel)"
    fontSize: "56px"
    lineHeight: 1
  tagline:
    fontFamily: "Inter, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 500
    lineHeight: 1.556
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  title:
    fontFamily: "Inter, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.5
  control:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.43
  mono:
    fontFamily: "Geist Mono, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
  code:
    fontFamily: "Geist Mono, monospace"
    fontSize: "clamp(0.875rem, 5.6cqi, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.375
    letterSpacing: "-0.025em"
rounded:
  md: "8px"
  lg: "10px"
  window: "14px"
  full: "9999px"
spacing:
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "6": "24px"
  "8": "32px"
  "10": "40px"
  "14": "56px"
  "16": "64px"
  "28": "112px"
  "36": "144px"
components:
  button-primary:
    backgroundColor: "{colors.paper-ink}"
    textColor: "{colors.button-ink}"
    typography: "{typography.control}"
    rounded: "{rounded.lg}"
    padding: "0 11px"
    height: "32px"
  button-primary-xl:
    backgroundColor: "{colors.paper-ink}"
    textColor: "{colors.button-ink}"
    rounded: "{rounded.lg}"
    padding: "0 15px"
    height: "40px"
  button-outline:
    backgroundColor: "{colors.field-well}"
    textColor: "{colors.paper-ink}"
    typography: "{typography.control}"
    rounded: "{rounded.lg}"
    padding: "0 11px"
    height: "32px"
  button-ghost:
    textColor: "{colors.ink-soft}"
    typography: "{typography.control}"
    rounded: "{rounded.lg}"
    padding: "0 9px"
    height: "28px"
  input:
    backgroundColor: "{colors.field-well}"
    textColor: "{colors.paper-ink}"
    rounded: "{rounded.lg}"
    padding: "0 11px"
    height: "30px"
  window-frame:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.paper-ink}"
    rounded: "{rounded.window}"
  prompt-card:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.paper-ink}"
    rounded: "{rounded.window}"
    padding: "24px"
  sharing-bar:
    backgroundColor: "{colors.sharing-red}"
    textColor: "{colors.on-red}"
    padding: "8px 16px"
  live-status:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.paper-ink}"
    typography: "{typography.control}"
    rounded: "{rounded.full}"
    padding: "0 12px"
    height: "32px"
  live-status-folded:
    backgroundColor: "{colors.ground}"
    rounded: "{rounded.full}"
    padding: "0 12px"
    height: "32px"
    width: "32px"
---

# Design System: The lines

## Overview

**Creative North Star: "The Banner Becomes the Page"**

Each line's README banner, the night field of Bayer-dithered dusk dots with the line's 32x32 mark in the glow and its name in the 5x7 pixel face, is the top of the page, live. The name, the line, the download and the line's running piece sit inside that field as working parts. Below it the night dithers out onto luannzin.com's neutral ground, and the rest of the page is his site's interface: one near-black ground, paper ink in three tiers, white-alpha hairlines, Inter at one size.

The page is dark only, like the apps. Colour lives in the art (the field, the marks, the link between windows) and, inside a copy of an app's own window, in that app's own meanings. The chrome of the page never takes a hue. Density is low: a narrow column of words on the left of the field, sections on the ground set with their title beside them, generous space between them.

A line brings its words, its mark and its live piece; the page around them is shared (`Line` and `Part`). New lines inherit the template rather than designing their own.

**Key Characteristics:**
- A night field (#110d24) of 2px dots on a 3px grid, dithered toward a dusk glow around the line's mark; calm under the words.
- The night ends in a Bayer dither onto the ground, never on a straight edge.
- Inter at one size, hierarchy by weight 500 and ink tier; Geist Mono for codes, file names and measurements.
- One paper-ink button per group.
- Marks and pixel type at whole-pixel multiples only.
- Every motion has a reduced-motion state that is complete, not missing.

## Colors

A neutral interface over a dusk art palette: the only hues on the page are drawn as dots, or carry one meaning inside an app's window.

### Primary
- **Paper Ink** (paper-ink): text at full tier, and the fill of the one primary button per group, whose label is set in **Button Ink** (button-ink).

### Secondary
- **Night** (night): the field's ground, a solid fill behind the dots that stops 160px short of the hero's bottom; the dots carry it the rest of the way.
- **Dusk Violet, Plum, Ember, Gold** (dusk-violet, dusk-plum, dusk-ember, dusk-gold): the ramp from sky to horizon, drawn only as 2px dots in a 4x4 Bayer order. In the field they warm toward the mark; in a link they warm with its quality (violet first, gold last).

### Tertiary
- **Tile** (tile): the raised card of an app's prompt, inside a window copy.
- **Sharing Red** (sharing-red) with **On Red** (on-red): the bar that says someone is in this computer. Only in a copy of Deskline's window.
- **Control Green** (control-green): the words "You have control". Only in a copy of Deskline's window.

### Neutral
- **Ground** (ground): the page and the window copies.
- **Soft Ink** (ink-soft, paper ink at 70%): body copy under a title, step lists, table answers, ghost buttons.
- **Muted Ink** (ink-muted): file descriptions, footer links at rest, window labels. Not for instructions a visitor must follow (the first-run note under the download is Soft Ink).
- **Hairline** (hairline, white at 6%): table row rules, the footer's top rule, window edges as an inset ring.
- **Field Well** (field-well): the fill of inputs and outline buttons.
- **Focus Ring** (focus-ring): every focus outline.

### Named Rules
**The Colour Is the Art's Rule.** The page's own chrome (text, links, buttons, rules, selection, focus) stays on the neutral axis. A hue appears only as dithered dots, or as an app's own meaning inside a copy of its window.

**The Every Grey Is a Dither Rule.** In the art, a lighter or darker passage is made by dot density in Bayer order, never by a fill, gradient, blur or opacity. The night itself ends the same way.

**The One Meaning Rule.** Inside a window copy, red means someone is in and green means you have control. Neither is used for anything else, on the window or off it.

## Typography

**Body Font:** Inter (next/font, `--font-sans`)
**Label/Mono Font:** Geist Mono (`--font-mono`)
**Name Face:** the 5x7 pixel face from each app's `tools/logo.py`, drawn as SVG rects in `currentColor`

**Character:** One quiet sans at one size, a mono for anything copied or measured, and the line's name in the banner's pixel face as the only large type.

### Hierarchy
- **Name** (pixel face, 42px, 56px from 640px): the line's name in the hero, with the text name in `sr-only` beside it. Sizes are multiples of 7 so each font pixel stays a whole pixel.
- **Tagline** (500, 18px, 20px from 640px): the line's one line under the name. The only Inter text above body size.
- **Title** (500, 16px): every heading (section titles, window heads, table heads, list terms, the Hostline shell's state).
- **Body** (400, 16px): all reading text, in Paper Ink or Soft Ink; prose capped at `max-w-prose` (65ch).
- **Control** (500, 14px from 640px, 16px below): coss button and input text.
- **Mono** (400, 14px): file names, the round trip, a computer's short fingerprint, list markers.
- **Code** (400, 5.6% of its window's content width between 14px and 24px, -0.025em): a computer's full code, in three lines of grouped quads, as large as the three lines fit, up to Deskline's own 24px, so it can be read aloud over the phone.

### Named Rules
**The One Size Rule.** Inter is 16px for everything you read. A heading gets weight 500 and full ink, never a larger size; the tagline is the single exception.

**The Whole Pixel Rule.** Pixel type and pixel marks scale only by whole multiples: the name in multiples of 7px, the 32x32 mark at 1x, 3x and 8x, always with `image-rendering: pixelated` and crisp edges.

## Layout

One centred column, 72rem wide, with 24px side padding (40px from 1024px).

The hero is a full-width section: the night field covers it edge to edge, the content sits 56px from the top (80px from 640px) and leaves 176px below for the night to dither out. From 1024px the words take a left column up to 36rem and the mark sits in the right, at 256px (8x), as the glow's subject; below 1024px the mark comes first, at 96px (3x), above the name. The line's live piece begins inside the same field, 56px under the words (64px from 640px).

Below the field, the line's sections (`Part`) stack with 112px between them (144px from 640px). From 1024px each takes a 14rem title column beside a content column capped at 48rem, 64px apart; narrower, the title sits above. The every-file table is always the last section, then the footer: mark at 1x, source, author, and the language switch pushed right.

Rhythm inside a block: 4 to 12px between a title and its text, 24 to 40px between groups.

Hostline's shell has no ground: the night covers the whole screen to its bottom edge, and the globe and the words centre in it with 24px side padding. On phones the globe (96px, 3x) sits centred with the words centred 96px under it, far enough that the glow ends round before them. From 1024px it takes the README banner's composition: the words left-aligned on the left, the globe at 256px (8x) on the right, 160px apart. The words cap at 28rem. Over a shared app, the live status sits bottom right, max(12px, safe area) from the edges.

## Elevation & Depth

Flat. Depth on the ground comes from tone and 1px inset hairline rings, never from shadow. The field gives the hero its depth through the glow's dot density.

### Shadow Vocabulary
- **Window lift** (`box-shadow: inset 0 0 0 1px var(--border), 0 24px 48px -24px rgb(0 0 0 / 0.6)`): only on a copy of an app's window standing in the field, so it reads as a window on a desktop.
- **Status lift** (`box-shadow: inset 0 0 0 1px var(--border), 0 8px 24px -8px rgb(0 0 0 / 0.6)`): only on Hostline's live status, which floats over a shared app whose content can be anything.
- **Prompt edge** (`box-shadow: inset 0 0 0 1px var(--border)`): the prompt card over its 55% black dim.
- **Paper button** (coss default): a 1px white-16% top inset and a faint primary shadow at rest, removed on press.

### Named Rules
**The Inset Edge Rule.** Containers on the ground are edged by a 1px inset ring or a hairline rule. An outer shadow belongs only to what floats over something that isn't the ground: an app window shown in the field (Window lift) and Hostline's live status over a shared app (Status lift).

## Shapes

Gently rounded controls (10px for buttons and inputs, 8px for the smallest buttons). Window copies and their prompt cards take 14px, Deskline's window radius. Hostline's live status is the one fully rounded shape: a pill, and a 32px circle when folded. Everything in the art is square: dots, pixel type and marks have no rounding and no anti-aliasing. Tables and lists are open, ruled by hairlines only.

## Components

### Buttons
Coss UI buttons, quiet and tactile.
- **Shape:** gently rounded (10px).
- **Primary:** Paper Ink fill, Button Ink label, weight 500. One per group: Download, Copy code, Connect, Accept. The hero's Download uses the large size (44px tall, 40px from 640px) with a 1.5-stroke download icon.
- **Outline:** Field Well fill, input-alpha border; the second choice beside a primary (Decline).
- **Ghost:** no fill, Soft Ink label, a 4% white wash on hover (Cancel, Disconnect). On the sharing bar the ghost turns white with a 20% white hover, and Stop sharing becomes a white button with a red label.
- **Press:** scales to 0.96 over 150ms on `cubic-bezier(0.23, 1, 0.32, 1)`; no scale under reduced motion.
- **Focus:** a 2px Focus Ring outline offset from the ground (white on the red bar).
- **Touch:** on coarse pointers the hit area grows to at least 44px.

### Inputs / Fields
- **Style:** Field Well fill, input-alpha border, 10px corners; Geist Mono for a pasted code; placeholder in Muted Ink at 72%.
- **Focus:** border goes to Focus Ring with a 3px ring at 24%.
- **Disabled:** 64% opacity while a connection is waiting.

### Links
Inline links are Paper Ink with an underline at 25% ink, 3px offset, rising to 60% on hover. Footer links are Muted Ink, going to Paper Ink on hover. No link takes a hue.

### Navigation
The footer's language switch: each language named in its own language, Muted Ink at rest, Paper Ink for the current one (`aria-current`).

### Night Field (signature)
A canvas behind the hero: 2px dots on a 3px grid (rounded to whole device pixels), dithered in five steps from night through the dusk toward the element marked as the glow (the mark), stretched 1.6x horizontally. Under the element marked calm (the words) and 24px around it the field is plain night, so text and the download sit on nothing; from there it comes back over 176px, the glow in proportion and the night's one violet dot in sixteen thinning in at random, so the calm has no edge. Away from the glow the field keeps to that one dot in sixteen. In the last 160px the night's own cells thin out in Bayer order onto the ground. The dots develop once, a front crossing left to right with each dot landing at its Bayer turn, over 1400ms with an exponential ease-out; under reduced motion the field is drawn at once.

It comes in two variants. The hero's is the default: a 160px band dithering onto the ground below, plain night under the words. Hostline's shell fills a whole screen with nothing below, so it has no band (the night runs to the screen's edge), and the night's sparse violet dots run on under the words, only the glow fading from the words' box over 240px: on a full screen an empty box around the words read as a plate.

### Link Meter (signature)
The link between two windows, drawn on the same dot grid. At rest, a band of violet every other dot joins the windows across the whole gap. Forming, a warming front sweeps left to right every 2400ms. Live, it reaches further, grows denser and warms toward gold with the link's quality, settling over 700ms, then stops repainting. Lost, sparse violet drifts. Under reduced motion each state is one still frame. With stats, the route and round trip show under it in Mono.

### Window Copy
A copy of an app's own window, built in that app's system (for Deskline: the top bar with the mark and one underlined tab, the code, the prompt card, the red sharing bar, the session toolbar with its meter, the video on black; for Hostline: the file's tab in Mono over the editor, the CLI's own terminal lines in Mono on the Tile under it, and the visitor's phone, a black bezel at 28px corners around the page, with the request that brought it in Muted Mono under it). One shared `Window` draws the frame. Ground fill, 14px corners, Window lift, as tall as what it shows (a shared screen is 16:10, never letterboxed), labelled above in Muted Ink with what it stands for; side by side the two windows align at the top and the link's column stretches between them. A field paired with its button stays on one line while the field keeps 14rem, and the button drops below it otherwise; the field's hint is in Inter so it fits whole in either language. A prompt arrives over a 55% black dim, the card rising from 0.96 with a fade over 200ms; under reduced motion it only fades. Focus follows the question: to Accept when asked, to Stop sharing once answered, back to Copy code or the code field when it ends.

### Every File
A table on hairline rules: the system and versions in weight 500 (with "yours" under the detected one), the exact file name as a Mono link, and how to run it in Muted Ink. A file with an install line shows it under how to run it.

### Install Line
A line to paste in a terminal, for a system that stops a downloaded file (Deskline on macOS), or the way a command-line line installs (Hostline), whose hero leads with it in place of the Download button. One sentence above it says what it saves you; then the line in Mono 14px on a Field Well with the input-alpha border and 10px corners, kept on one line as it's pasted (it scrolls sideways where it doesn't fit, and its length never widens the page), with an outline Copy beside it that reads Copied for 2 seconds. It sits under the hero's first-run note and under its file's row in Every file; a line's own sections may show it once more where they walk through the first time.

### Ruled Lists (a line's sections)
Comparisons and troubleshooting are tables on hairline rules: the left column (what they know from elsewhere, what you see) in Muted Ink at two fifths, the answer in Soft Ink. Releases are a list on the same rules, the version as a Mono link to its release over its date in Muted Mono, the notes in Soft Ink beside them (under them on phones), newest first.

### Hostline Shell (signature)
Every moment of a Hostline link that isn't the shared app: opening, the beat between the line coming up and the app's first page, waiting, ended, unsupported. The full-screen Night Field with Hostline's globe as the glow's subject and the words in its calm: the state as a Title in Paper Ink, one line under it in Soft Ink, in a polite live region. No button, no spinner, no card.

The globe is the state. It is the line's 32x32 mark, a wireframe globe drawn in the dusk by height (violet high, gold low), turning through a strip of 16 frames, 90ms each (1440ms), stepped with no easing like the apps' pixel art, and still under reduced motion. Dusk while the link opens; gold once the line is up, held gold at least 450ms so the turn is seen; still and dim when nobody answers, the link ended or the browser can't open it. Its other strips are preloaded so a change never shows a gap.

When the app's first page is in, the night fades out over 300ms ease-out (at once under reduced motion) and goes inert; the app's frame under it stays inert while the night covers it. When the link ends, the night comes back.

### Live Status (Hostline)
The only control over a shared app: a Ground pill, 32px tall, Status lift, the word in Control type and Paper Ink after a 3x3 cluster of 2px dots on the field's 3px grid. Live: all nine, gold with ember in Bayer order. Reconnecting: a quarter in ember, the lit quarter drifting in Bayer order (1.2s, stepped), the rest not drawn (a dot is there or not, never faded); still under reduced motion. A click folds it to the dots (a 32px circle, `aria-expanded`, the word as its title when folded) and back, the word's column opening and closing over 200ms on `cubic-bezier(0.23, 1, 0.32, 1)`, at once under reduced motion. Its hit area grows to 44px. Bottom right, because Next.js's dev indicator holds bottom left in shared dev apps.

## Do's and Don'ts

### Do:
- **Do** build a new line from `Line` and `Part`, bringing only its words, its 32x32 mark and its live piece.
- **Do** draw every passage of the art in 2px dots on the 3px grid, in the 4x4 Bayer order, from the night and the four dusk colours only.
- **Do** end the night in a dither onto the ground wherever there is ground below it; a full-screen night runs to the screen's edge.
- **Do** set the line's name in the pixel face at a multiple of 7px, with the text name available to screen readers.
- **Do** keep one paper-ink button per group, and put the detected system's file first, with its exact file name and what the system says the first time.
- **Do** give every motion a reduced-motion state that still shows the result: field drawn at once, link strips still, prompts fading without scale, Hostline's globe and status dots still.
- **Do** keep every string in English and Brazilian Portuguese.

### Don't:
- **Don't** give the page's chrome a hue: no accent links, buttons, focus rings or selection colours.
- **Don't** use the dusk as a fill, gradient or blur, or anywhere it isn't dots.
- **Don't** use a window copy's red or green outside that window, or for anything but its meaning.
- **Don't** raise an Inter heading above 16px; use weight 500 and full ink.
- **Don't** scale a mark or the pixel name by fractional amounts or smooth it.
- **Don't** add a light theme; the lines are dark, like the apps.
- **Don't** show the app through a GIF, video or mock; a line's live piece runs for real.
