<script lang="ts">
	import type { Post } from '$lib/types.js';
	import { formatDate } from '$lib/utils.js';

	interface Props {
		post: Post;
		featured?: boolean;
	}

	const { post, featured = false }: Props = $props();
</script>

<article class="post-card" class:featured>
	<a href="/{post.slug}" class="post-link" aria-label={post.title}>
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
				{#each post.tags.slice(0, 3) as tag (tag)}
					<span class="tag">{tag}</span>
				{/each}
			</div>
		{/if}
	</a>
</article>

<style>
	.post-card {
		padding: 1.75rem 0;
		border-bottom: 1px solid var(--color-border);
	}

	.post-card:first-child {
		padding-top: 1.75rem;
	}

	.post-card:last-child {
		border-bottom: 0;
		padding-bottom: 0;
	}

	.post-link {
		display: block;
		text-decoration: none;
		color: inherit;
		text-align: left;
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
		max-width: 52ch;
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
		.featured-title {
			font-size: var(--text-2xl);
		}
	}
</style>
