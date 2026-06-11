# Bhavesh Patil – Writing

Personal writing site for essays, notes, and ideas on design, engineering, and craft.

For detailed design, routing, metadata, accessibility, and implementation notes, see
[DESIGN.md](./DESIGN.md).

## Stack

- SvelteKit
- Svelte 5
- SVX and mdsvex
- Tailwind CSS 4
- Pagefind
- Shiki
- Satori and Resvg for Open Graph images
- TypeScript

## Source Layout

```text
src/        application code
static/     public assets
writings/   post folders
```

See [DESIGN.md](./DESIGN.md) for the full route map and component-level reference.

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

Required frontmatter:

```md
---
title: My Post
description: Short description for previews and metadata.
publishedAt: 2026-06-10
tags: design, engineering
---
```

`publishedAt` uses `YYYY-MM-DD` format. Set it when the post is created.

`tags` Comma-separated.

Optional cover fields:

```md
cover: ./cover.png
coverAlt: Description of the cover image
```

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

If `cover` is omitted, the loader checks for `cover.*` for e.g. .png, .jpg, .webp, in the post folder.

## Search

Search uses Pagefind.

The production build runs Pagefind after SvelteKit builds the static site. During development, the search UI loads but Pagefind results are unavailable until a production build exists.

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
