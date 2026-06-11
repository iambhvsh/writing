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

Main widths:

| Area | Width |
|---|---:|
| Home container | `48rem` |
| Post header | `48rem` |
| Post body | `48rem` |
| Header inner | `72rem` |

Post covers use:

- `aspect-ratio: 16 / 9`
- `object-fit: cover`
- `border-radius: 0.875rem`
- `border: 1px solid var(--color-border)`

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
| `--color-code-bg` | `#161614` |
| `--color-code-text` | `#e8e5e0` |

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

Header:

- file: `src/lib/components/Header.svelte`
- sticky top header
- blurred background layer
- serif wordmark
- search button
- theme toggle
- theme preference stored in `localStorage`

Home:

- file: `src/routes/+page.svelte`
- remote avatar image
- title `Bhavesh Patil – Writing`
- recent posts list

Post card:

- file: `src/lib/components/PostCard.svelte`
- title, date, reading time, description, and up to three tags
- first card receives featured sizing

Post page:

- file: `src/routes/[slug]/+page.svelte`
- optional cover
- metadata row
- title and description
- tags
- author row
- post body rendered through SVX

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
