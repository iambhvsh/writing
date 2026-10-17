<script lang="ts">
	import type { PageData } from './$types.js';
	import Seo from '$lib/components/Seo.svelte';
	import Card from '$lib/components/Card.svelte';
	import Topics from '$lib/components/Topics.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { buildSeo } from '$lib/seo.js';
	import { siteConfig } from '$lib/config.js';
	import { onMount } from 'svelte';
	import { X } from '@lucide/svelte';

	interface Props {
		data: PageData;
	}
	const { data }: Props = $props();
	const seo = $derived(
		buildSeo({ path: '/', seoTitle: 'Bhavesh Patil – Writing', origin: data.origin })
	);

	let selectedTag = $state<string | null>(null);
	let visibleCount = $state(siteConfig.postsPerPage ?? 6);

	const topTags = $derived.by(() => {
		const counts: Record<string, number> = {};
		for (const post of data.posts) {
			for (const tag of post.tags) {
				counts[tag] = (counts[tag] ?? 0) + 1;
			}
		}
		return Object.entries(counts)
			.map(([tag, count]) => ({ tag, count }))
			.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
			.slice(0, 5);
	});

	const filteredPosts = $derived.by(() => {
		const tag = selectedTag;
		return tag ? data.posts.filter((p) => p.tags.includes(tag)) : data.posts;
	});
	const visiblePosts = $derived(filteredPosts.slice(0, visibleCount));
	let observer: IntersectionObserver;
	let sentinel: HTMLElement | undefined = $state();

	function handleTagSelect(tag: string | null) {
		selectedTag = tag;
		visibleCount = siteConfig.postsPerPage ?? 6;
	}

	onMount(() => {
		if (typeof IntersectionObserver !== 'undefined') {
			observer = new IntersectionObserver(
				(entries) => {
					const entry = entries[0];
					if (entry?.isIntersecting) {
						visibleCount = Math.min(
							visibleCount + (siteConfig.postsPerPage ?? 6),
							filteredPosts.length
						);
					}
				},
				{ rootMargin: '200px' }
			);
		}

		return () => {
			if (observer) observer.disconnect();
		};
	});

	$effect(() => {
		if (observer && sentinel) {
			observer.observe(sentinel);
		}
	});
</script>

<Seo {seo} />

<div class="home-page">
	<div class="home-layout-container">
		<!-- Left: Topics / Sections (Fixed on Desktop) -->
		<aside class="home-left-col" aria-label="Sections and topics">
			<Topics
				posts={data.posts}
				activeTag={selectedTag}
				ontagselect={handleTagSelect}
			/>
		</aside>

		<!-- Center: Main Content Column -->
		<div class="home-center-col">
			<header class="home-header">
				<div class="home-title-row">
					<h1 class="home-title">Writing</h1>
					<span class="home-count">{filteredPosts.length} essays</span>
				</div>
				<p class="home-desc">{siteConfig.description}</p>
			</header>

			<!-- Mobile Topics Bar (< 1280px) -->
			<div class="mobile-topics-bar" aria-label="Filter topics">
				<button
					type="button"
					class="mobile-topic-chip"
					class:active={!selectedTag}
					onclick={() => {
						handleTagSelect(null);
					}}
				>
					All ({data.posts.length})
				</button>
				{#each topTags as { tag, count } (tag)}
					<button
						type="button"
						class="mobile-topic-chip"
						class:active={selectedTag === tag}
						onclick={() => {
							handleTagSelect(selectedTag === tag ? null : tag);
						}}
					>
						{tag} ({count})
					</button>
				{/each}
			</div>

			{#if selectedTag}
				<div class="filter-indicator">
					<span class="filter-text">Topic: <strong>{selectedTag}</strong> ({filteredPosts.length})</span>
					<button type="button" class="clear-filter-btn" onclick={() => { handleTagSelect(null); }}>
						<X size={12} />
						<span>Clear</span>
					</button>
				</div>
			{/if}

			{#if filteredPosts.length > 0}
				<section class="posts-section" aria-label="Recent posts">
					{#each visiblePosts as post, i (post.slug)}
						<Card {post} featured={i === 0 && !selectedTag} />
					{/each}
				</section>

				{#if visibleCount < filteredPosts.length}
					<div bind:this={sentinel} class="sentinel" aria-hidden="true" style="height: 1px;"></div>
				{/if}
			{:else}
				<p class="empty-state">No posts found for this topic.</p>
			{/if}
		</div>

		<!-- Right: Author Profile & RSS (Fixed on Desktop) -->
		<div class="home-right-col">
			<Sidebar />
		</div>
	</div>
</div>

<style>
	.home-page {
		width: 100%;
	}

	.home-layout-container {
		max-width: 1040px;
		margin: 0 auto;
		padding: 2rem 1.5rem 4rem;
		position: relative;
	}

	.home-left-col {
		display: none;
	}

	.home-right-col {
		display: none;
	}

	.home-center-col {
		width: 100%;
		max-width: 820px;
		margin: 0 auto;
		min-width: 0;
	}

	.home-header {
		border-bottom: 1px solid var(--color-border);
		padding-bottom: 1.75rem;
		margin-bottom: 1rem;
		text-align: left;
	}

	.home-title-row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 0.5rem;
	}

	.home-title {
		font-family: var(--font-serif);
		font-size: clamp(2rem, 5vw, 2.75rem);
		font-weight: 400;
		letter-spacing: var(--tracking-tight);
		line-height: var(--leading-tight);
		color: var(--color-text-primary);
		margin: 0;
	}

	.home-count {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
	}

	.home-desc {
		font-size: var(--text-base);
		color: var(--color-text-secondary);
		line-height: var(--leading-relaxed);
		margin: 0;
	}

	.mobile-topics-bar {
		display: flex;
		gap: 0.375rem;
		overflow-x: auto;
		padding: 0.75rem 0;
		margin-bottom: 0.5rem;
		scrollbar-width: none;
	}
	.mobile-topics-bar::-webkit-scrollbar {
		display: none;
	}

	.mobile-topic-chip {
		display: inline-flex;
		align-items: center;
		white-space: nowrap;
		padding: 0.25rem 0.625rem;
		font-size: 0.75rem;
		color: var(--color-text-secondary);
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-full);
		cursor: pointer;
		transition:
			color var(--duration-fast) var(--ease-base),
			border-color var(--duration-fast) var(--ease-base);
	}

	.mobile-topic-chip:hover {
		color: var(--color-text-primary);
		border-color: var(--color-border-strong);
	}

	.mobile-topic-chip.active {
		color: var(--color-text-inverse);
		background-color: var(--color-text-primary);
		border-color: var(--color-text-primary);
	}

	.filter-indicator {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
		padding: 0.5rem 0.875rem;
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
	}

	.filter-text {
		font-size: var(--text-xs);
		color: var(--color-text-secondary);
	}

	.filter-text strong {
		color: var(--color-text-primary);
	}

	.clear-filter-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.6875rem;
		color: var(--color-text-secondary);
		background-color: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		padding: 0.125rem 0.375rem;
		cursor: pointer;
		transition: color var(--duration-fast) var(--ease-base);
	}

	.clear-filter-btn:hover {
		color: var(--color-text-primary);
		border-color: var(--color-border-strong);
	}

	.posts-section {
		padding-top: 0;
	}

	.empty-state {
		padding: 3rem 0;
		font-size: var(--text-base);
		color: var(--color-text-tertiary);
		text-align: center;
	}

	@media (min-width: 1280px) {
		.home-layout-container {
			max-width: 1440px;
			padding-left: calc(224px + 2rem);
			padding-right: calc(260px + 2rem);
		}

		.mobile-topics-bar {
			display: none;
		}

		.home-left-col {
			display: block;
			position: fixed;
			top: 4.5rem;
			left: max(1.5rem, calc(50vw - 720px + 1.5rem));
			width: 224px;
			max-height: calc(100vh - 5.5rem);
			overflow-y: auto;
			z-index: 20;
		}

		.home-right-col {
			display: block;
			position: fixed;
			top: 4.5rem;
			right: max(1.5rem, calc(50vw - 720px + 1.5rem));
			width: 260px;
			max-height: calc(100vh - 5.5rem);
			overflow-y: auto;
			z-index: 20;
		}

		.home-center-col {
			max-width: 820px;
			margin: 0 auto;
		}
	}
</style>
