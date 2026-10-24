# Md Anas — portfolio

A portfolio built as an **engineering drawing set**. Six sheets on a drafting board: the
paper is a WebGL2 shader, the schematics behind the content are plotted line by line by a
travelling plotter head, and every sheet carries one click-driven instrument.

**Live:** _deploy pending_ · **Source:** you're in it

---

## The idea

Most developer portfolios are a list of jobs with a dark hero. This one borrows the vocabulary
of technical drawing, because that vocabulary already encodes exactly what a portfolio needs to
say: what the thing is, what it's made of, how the parts relate, and who signed off.

| Sheet | Content | Instrument |
|-------|---------|------------|
| 01 | Identity | Drafting title block |
| 02 | Talview recruitment platform | Two-tier **sectional elevation** — 7 feature domains above a grade line, 4 platform layers below. Click a block for its detail note. |
| 03 | Skills | Radial **parts diagram** with balloon item numbers. Click a part for its spec and official docs. |
| 04 | Projects | **Exploded assembly** — click to explode into isometric layers, each linking to its README. |
| 05 | Recognition | **Quarterly histogram**. Click a block to read the citation and open the original award. |
| 06 | Contact | **RFI form** → Web3Forms → inbox, with a `localStorage`-backed success state. |

## Design system

Hand-authored CSS driven entirely by custom properties in `:root`. The design is bespoke
enough that a utility framework would only add indirection.

```
--paper #EAE6DB   --ink #14161A   --body #3A4049
--blu   #1B4BA6   --red #BE3A2A   --rule #C8C2B4
```

Type is **Archivo Variable** on its width axis (`wdth 112–120` for display, which reads as
drawing-sheet lettering) paired with **JetBrains Mono** for every annotation, dimension and
label. Both are self-hosted and preloaded — no font CDN.

## Motion

- **The plot.** `components/SheetPlot.tsx` builds the background schematics as SVG, measures
  every path, and animates `stroke-dashoffset` in sequence while a crosshair head rides the
  curve via `getPointAtLength`. Once drawn, it periodically erases and re-plots one element —
  a revision, not a loop.
- **Parallax** is a composited CSS `transform` on the `<svg>` layer. Setting an SVG `transform`
  attribute on the inner `<g>` instead would re-rasterize every vector each frame; that
  measured 30fps against a flat 60.
- **Reduced motion** is honoured throughout: the sheet renders fully drawn, nothing animates.

## Stack

Next.js 16 (App Router, static) · React 19 · TypeScript (strict) · WebGL2 · SVG. No UI
library, no animation library, no runtime CSS-in-JS.

## Running it

```bash
npm install
cp .env.example .env.local   # add WEB3FORMS_KEY
npm run dev                  # http://localhost:3000
```

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |

### Contact form

Sheet 06 posts to `/api/contact`, which validates the payload and forwards it to
[Web3Forms](https://web3forms.com) (free, 250 submissions/month, delivers to Gmail).

The key is deliberately **server-side only** — `WEB3FORMS_KEY`, no `NEXT_PUBLIC_` prefix.
A key in the client ships in the page source where anyone can lift it and send mail
through it. Proxying also lets the payload be validated before it leaves and avoids
browser CORS.

A honeypot field (`botcheck`) is rendered off-screen and rejected server-side; bots that
fill it get a `200` so they learn nothing.

Without a key the route answers `503`, the form keeps what you typed and offers a direct
mailto — it never claims a message was delivered when it wasn't.

## Layout

```
app/          layout, page, globals.css, icon, api/contact
components/   PaperCanvas · SheetPlot · Sheet01–06 · RecordViewer
data/         platform · toolchain · projects · awards · profile
lib/          useReveal, SVG helpers
public/       fonts, award images
```

All content lives in `data/` as typed modules, so updating the site is editing data, not JSX.

## Licence

Source MIT. Content, award records and likeness are not.
