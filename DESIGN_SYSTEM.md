# Bhavesh Patil - Writing Design System

This document is the source of truth for `writing.iambhvsh.in`.

It is written for people, maintainers, and LLM agents working in this codebase. Use it to preserve the tone, structure, and behavior of the site.

## Product Direction

Bhavesh Patil Writing is a personal writing site for essays, notes, and ideas on design, engineering, and craft.

The site is designed to be focused, fast, and precise. The reading experience is shaped with the same care as the writing itself.

Design is not decoration here. Typography, spacing, search, navigation, metadata, and motion are part of how the writing works.

## Core Principles

| Principle | Meaning |
|---|---|
| Focused | The page should guide attention toward the writing. |
| Precise | Every visual decision should have a reason. |
| Quiet | Avoid noise, excess contrast, and ornamental surfaces. |
| Personal | The site should feel authored, not generic. |
| Fast | Static output, minimal runtime, and no unnecessary work. |
| Text-led | Typography and rhythm define the experience. |
| Durable | Prefer clear patterns over fashionable effects. |

## Language

Use formal, personal wording.

Preferred tone:

- clear
- composed
- direct
- confident
- warm without being casual

Avoid:

- marketing copy
- defensive explanations
- jokes
- hype
- vague product language
- implementation details in user-facing copy
- em dashes

Good copy should feel like it belongs to a personal site with careful taste.

## Information Architecture

Public routes:

```text
/
/{slug}
/rss.xml
/sitemap.xml
```

Writing source:

```text
writings/
  post-slug/
    index.svx
    cover.webp
    diagram.png
```

The folder name becomes the public slug.

All writing folders are included by default. Do not add a publish flag.

The published date is generated from the writing file through the Vite virtual module in `vite.config.ts`. Do not add `publishedAt` or `updatedAt` to frontmatter.

## Writing Frontmatter

Required:

```md
---
title: My Essay
description: A short description for previews and metadata.
tags:
  - design
  - engineering
---
```

Optional:

```md
cover: ./cover.webp
coverAlt: Description of the cover image
```

Cover images are shown only on the post page. They also become the social preview image for that post when available.

## Visual Identity

The visual system is quiet, intentional, and text-led.

The site uses:

- Inter for interface text, metadata, and body UI
- Instrument Serif for wordmark, display headings, post titles, and prose headings
- warm neutral color tokens
- restrained borders
- light and dark themes
- small, predictable interaction states

Do not introduce decorative gradients, ornamental blobs, oversized cards, or visual effects that compete with the writing.

## Tokens

Design tokens live in `src/app.css` under `@theme`.

Use tokens before adding new values. Add a token only when the value is reusable and part of the system.

### Typography

| Token | Value | Use |
|---|---:|---|
| `--font-sans` | Inter | UI, metadata, body interface text |
| `--font-serif` | Instrument Serif | Wordmark, hero title, post titles, prose headings |
| `--font-mono` | system monospace | Code |
| `--text-xs` | 0.75rem | Dates, tags, metadata |
| `--text-sm` | 0.8125rem | Compact UI |
| `--text-base` | 1rem | Body UI |
| `--text-lg` | 1.125rem | Descriptions |
| `--text-xl` | 1.25rem | Wordmark, blockquotes |
| `--text-2xl` | 1.5rem | Post card titles |
| `--text-3xl` | 1.875rem | Featured post title |
| `--text-4xl` | 2.25rem | Reserved display scale |
| `--text-5xl` | 3rem | Reserved display scale |

Large headings may use `clamp()`.

Do not scale text with viewport width outside established display headings.

### Leading

| Token | Value | Use |
|---|---:|---|
| `--leading-tight` | 1.2 | Hero and post titles |
| `--leading-snug` | 1.375 | Card titles |
| `--leading-normal` | 1.5 | Default |
| `--leading-relaxed` | 1.65 | Descriptions and prose |
| `--leading-loose` | 1.8 | Reserved long-form rhythm |

### Tracking

| Token | Value | Use |
|---|---:|---|
| `--tracking-tight` | -0.025em | Serif display headings |
| `--tracking-normal` | 0 | Default |
| `--tracking-wide` | 0.025em | Dates and tags |
| `--tracking-wider` | 0.05em | UI labels |
| `--tracking-widest` | 0.1em | Eyebrows |

### Spacing

Use the 8px rhythm.

| Token | Value |
|---|---:|
| `--spacing-xs` | 0.25rem |
| `--spacing-sm` | 0.5rem |
| `--spacing-md` | 1rem |
| `--spacing-lg` | 1.5rem |
| `--spacing-xl` | 2rem |
| `--spacing-2xl` | 3rem |
| `--spacing-3xl` | 4rem |
| `--spacing-4xl` | 6rem |

### Radius

| Token | Value | Use |
|---|---:|---|
| `--radius-sm` | 0.25rem | Inline code, small details |
| `--radius-md` | 0.5rem | Buttons and compact controls |
| `--radius-lg` | 0.75rem | Modals and code blocks |
| `--radius-full` | 9999px | Tags and avatars |

Post covers currently use `0.875rem` for a slightly more composed image treatment.

### Motion

| Token | Value | Use |
|---|---:|---|
| `--duration-fast` | 120ms | Hover and focus transitions |
| `--duration-base` | 200ms | General transitions |
| `--duration-slow` | 300ms | Theme color transitions |
| `--ease-base` | cubic-bezier(0.4, 0, 0.2, 1) | Default easing |
| `--ease-out` | cubic-bezier(0, 0, 0.2, 1) | Reserved entering motion |

Respect `prefers-reduced-motion`. The global rule collapses motion for users who request it.

## Color System

The palette is warm neutral, not cold gray.

### Light Theme

| Token | Value |
|---|---|
| `--color-bg` | `#f5f4f0` |
| `--color-surface` | `#ffffff` |
| `--color-surface-hover` | `#fafaf8` |
| `--color-border` | `rgba(0, 0, 0, 0.06)` |
| `--color-border-strong` | `rgba(0, 0, 0, 0.1)` |
| `--color-text-primary` | `#0f0f0e` |
| `--color-text-secondary` | `#6b6b67` |
| `--color-text-tertiary` | `#a8a8a3` |
| `--color-text-inverse` | `#f5f4f0` |
| `--color-accent` | `#0f0f0e` |
| `--color-accent-hover` | `#6b6b67` |
| `--color-code-bg` | `#161614` |
| `--color-code-text` | `#e8e5e0` |

### Dark Theme

| Token | Value |
|---|---|
| `--color-bg` | `#000000` |
| `--color-surface` | `#0b0b0b` |
| `--color-surface-hover` | `#111111` |
| `--color-border` | `rgba(255, 255, 255, 0.05)` |
| `--color-border-strong` | `rgba(255, 255, 255, 0.09)` |
| `--color-text-primary` | `#f0efeb` |
| `--color-text-secondary` | `#8a8a85` |
| `--color-text-tertiary` | `#555552` |
| `--color-text-inverse` | `#000000` |
| `--color-accent` | `#f0efeb` |
| `--color-accent-hover` | `#8a8a85` |
| `--color-code-bg` | `#0c0b0a` |
| `--color-code-text` | `#ede8df` |

Theme is controlled by `data-theme` on `<html>`. The header stores the preference in `localStorage` and falls back to `prefers-color-scheme`.

## Layout

Use a narrow reading measure.

| Area | Width |
|---|---:|
| Home container | `48rem` |
| Post header inner | `48rem` |
| Post body wrapper | `48rem` |
| Header inner | `72rem` |

Main horizontal padding is `1.5rem`.

Avoid wide, card-heavy page sections. The site should feel like a writing surface, not a dashboard.

## Components

### Header

File: `src/lib/components/Header.svelte`

- Sticky at the top.
- Uses a blurred background mixed with `--color-bg`.
- Contains the serif wordmark, search, and theme toggle.
- Icon buttons are `2rem` square.
- Hover states use `--color-surface` and `--color-border`.

### Home Page

File: `src/routes/+page.svelte`

- Avatar: remote profile image, `88px` square, circular, without border or shadow.
- Visible title: `siteConfig.title` followed by ` - Writing`.
- SEO title: `Bhavesh Patil - Writing`.
- Recent posts are rendered as a simple vertical list.

The home page should not become a landing page. It is the index for the writing.

### Post Card

File: `src/lib/components/PostCard.svelte`

- Full-width list item with a bottom divider.
- Date and reading time appear in uppercase metadata.
- Separator dot uses `--color-text-secondary`.
- Title uses Instrument Serif.
- Featured first post uses `--text-3xl`, reduced on small screens.
- Tags are small lowercase pills.

### Post Page

File: `src/routes/[slug]/+page.svelte`

- Optional cover appears above metadata, title, and description.
- Cover uses `16 / 9`, `object-fit: cover`, a border, and `0.875rem` radius.
- Metadata shows generated published date and reading time.
- Tags appear below the description.
- Author row appears below tags.
- Body uses `prose prose-lg`.

### Search

File: `src/lib/components/Search.svelte`

- Icon-only trigger in the header.
- Keyboard shortcut: `Cmd/Ctrl + K`.
- Escape closes search.
- Pagefind loads only outside development.
- The modal uses a soft backdrop and a bordered surface.
- Empty state says search is available after build when Pagefind is not present.

### Tags

Files:

- `src/lib/components/TagBadge.svelte`
- `src/lib/components/PostCard.svelte`

Tags are compact, lowercase, and quiet. They support scanning without pulling attention from the title.

### Cover Images

Cover images are optional.

Frontmatter:

```md
cover: ./cover.webp
coverAlt: Description of the cover image
```

Local cover files live beside the essay. Remote and absolute URLs are also supported.

If no cover is present, no placeholder is rendered.

## Prose

Prose styles are configured in `src/app.css` through Tailwind Typography variables.

Current behavior:

- Body uses `--color-text-secondary`.
- Headings use `--color-text-primary`.
- Links are underlined with a subtle underline color.
- List markers use `--color-text-secondary`.
- Inline code uses a surface background and border.
- Code blocks use Shiki output with a dark background.
- Blockquotes use Instrument Serif italic and a left border.

The generated in-article Table of Contents receives special treatment:

- TOC item text is darker than body metadata.
- Underlines are lighter than the text.
- Bullets remain visible in both themes.

## Metadata And SEO

File: `src/lib/seo.ts`

Every page receives:

- document title
- description
- canonical URL
- Open Graph metadata
- Twitter card metadata
- JSON-LD

Posts receive:

- `article` Open Graph type
- `article:published_time`
- author
- tags
- `BlogPosting` JSON-LD

Home receives:

- `WebSite` JSON-LD

When a post has a cover, the cover becomes its social image. Otherwise the site fallback image is used.

## Search And Indexing

Search is powered by Pagefind after production build.

The article page has `data-pagefind-body` on the post page container. Post titles use `data-pagefind-meta="title"`.

Do not add search-specific copy to the UI unless it helps the user search.

## Accessibility

Required behavior:

- Keep semantic landmarks: `header`, `main`, `article`, `footer`, `time`.
- Keep the skip link on post pages.
- Icon-only buttons need clear `aria-label` values.
- Decorative images should use empty `alt`.
- Informative cover images should use `coverAlt`.
- Focus states must remain visible.
- Color contrast must remain readable in both themes.
- Motion must respect `prefers-reduced-motion`.

## Implementation Rules For Agents

Follow these rules when modifying the site:

1. Use existing tokens before adding new CSS values.
2. Keep layouts narrow and text-led.
3. Do not add decorative cards around page sections.
4. Do not add gradients, blobs, or ornamental backgrounds.
5. Do not add publish flags, manual dates, or update dates to writing frontmatter.
6. Keep writing in `writings/<slug>/index.svx`.
7. Keep assets beside the essay they support.
8. Keep user-facing copy formal, personal, and precise.
9. Keep metadata generated from the same source as the page content.
10. Do not create new generated files for writing metadata.
11. Do not expose production sourcemaps.
12. Update this document when the system changes.

## Validation

Preferred checks after changes:

```sh
pnpm lint
pnpm check
pnpm build:no-search
```

Use visual verification when changing layout, covers, search, theme, or article typography.
