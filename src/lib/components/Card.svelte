<script lang="ts">
	import type { PostPreview } from '$lib/types.js';
	import { formatDate } from '$lib/utils.js';

	interface Props {
		post: PostPreview;
		featured?: boolean;
	}

	const { post, featured = false }: Props = $props();
</script>

<article class="post-card" class:featured>
	<a href="/{post.slug}" class="post-link" aria-label={post.title}>
		<div class="post-content">
			<div class="post-meta">
				<time datetime={post.publishedAt} class="post-date">
					{formatDate(post.publishedAt)}
				</time>
				<span class="post-dot" aria-hidden="true">·</span>
				<span class="post-reading">{post.readingTime} min read</span>
			</div>

			<h2 class="post-title" class:featured-title={featured}>
				{post.title}
			</h2>

			<p class="post-description">
				{post.description}
			</p>

			{#if post.tags.length > 0}
				<div class="post-tags" aria-label="Tags">
					{#each post.tags.slice(0, 4) as tag (tag)}
						<span class="tag">{tag}</span>
					{/each}
				</div>
			{/if}
		</div>

		{#if post.cover}
			<div class="post-cover-wrap">
				<img
					src={post.cover}
					alt={post.coverAlt ?? post.title}
					class="post-thumbnail"
					loading="lazy"
					decoding="async"
				/>
			</div>
		{/if}
	</a>
</article>

<style>
	.post-card {
		padding: 1.875rem 0;
		border-bottom: 1px solid var(--color-border);
	}

	.post-card:first-child {
		padding-top: 1.5rem;
	}

	.post-card:last-child {
		border-bottom: 0;
		padding-bottom: 0;
	}

	.post-link {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1.75rem;
		text-decoration: none;
		color: inherit;
		text-align: left;
	}

	.post-content {
		flex: 1;
		min-width: 0;
	}

	.post-cover-wrap {
		width: 150px;
		height: 100px;
		flex-shrink: 0;
		border-radius: var(--radius-md);
		overflow: hidden;
		border: 1px solid var(--color-border);
		background-color: var(--color-surface);
	}

	.post-thumbnail {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform var(--duration-base) var(--ease-base);
	}

	.post-link:hover .post-thumbnail {
		transform: scale(1.04);
	}

	.post-meta {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.post-date,
	.post-reading {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
	}

	.post-dot {
		color: var(--color-text-secondary);
		font-size: var(--text-xs);
	}

	.post-title {
		font-family: var(--font-serif);
		font-size: var(--text-2xl);
		font-weight: 400;
		letter-spacing: var(--tracking-tight);
		line-height: var(--leading-snug);
		color: var(--color-text-primary);
		margin: 0 0 0.625rem;
		transition: opacity var(--duration-fast) var(--ease-base);
	}

	.post-link:hover .post-title {
		opacity: 0.65;
	}

	.featured-title {
		font-size: var(--text-3xl);
	}

	.post-description {
		font-size: var(--text-base);
		color: var(--color-text-secondary);
		line-height: var(--leading-relaxed);
		margin: 0 0 1rem;
		max-width: none;
	}

	.post-tags {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		gap: 0.375rem;
	}

	.tag {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-full);
		padding: 0.1875rem 0.625rem;
		letter-spacing: var(--tracking-wide);
		text-transform: lowercase;
		transition: background-color var(--duration-fast) var(--ease-base);
	}

	.post-link:hover .tag {
		background-color: var(--color-surface-hover);
	}

	@media (max-width: 640px) {
		.post-link {
			flex-direction: column-reverse;
			gap: 1rem;
		}

		.post-cover-wrap {
			width: 100%;
			height: auto;
			aspect-ratio: 16 / 9;
		}

		.featured-title {
			font-size: var(--text-2xl);
		}
	}
</style>
