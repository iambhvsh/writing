<script lang="ts">
	import type { PageData } from './$types.js';
	import Seo from '$lib/components/Seo.svelte';
	import TagBadge from '$lib/components/TagBadge.svelte';
	import { buildSeo } from '$lib/seo.js';
	import { formatDate } from '$lib/utils.js';
	import { siteConfig } from '$lib/config.js';

	interface Props {
		data: PageData;
	}
	const { data }: Props = $props();

	const seo = $derived(
		buildSeo({
			title: data.post.title,
			description: data.post.description,
			path: `/${data.post.slug}`,
			origin: data.origin,
			post: data.post,
		})
	);

	const PostContent = $derived(data.component);
	const avatarUrl = 'https://db.iambhvsh.in/assets/profile.webp';
</script>

<Seo {seo} />

<a href="#article-body" class="skip-link">Skip to content</a>

<div class="post-page" data-pagefind-body>
	<header class="post-header">
		<div class="post-header-inner">
			{#if data.post.cover}
				<img
					src={data.post.cover}
					alt={data.post.coverAlt ?? ''}
					class="post-cover"
					loading="eager"
					decoding="async"
				/>
			{/if}
			<div class="post-meta-row">
				<time datetime={data.post.publishedAt} class="post-date">
					{formatDate(data.post.publishedAt)}
				</time>
				<span class="dot" aria-hidden="true">·</span>
				<span class="reading-time">{data.post.readingTime} min read</span>
			</div>
			<h1 class="post-title" data-pagefind-meta="title">{data.post.title}</h1>
			<p class="post-description">{data.post.description}</p>
			{#if data.post.tags.length > 0}
				<div class="post-tags" aria-label="Tags">
					{#each data.post.tags as tag (tag)}
						<TagBadge {tag} />
					{/each}
				</div>
			{/if}

			<div class="post-author">
				<img
					src={`${avatarUrl}?width=40&height=40&fit=cover&quality=80&format=webp`}
					srcset={`${avatarUrl}?width=40&height=40&fit=cover&quality=80&format=webp 1x, ${avatarUrl}?width=80&height=80&fit=cover&quality=80&format=webp 2x`}
					alt=""
					width="40"
					height="40"
					class="author-avatar"
					loading="lazy"
					decoding="async"
				/>
				<span class="author-name">{siteConfig.author}</span>
			</div>
		</div>
	</header>

	<div class="post-body-wrap">
		<article class="post-body" id="article-body">
			<div class="prose prose-lg">
				<PostContent />
			</div>
		</article>
	</div>
</div>

<style>
	.skip-link {
		position: absolute;
		top: -100%;
		left: 1rem;
		padding: 0.5rem 1rem;
		background: var(--color-text-primary);
		color: var(--color-text-inverse);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		text-decoration: none;
		z-index: 200;
		transition: top var(--duration-fast) var(--ease-base);
	}
	.skip-link:focus {
		top: 1rem;
	}
	.post-page {
		width: 100%;
	}
	.post-header {
		border-bottom: 1px solid var(--color-border);
		padding-bottom: 2.25rem;
		text-align: center;
	}
	.post-header-inner {
		max-width: 48rem;
		margin: 0 auto;
		padding: 3rem 1.5rem 0;
	}
	.post-cover {
		display: block;
		width: 100%;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		margin: 0 0 2rem;
		border: 1px solid var(--color-border);
		border-radius: 0.875rem;
		background-color: var(--color-surface);
	}
	.post-meta-row {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1.25rem;
	}
	.post-date,
	.reading-time {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
	}
	.dot {
		color: var(--color-text-secondary);
		font-size: var(--text-xs);
	}
	.post-title {
		font-family: var(--font-serif);
		font-size: clamp(2rem, 5vw, 3rem);
		font-weight: 400;
		letter-spacing: var(--tracking-tight);
		line-height: var(--leading-tight);
		margin: 0 0 1rem;
		color: var(--color-text-primary);
	}
	.post-description {
		font-size: var(--text-lg);
		color: var(--color-text-secondary);
		line-height: var(--leading-relaxed);
		margin: 0 auto 1.25rem;
		max-width: 52ch;
	}
	.post-tags {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.375rem;
	}
	.post-author {
		display: inline-flex;
		align-items: center;
		gap: 0.625rem;
		margin-top: 1.5rem;
	}
	.author-avatar {
		width: 2rem;
		height: 2rem;
		border-radius: var(--radius-full);
		border: 1px solid var(--color-border);
		object-fit: cover;
		background-color: var(--color-surface);
	}
	.author-name {
		font-size: var(--text-base);
		font-weight: 550;
		color: var(--color-text-primary);
	}
	.post-body-wrap {
		max-width: 48rem;
		margin: 0 auto;
		padding: 0 1.5rem;
	}
	.post-body {
		padding: 2.5rem 0 1rem;
	}
</style>
