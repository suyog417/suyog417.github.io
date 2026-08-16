# suyogbhoye.dev

Personal portfolio. Next.js App Router + TypeScript + Tailwind v4 + GSAP +
Matter.js, exported as a static site to GitHub Pages.

## Local setup

```bash
bun install
bun dev        # http://localhost:3000
bun run build  # production build
bun run lint
```

## Before the first deploy

Two things are still placeholders — both in `src/data/site.ts` except the file:

1. `linkedin` — the real profile URL (GitHub and the site URL are set).
2. `public/resume.pdf` — drop the PDF in; the nav, hero and footer already link to it.

Also `lastUpdated` in the same file — the footer prints it verbatim.

## Adding a project

Everything is data. Append an entry to `projects` in `src/data/projects.ts`; the
horizontal panel, the compact tile, the `/work/<slug>` case-study page, the
marquee, the sitemap entry and the "next case study" link all come from it. No
layout edits.

```ts
{
  slug: "thing",              // becomes /work/thing
  name: "Thing",
  outcome: "One line. What it achieved, not what it is.",
  kind: "Product",            // Product | Client work | Internship | Personal
  year: "2026",
  tier: 1,                    // 1 = sideways panel, 2 = compact tile
  angle: "What this project proves",
  problem: "...",
  constraints: ["..."],
  stack: ["..."],
  metrics: [{ value: "10k", label: "Users" }],   // exactly 3 reads best
  decision: { title: "...", body: "...", tradeoff: "..." },
  architecture: [{ layer: "Client", items: ["..."] }],
  outcomeDetail: ["..."],
  screens: [{ src: "/work/thing/one.png", alt: "..." }],
  links: [{ label: "Case study", href: "/work/thing", kind: "case" }],
  confidential: true,         // optional — prints the client-work disclaimer
}
```

**Screenshots** are a file drop, not a code change: put the image at the `src`
path under `public/`. Until the file exists, `Screenshot` renders a labelled
frame instead of a broken image, so an incomplete project never looks broken.

Ordering follows array order. Tier 1 entries become the sideways-scrolling
panels; tier 2 become the small tiles underneath.

## Editing the rest

| What | Where |
| --- | --- |
| Name, contact, links, education, certifications | `src/data/site.ts` |
| Timeline entries | `src/data/experience.ts` |
| Stack groups and honest depth levels | `src/data/stack.ts` |
| About copy | `src/components/about.tsx` |
| Colours, type scale, motion tokens | `src/app/globals.css` |

## Design system

Tokens are CSS custom properties on `:root` in `globals.css`, exposed to
Tailwind through `@theme inline`. Dark is the default; `html.light` flips every
token. One accent (`--accent`) is used for the scroll
progress bar, the cursor dot, a tenth of the hero particles and the primary CTA
— nothing else.

Type: Instrument Serif (display) / Inter (body) / JetBrains Mono (metadata,
metrics, stack tags), all self-hosted via `next/font`. The hero canvas reads the
generated family name off a probe element — canvas `font` cannot take a CSS
variable.

Note: font variables are set on `<html>`, not `<body>` — `--font-display` is
declared on `:root`, and a `var()` chain only resolves where it is declared.

## Motion

GSAP + ScrollTrigger. The moving parts, roughly in scroll order:

| Piece | What it does |
| --- | --- |
| `HeroCanvas` | Hero, and a toy. A dot field that shoves away from the pointer, the name stacked as ten rigid letter bodies, and a slingshot on the left: pull the ball back, an aim arc appears, let go, knock the name over. Matter.js runs the physics; the drawing is ours, so letters render in the display face and theme colours. |
| `Magnetic` | Buttons lean toward the cursor and snap back. Pointer-fine devices only. |
| `Cursor` | Trailing dot, `mix-blend-difference`, swells over anything clickable. |
| `ScrollProgress` | Hairline accent bar under the nav, scrubbed by scroll. |
| `Marquee` | Endless tech strip that speeds up, skews and reverses with scroll velocity. |
| `HorizontalWork` | The projects section pins and pans sideways as you scroll down. |
| `ScrubText` | About copy lights up word by word, tied to scroll position. |
| `Reveal` | Generic fade/rise on entry. Wrap a block, or pass `stagger` and mark children `data-reveal-item`. |

All of them check `prefers-reduced-motion` first: the CSS in `globals.css`
forces the resting state and the JS never starts a tween. `HorizontalWork` also
degrades to a plain vertical stack below `lg` — no pin, no transform, same
markup.

Tuning knobs for the hero toy, at the top of `hero-canvas.tsx`: `LAUNCH` (pull
distance → launch speed), `KNOCKED` (tilt in radians that counts a letter as
down), `ROWS` (the stack itself). Inside the effect: `BALL` density — the ball
must outweigh a letter (~3) or shots bounce off the stack — plus the letter
`density`/`friction` and `engine.gravity.y`.

Three things there are load-bearing and easy to undo by accident: the sling
ball is created dynamic and *then* frozen with `Body.setStatic` (a body created
static never records the mass `setStatic(false)` restores from, and comes back
weighing infinity); the waiting ball is a sensor, or it blocks the shot in
flight; and spent balls retire once they stop, or they become bumpers that
shield the name.

## Accessibility

Semantic landmarks, skip link, visible focus rings on every interactive
element, `alt` on every image, and text equivalents for metric values that only
read as numerals. The hero canvas is `aria-hidden` with a real `<h1>` behind
it and the whole toy is skipped under reduced motion (static name, no
slingshot), and `ScrubText` animates spans around ordinary text, so selection and
screen readers are untouched. The theme toggle uses CSS rather than state,
so the inactive label stays out of the accessibility tree.

## SEO

Per-page metadata via `generateMetadata`, JSON-LD `Person` schema in the root
layout, generated OG image (`src/app/opengraph-image.tsx`), `sitemap.ts` and
`robots.ts`. All of these read `site.url` — set it before deploying.

## Deploy — GitHub Pages

The site is a static export. `next.config.ts` sets `output: "export"`, so
`bun run build` writes plain HTML/CSS/JS to `./out` — one directory per route,
plus `404.html`, `sitemap.xml`, `robots.txt` and `og.png`.

Pushing to `main` deploys: `.github/workflows/deploy.yml` installs, lints,
builds and publishes `./out` with the official Pages actions. **Enable it once**
at Settings → Pages → Build and deployment → Source → **GitHub Actions**.

The repo is `suyog417/suyog417.github.io`, a user site served from the domain
root, so no `basePath` is needed. If this ever moves to a project repo
(`github.com/suyog417/<name>`), the site would live at `/<name>/` and both
`basePath` and `assetPrefix` have to be set in `next.config.ts` — every asset
404s otherwise.

To check the export before pushing:

```bash
bun run build
cd out && python3 -m http.server 4321   # then open http://localhost:4321
```

### Things the static export depends on

- `public/.nojekyll` — without it GitHub Pages runs Jekyll, which skips the
  `_next/` directory and the whole site loads unstyled.
- `trailingSlash: true` — `/work/qwish/` resolves to `work/qwish/index.html`.
  Pages has no rewrite rules to fall back on.
- `images: { unoptimized: true }` — the default image loader needs a server.
- `export const dynamic = "force-static"` in `sitemap.ts` and `robots.ts` —
  the build fails without it under `output: "export"`.
- `public/og.png` is a real file, not the `opengraph-image` route. That route
  exports without a file extension, so Pages serves it as the wrong content
  type and scrapers reject it. Editing the card means editing the PNG.

### Custom domain

Add the domain in Settings → Pages, put the same name in `public/CNAME`, and
change `site.url` in `src/data/site.ts` — canonical URLs, the sitemap and the
OG tags all read it.
