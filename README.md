# Bhavesh Patil Writing

A personal writing site for essays, notes, and ideas on design, engineering, and craft.

Designed to be focused, fast, and precise. The reading experience is shaped with the same care as the writing itself.

## Overview

This repository powers `writing.iambhvsh.in`.

The site is built with SvelteKit and SVX, with a structure made for writing, editing, and publishing personal essays with clarity.

## Content Structure

Writing lives in `writings/`.

Each piece has its own folder:

```text
writings/
  introducing-writing/
    index.svx
```

Supporting assets can live beside the essay they support:

```text
writings/my-essay/
  index.svx
  cover.webp
  diagram.png
```

The folder name becomes the public URL.

```text
writings/my-essay/index.svx
```

becomes:

```text
/my-essay
```

## Frontmatter

Each essay begins with frontmatter:

```md
---
title: My Essay
description: A short description for previews and metadata.
tags:
  - design
  - engineering
---
```

Optional fields:

```md
cover: ./cover.webp
coverAlt: Description of the cover image
```

The published date is generated from the writing file.

## Design

The design system is quiet, intentional, and text-led.

Typography, spacing, color, search, navigation, and metadata are treated as part of the writing experience. The goal is not decoration. The goal is clarity.

Detailed design notes live in `DESIGN_SYSTEM.md`.

## Metadata

The site generates page metadata from the same source as the rendered content.

Each essay includes:

- document title
- description
- canonical URL
- Open Graph metadata
- Twitter card metadata
- JSON-LD

RSS and sitemap entries are generated automatically.

## Search

Search is powered by Pagefind and generated during the production build.

## Commands

Install dependencies:

```sh
pnpm install
```

Start development:

```sh
pnpm dev
```

Run project checks:

```sh
pnpm check
```

Run lint:

```sh
pnpm lint
```

Build:

```sh
pnpm build
```

Preview:

```sh
pnpm preview
```

## Stack

- SvelteKit
- Svelte 5
- SVX
- Tailwind CSS
- Shiki
- Pagefind
- TypeScript

## Deployment

The site builds to static output in `build/`.

## Author

Bhavesh Patil
