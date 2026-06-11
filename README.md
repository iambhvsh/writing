# Bhavesh Patil – Writing

Personal writing site for essays, notes, and ideas on design, engineering, and craft.

The site is built to keep writing simple while generating the surrounding publishing
surface automatically: routes, metadata, social images, feeds, search, and static
output.

For the full design and implementation reference, see [DESIGN.md](./DESIGN.md).

## Features

- Folder-based writing with clean URLs.
- SVX and Markdown support for posts.
- Required frontmatter validation for title, description, publish date, tags, and covers.
- Automatic reading time calculation from raw post content.
- Automatic Table of Contents generation for every post.
- Syntax highlighting with Shiki.
- Pagefind-powered search after production builds.
- SEO metadata generated from post frontmatter and site config.
- Canonical URLs, Open Graph tags, Twitter card tags, and JSON-LD.
- Dynamic Open Graph images with Satori and Resvg.
- Cover image support with automatic `cover.*` detection.
- RSS feed and sitemap generation.
- Static output through SvelteKit adapter-static.
- Light and dark themes with persisted preference.
- Accessible landmarks, skip link, icon labels, focus states, and reduced-motion handling.
- Vercel deployment config with security headers.

## Lighthouse and SEO

The site is built to be SEO-perfect across the core reading surfaces.

Lighthouse coverage includes:

- home page `/` on mobile
- home page `/` on desktop
- post page `/{slug}` on mobile
- post page `/{slug}` on desktop

The home page reaches 100 for Accessibility, Best Practices, and SEO, with
performance tuned for repeated 95-100 scores. Post pages are structured with the
same SEO system: canonical URLs, article metadata, Open Graph tags, Twitter card
tags, JSON-LD, RSS, sitemap entries, descriptive text, alt handling, and crawlable
links.

## Stack

- SvelteKit
- Svelte 5
- SVX and mdsvex
- Tailwind CSS 4
- Pagefind
- Shiki
- Satori and Resvg
- TypeScript

## Source Layout

```text
src/        application code
static/     public assets
writings/   post folders
```

## Writing

Each post lives in its own folder:

```text
writings/my-post/
  index.svx
```

The folder name becomes the URL:

```text
/my-post
```

Posts can use `.svx` or `.md`:

```text
writings/my-post/index.svx
writings/my-post/index.md
```

Required frontmatter:

```md
---
title: My Post
description: Short description for previews and metadata.
publishedAt: 2026-06-10
tags: design, engineering
---
```

`publishedAt` uses `YYYY-MM-DD` format.

`tags` are comma-separated.

Optional cover fields:

```md
cover: ./cover.webp
coverAlt: Description of the cover image
```

If `cover` is omitted, the loader checks for `cover.*` for e.g. `.png`, `.jpg`,
`.webp`, in the post folder.

The Table of Contents is generated automatically. Do not add `## Table of Contents`
inside post files.

## Metadata

Metadata is generated from the post frontmatter and site config.

The app generates:

- document title
- description
- canonical URL
- Open Graph tags
- Twitter card tags
- JSON-LD
- RSS feed
- sitemap

Post Open Graph behavior:

- if a cover image exists, it is used as the social image
- if no cover exists, `/{slug}/og.png` is generated during the build

## Search

Search uses Pagefind.

The production build runs Pagefind after SvelteKit builds the static site. During
development, the search UI loads but Pagefind results are unavailable until a
production build exists.

## Commands

```sh
pnpm install
pnpm dev
pnpm check
pnpm lint
pnpm knip
pnpm build
pnpm preview
```

## Deployment

Vercel uses:

- build command: `pnpm build`
- output directory: `build`

Security headers are defined in `vercel.json`.

## Reference

[DESIGN.md](./DESIGN.md) documents routes, data flow, metadata generation, Open
Graph images, search behavior, layout, typography, color tokens, accessibility,
security headers, and release checks.
