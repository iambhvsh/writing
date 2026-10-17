<script lang="ts">
	import type { PageData } from './$types.js';
	import type { Component } from 'svelte';
	import Seo from '$lib/components/Seo.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import Toc from '$lib/components/Toc.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { buildSeo } from '$lib/seo.js';
	import { formatDate } from '$lib/utils.js';
	import { siteConfig } from '$lib/config.js';
	import { Link2, Check, Volume2, VolumeX } from '@lucide/svelte';

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

	const PostContent = $derived(data.component as Component);

	let copied = $state(false);
	let speaking = $state(false);

	async function copyArticleLink() {
		if (typeof window === 'undefined') return;
		try {
			await navigator.clipboard.writeText(window.location.href);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch {
			// Ignore
		}
	}

	function toggleSpeech() {
		if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
		if (speaking) {
			window.speechSynthesis.cancel();
			speaking = false;
		} else {
			const bodyEl = document.getElementById('article-body');
			const text = bodyEl?.innerText ?? data.post.description ?? '';
			const utterance = new SpeechSynthesisUtterance(text);
			utterance.onend = () => {
				speaking = false;
			};
			utterance.onerror = () => {
				speaking = false;
			};
			speaking = true;
			window.speechSynthesis.speak(utterance);
		}
	}

	const shareOnXUrl = $derived.by(() => {
		if (typeof window === 'undefined') return '';
		const text = encodeURIComponent(`"${data.post.title}" by ${siteConfig.twitter}`);
		const url = encodeURIComponent(window.location.href);
		return `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
	});
</script>

<Seo {seo} />

<a href="#article-body" class="skip-link">Skip to content</a>

<div class="post-page" data-pagefind-body>
	<div class="post-layout-container">
		<!-- Left: Table of Contents (Fixed) -->
		<aside class="post-left-col" aria-label="Table of contents">
			<Toc containerSelector="#article-body" />
		</aside>

		<!-- Center: Article Body & Header -->
		<div class="post-center-col">
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

					<div class="title-action-row">
						<h1 class="post-title" data-pagefind-meta="title">{data.post.title}</h1>
						<div class="header-action-buttons" aria-label="Article actions">
							<button
								type="button"
								class="header-icon-btn"
								class:speaking={speaking}
								onclick={toggleSpeech}
								aria-label={speaking ? 'Stop listening' : 'Listen to article'}
								title={speaking ? 'Stop listening' : 'Listen to article'}
							>
								{#if speaking}
									<VolumeX size={15} />
								{:else}
									<Volume2 size={15} />
								{/if}
							</button>
							<button
								type="button"
								class="header-icon-btn"
								onclick={copyArticleLink}
								aria-label="Copy link to article"
								title={copied ? 'Link copied!' : 'Copy link'}
							>
								{#if copied}
									<Check size={15} class="action-copied" />
								{:else}
									<Link2 size={15} />
								{/if}
							</button>
							<a
								href={shareOnXUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="header-icon-btn"
								aria-label="Share on X"
								title="Share on X"
							>
								<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
									<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
								</svg>
							</a>
						</div>
					</div>

					<div class="post-meta-row">
						<span class="meta-status" aria-hidden="true">
							<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<circle cx="12" cy="12" r="10"/>
								<path d="m9 12 2 2 4-4"/>
							</svg>
						</span>
						<time datetime={data.post.publishedAt} class="post-date">
							{formatDate(data.post.publishedAt)}
						</time>
						<span class="dot" aria-hidden="true">·</span>
						<span class="reading-time">{data.post.readingTime} min read</span>
						<span class="dot" aria-hidden="true">·</span>
						<span class="author-attribution">by {siteConfig.author}</span>
					</div>

					{#if data.post.description}
						<p class="post-description">{data.post.description}</p>
					{/if}

					{#if data.post.tags.length > 0}
						<div class="post-tags" aria-label="Tags">
							{#each data.post.tags as tag (tag)}
								<Badge {tag} />
							{/each}
						</div>
					{/if}
				</div>
			</header>

			<article class="post-body" id="article-body">
				<div class="prose prose-lg">
					<PostContent />
				</div>
			</article>
		</div>

		<!-- Right: Tools, Progress, Series, & Author (Fixed) -->
		<div class="post-right-col">
			<Sidebar
				prevPost={data.prevPost}
				nextPost={data.nextPost}
			/>
		</div>
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

	.post-layout-container {
		max-width: 1040px;
		margin: 0 auto;
		padding: 2rem 1.5rem 4rem;
		position: relative;
	}

	.post-header {
		border-bottom: 1px solid var(--color-border);
		padding-bottom: 2rem;
		margin-bottom: 2.25rem;
		text-align: left;
	}
	.post-header-inner {
		width: 100%;
	}
	.post-cover {
		display: block;
		width: 100%;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		margin: 0 0 1.75rem;
		border: 1px solid var(--color-border);
		border-radius: 0.875rem;
		background-color: var(--color-surface);
	}
	.title-action-row {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1.5rem;
		margin-bottom: 0.625rem;
	}

	.header-action-buttons {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		margin-top: 0.375rem;
		flex-shrink: 0;
	}

	.header-icon-btn {
		width: 2rem;
		height: 2rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: var(--color-text-secondary);
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		cursor: pointer;
		text-decoration: none;
		transition:
			color var(--duration-fast) var(--ease-base),
			border-color var(--duration-fast) var(--ease-base),
			background-color var(--duration-fast) var(--ease-base);
	}

	.header-icon-btn:hover {
		color: var(--color-text-primary);
		border-color: var(--color-border-strong);
		background-color: var(--color-surface-hover);
	}

	.header-icon-btn.speaking {
		color: var(--color-text-primary);
		border-color: var(--color-text-primary);
		background-color: var(--color-surface-hover);
	}

	:global(.action-copied) {
		color: var(--color-code-btn-copied, #16a34a);
	}

	.meta-status {
		display: inline-flex;
		align-items: center;
		color: var(--color-text-tertiary);
	}

	.author-attribution {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
		letter-spacing: var(--tracking-normal);
	}

	.post-meta-row {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1.125rem;
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
		font-size: clamp(2rem, 5vw, 2.75rem);
		font-weight: 400;
		letter-spacing: var(--tracking-tight);
		line-height: var(--leading-tight);
		margin: 0;
		color: var(--color-text-primary);
	}
	.post-description {
		font-size: var(--text-lg);
		color: var(--color-text-secondary);
		line-height: var(--leading-relaxed);
		margin: 0 0 1.25rem;
	}
	.post-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
	}

	.post-left-col {
		display: none;
	}

	.post-right-col {
		display: none;
	}

	.post-center-col {
		width: 100%;
		max-width: 820px;
		margin: 0 auto;
		min-width: 0;
	}

	.post-body {
		padding: 0;
	}

	@media (min-width: 1280px) {
		.post-layout-container {
			max-width: 1440px;
			padding-left: calc(224px + 2.5rem);
			padding-right: calc(260px + 2.5rem);
		}

		.post-left-col {
			display: block;
			position: fixed;
			top: 4.5rem;
			left: max(1.5rem, calc(50vw - 720px + 1.5rem));
			width: 224px;
			max-height: calc(100vh - 5.5rem);
			overflow-y: auto;
			z-index: 20;
		}

		.post-right-col {
			display: block;
			position: fixed;
			top: 4.5rem;
			right: max(1.5rem, calc(50vw - 720px + 1.5rem));
			width: 260px;
			max-height: calc(100vh - 5.5rem);
			overflow-y: auto;
			z-index: 20;
		}

		.post-center-col {
			max-width: 820px;
			margin: 0 auto;
		}
	}
</style>
