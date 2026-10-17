# Bhavesh Patil – Writing

Design and implementation reference for `writing.iambhvsh.in`.

## Routes

```text
/
/{slug}
/og.png
/{slug}/og.png
/rss.xml
/sitemap.xml
```

## Content

Posts live in `writings/<slug>/index.svx` or `writings/<slug>/index.md`.

Required frontmatter:

```md
---
title: My Post
description: Short description for previews and metadata.
publishedAt: 2026-06-10
tags: design, engineering
---
```

Optional frontmatter:

```md
cover: ./cover.webp
coverAlt: Description of the cover image
```

Rules:

- `publishedAt` uses `YYYY-MM-DD`.
- `tags` uses comma-separated data.
- Cover files may be local, absolute, or remote URLs.
- If `cover` is omitted, the loader checks for `cover.*` for e.g. .png, .jpg, .webp, in the post folder and `cover.*` should be beside the post.

## Data Flow

Content loading is handled in `src/lib/content.ts`.

The loader:

- imports post modules from `writings/**/index.{svx,md}`
- reads raw content for reading time
- validates title, description, published date, tags, cover, and cover alt text
- normalizes dates to ISO strings
- normalizes tags to `string[]`
- resolves local cover files with Vite asset URLs
- sorts posts by `publishedAt` descending

## Metadata

SEO generation is handled in `src/lib/seo.ts`.

Each page receives:

- title
- description
- canonical URL
- Open Graph metadata
- Twitter metadata
- JSON-LD

Post pages receive:

- `article` Open Graph type
- `article:published_time`
- author
- tags
- `BlogPosting` JSON-LD

Home receives `WebSite` JSON-LD.

JSON-LD is escaped before rendering in `src/lib/components/Seo.svelte`.

## Open Graph Images

Shared OG rendering lives in `src/lib/og.ts`.

Routes:

- `src/routes/og.png/+server.ts`
- `src/routes/[slug]/og.png/+server.ts`

Behavior:

- home OG image is generated at `/og.png`
- post OG image is generated at `/{slug}/og.png` only when the post has no cover
- posts with covers use the cover as their social image
- OG images are rendered with Satori and converted to PNG with Resvg

## Search

Search UI lives in `src/lib/components/Search.svelte`.

Search helpers live in `src/lib/search.ts`.

Behavior:

- `Cmd/Ctrl + K` toggles search
- Escape closes search
- Pagefind is loaded only outside development
- results are normalized from `.html` URLs to clean routes
- Pagefind excerpts are sanitized
- phrase queries can produce phrase-focused excerpts

## Layout

The site uses a symmetrical 3-column editorial layout on desktop screens (`>= 1280px`):

| Area | Width | Placement |
|---|---|---|
| Navbar inner | `1440px` max | Sticky top (`height: 3.5rem`) with GPU progress bar |
| Left sidebar | `224px` | Fixed (`left: max(1.5rem, calc(50vw - 720px + 1.5rem))`) |
| Center column | `820px` max | Centered (`margin: 0 auto`) |
| Right sidebar | `260px` | Fixed (`right: max(1.5rem, calc(50vw - 720px + 1.5rem))`) |
| Layout container | `1440px` max | `padding-left: calc(224px + 2rem); padding-right: calc(260px + 2rem);` |

On smaller screens (`< 1280px`):
- Left and right fixed sidebars hide cleanly.
- Main column fills the viewport (`max-width: 820px; margin: 0 auto;`).
- On the home page, a horizontal scrollable topic chip bar renders under the header.
- On the post page, heading links remain navigable.

Post covers and thumbnails use:

- Post header cover: `aspect-ratio: 16 / 9`, `object-fit: cover`, `border-radius: 0.875rem`
- Card thumbnail: `150px` by `100px`, `object-fit: cover`, `border-radius: var(--radius-md)`
- Border: `1px solid var(--color-border)`

## Typography

Fonts are declared in `src/app.css`.

| Token | Use |
|---|---|
| `--font-sans` | UI, metadata, prose |
| `--font-serif` | wordmark, headings, post titles |
| `--font-mono` | code |

Text tokens:

| Token | Value |
|---|---:|
| `--text-xs` | `0.75rem` |
| `--text-sm` | `0.8125rem` |
| `--text-base` | `1rem` |
| `--text-lg` | `1.125rem` |
| `--text-xl` | `1.25rem` |
| `--text-2xl` | `1.5rem` |
| `--text-3xl` | `1.875rem` |
| `--text-4xl` | `2.25rem` |
| `--text-5xl` | `3rem` |

Tracking tokens:

| Token | Value |
|---|---:|
| `--tracking-tight` | `0em` |
| `--tracking-normal` | `0em` |
| `--tracking-wide` | `0.025em` |
| `--tracking-wider` | `0.05em` |
| `--tracking-widest` | `0.1em` |

## Color Tokens

Light theme:

| Token | Value |
|---|---|
| `--color-bg` | `#f5f4f0` |
| `--color-surface` | `#ffffff` |
| `--color-surface-hover` | `#fafaf8` |
| `--color-border` | `rgba(0, 0, 0, 0.06)` |
| `--color-border-strong` | `rgba(0, 0, 0, 0.1)` |
| `--color-text-primary` | `#0f0f0e` |
| `--color-text-secondary` | `#555552` |
| `--color-text-tertiary` | `#747470` |
| `--color-text-inverse` | `#f5f4f0` |
| `--color-accent` | `#0f0f0e` |
| `--color-accent-hover` | `#6b6b67` |
| `--color-code-bg` | `#ffffff` |
| `--color-code-text` | `#24292e` |

Dark theme:

| Token | Value |
|---|---|
| `--color-bg` | `#000000` |
| `--color-surface` | `#0b0b0b` |
| `--color-surface-hover` | `#111111` |
| `--color-border` | `rgba(255, 255, 255, 0.05)` |
| `--color-border-strong` | `rgba(255, 255, 255, 0.09)` |
| `--color-text-primary` | `#f0efeb` |
| `--color-text-secondary` | `#b5b5b1` |
| `--color-text-tertiary` | `#8a8a85` |
| `--color-text-inverse` | `#000000` |
| `--color-accent` | `#f0efeb` |
| `--color-accent-hover` | `#8a8a85` |
| `--color-code-bg` | `#0c0b0a` |
| `--color-code-text` | `#ede8df` |

## Motion

Motion tokens:

| Token | Value |
|---|---:|
| `--duration-fast` | `120ms` |
| `--duration-base` | `200ms` |
| `--duration-slow` | `300ms` |
| `--ease-base` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` |

Global reduced-motion handling is defined in `src/app.css`.

## Components

- **`Header.svelte`** (`src/lib/components/Header.svelte`): Sticky navbar with blurred backdrop, serif wordmark, search trigger, theme toggle, and reading progress bar (`transform: scaleX`).
- **`Sidebar.svelte`** (`src/lib/components/Sidebar.svelte`): Unified right sidebar used across both home and article pages; displays Author Profile card, Series Navigation (when applicable), and RSS subscription card.
- **`Topics.svelte`** (`src/lib/components/Topics.svelte`): Fixed left sidebar navigation for the home page; renders clean, tabular-aligned top 5 topics and "All Writings" filter.
- **`Toc.svelte`** (`src/lib/components/Toc.svelte`): Fixed left sidebar Table of Contents for post reading; features click-scroll lockout and RAF scroll-spy with zero-latency heading highlights.
- **`Card.svelte`** (`src/lib/components/Card.svelte`): Post preview card featuring title, date, reading time, full-width description, tags, and cover thumbnail preview.
- **`Badge.svelte`** (`src/lib/components/Badge.svelte`): Topic / tag badge pill.
- **`Search.svelte`** (`src/lib/components/Search.svelte`): Command palette and Pagefind client search modal.
- **`Seo.svelte`** (`src/lib/components/Seo.svelte`): Document `<head>` metadata, Open Graph, Twitter cards, and JSON-LD structured data.
- **`Footer.svelte`** (`src/lib/components/Footer.svelte`): Copyright, back-to-top, and attribution footer.

## Accessibility

Current requirements:

- preserve `header`, `main`, `article`, `footer`, and `time`
- keep the post skip link
- keep icon button labels
- use empty alt text for decorative images
- use `coverAlt` for informative covers
- keep visible focus states
- respect reduced motion

## Security Headers

Vercel headers are defined in `vercel.json`.

Configured headers:

- `Content-Security-Policy`
- `Referrer-Policy`
- `X-Content-Type-Options`
- `X-Frame-Options`
- `Permissions-Policy`
- `Strict-Transport-Security`

## Generated Files

The following are generated and ignored:

- `build/`
- `.svelte-kit/`
- `.vercel/`
- `.wrangler/`
- `.output/`

## Checks

Use these before shipping changes:

```sh
pnpm lint
pnpm check
pnpm knip
pnpm build
```
