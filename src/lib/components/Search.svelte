<script lang="ts">
	import { dev } from '$app/environment';
	import { onMount } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { Search as SearchIcon, X } from '@lucide/svelte';
	import {
		buildSearchExcerpt,
		normalizeResultUrl,
		type Pagefind,
		type SearchResultView,
	} from '$lib/search.js';

	function focusOnMount(node: HTMLElement) {
		if (window.matchMedia('(max-width: 640px)').matches) return;
		node.focus({ preventScroll: true });
	}

	let query = $state('');
	let results = $state<SearchResultView[]>([]);
	let loading = $state(false);
	let pagefind = $state<Pagefind | null>(null);
	let open = $state(false);
	let reducedMotion = $state(false);

	const searchMotion = $derived({
		duration: reducedMotion ? 1 : 180,
		easing: (t: number) => 1 - Math.pow(1 - t, 3),
	});

	onMount(async () => {
		reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (dev) return;

		try {
			const pagefindPath = new URL('/pagefind/pagefind.js', window.location.origin).pathname;
			const pf = (await import(/* @vite-ignore */ pagefindPath)) as Pagefind;
			await pf.options?.({ basePath: '/pagefind/', excerptLength: 50, noWorker: true });
			await pf.init?.();
			pagefind = pf;
		} catch {
			pagefind = null;
		}
	});

	$effect(() => {
		if (typeof document === 'undefined') return;
		if (!open) return;

		const originalOverflow = document.body.style.overflow;
		const originalOverscroll = document.body.style.overscrollBehavior;

		document.body.style.overflow = 'hidden';
		document.body.style.overscrollBehavior = 'contain';

		return () => {
			document.body.style.overflow = originalOverflow;
			document.body.style.overscrollBehavior = originalOverscroll;
		};
	});

	async function search() {
		if (!pagefind || query.trim().length < 2) {
			results = [];
			return;
		}
		loading = true;
		const response = pagefind.debouncedSearch
			? await pagefind.debouncedSearch(query, {}, 160)
			: await pagefind.search(query);
		if (!response) {
			loading = false;
			return;
		}

		const data = await Promise.all(response.results.slice(0, 8).map((r) => r.data()));
		results = data.map((item) => {
			const excerpt = buildSearchExcerpt(item, query);
			const result: SearchResultView = {
				url: normalizeResultUrl(item.url),
				title: item.meta.title ?? 'Post',
			};

			if (excerpt !== undefined) result.excerpt = excerpt;
			return result;
		});
		loading = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			open = false;
			query = '';
			results = [];
		}
		if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
			e.preventDefault();
			open = !open;
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="search-wrap">
	<button
		type="button"
		class="search-trigger"
		onclick={(e) => {
			e.preventDefault();
			open = !open;
		}}
		aria-label="Search posts (⌘K)"
		aria-expanded={open}
	>
		<SearchIcon size={17} strokeWidth={1.8} />
	</button>

	{#if open}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="search-backdrop"
			transition:fade={{ duration: reducedMotion ? 1 : 160 }}
			onclick={() => {
				open = false;
			}}
		></div>
		<div
			class="search-modal"
			transition:scale={{ ...searchMotion, start: 0.985, opacity: 0 }}
			role="dialog"
			aria-label="Search"
			aria-modal="true"
			tabindex="-1"
			onpointerdown={(e) => {
				e.stopPropagation();
			}}
		>
			<div class="search-input-wrap">
				<SearchIcon size={17} strokeWidth={1.8} />
				<input
					type="search"
					class="search-input"
					placeholder="Search writing"
					bind:value={query}
					oninput={search}
					use:focusOnMount
					aria-label="Search writing"
				/>
				{#if loading}<span class="search-loading" aria-live="polite" aria-busy="true">…</span>{/if}
				<button
					type="button"
					class="search-close"
					aria-label="Close search"
					onclick={() => {
						open = false;
					}}
				>
					<X size={16} strokeWidth={1.8} />
				</button>
			</div>
			{#if results.length > 0}
				<ul class="search-results" role="listbox" aria-label="Search results">
					{#each results as result (result.url)}
						<li role="option" aria-selected="false" transition:fly={{ ...searchMotion, y: 8 }}>
							<a
								href={result.url}
								class="search-result"
								onclick={() => {
									open = false;
								}}
							>
								<span class="result-title">{result.title}</span>
								{#if result.excerpt}
									<span class="result-excerpt">{@html result.excerpt}</span>
								{/if}
							</a>
						</li>
					{/each}
				</ul>
			{:else if !pagefind}
				<p class="search-empty">Search available after build.</p>
			{:else if query.length > 1 && !loading}
				<p class="search-empty">No results for "{query}"</p>
			{/if}
		</div>
	{/if}
</div>

<style>
	.search-wrap {
		position: relative;
	}
	.search-trigger {
		width: 2rem;
		height: 2rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: var(--color-text-secondary);
		background: transparent;
		border: 1px solid transparent;
		border-radius: var(--radius-md);
		padding: 0;
		cursor: pointer;
		transition:
			color var(--duration-fast) var(--ease-base),
			background-color var(--duration-fast) var(--ease-base),
			border-color var(--duration-fast) var(--ease-base);
	}
	.search-trigger:hover {
		color: var(--color-text-primary);
		background-color: var(--color-surface);
		border-color: var(--color-border);
	}
	.search-backdrop {
		--search-backdrop-filter: blur(28px) saturate(1.18);

		position: fixed;
		inset: 0;
		background-color: color-mix(in srgb, var(--color-bg) 54%, transparent);
		backdrop-filter: var(--search-backdrop-filter);
		-webkit-backdrop-filter: var(--search-backdrop-filter);
		z-index: 90;
	}
	.search-modal {
		--search-modal-filter: blur(30px) saturate(1.2);

		position: fixed;
		top: min(4.5rem, 8dvh);
		left: 50%;
		transform: translateX(-50%);
		width: min(92vw, 34rem);
		max-height: calc(100dvh - 2rem);
		display: flex;
		flex-direction: column;
		overscroll-behavior: contain;
		background-color: color-mix(in srgb, var(--color-surface) 78%, transparent);
		backdrop-filter: var(--search-modal-filter);
		-webkit-backdrop-filter: var(--search-modal-filter);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-hover);
		z-index: 100;
		overflow: hidden;
	}
	@supports (backdrop-filter: blur(1px)) {
		.search-backdrop {
			backdrop-filter: var(--search-backdrop-filter);
		}

		.search-modal {
			backdrop-filter: var(--search-modal-filter);
		}
	}
	@supports (-webkit-backdrop-filter: blur(1px)) {
		.search-backdrop {
			backdrop-filter: var(--search-backdrop-filter);
			-webkit-backdrop-filter: var(--search-backdrop-filter);
		}

		.search-modal {
			backdrop-filter: var(--search-modal-filter);
			-webkit-backdrop-filter: var(--search-modal-filter);
		}
	}
	.search-input-wrap {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.875rem 1rem;
		border-bottom: 1px solid var(--color-border);
	}
	.search-input-wrap :global(svg) {
		color: var(--color-text-tertiary);
		flex-shrink: 0;
	}
	.search-close {
		width: 1.75rem;
		height: 1.75rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: var(--color-text-tertiary);
		border: 1px solid transparent;
		border-radius: var(--radius-md);
		cursor: pointer;
		transition:
			color var(--duration-fast) var(--ease-base),
			background-color var(--duration-fast) var(--ease-base);
	}
	.search-close:hover {
		color: var(--color-text-primary);
		background-color: var(--color-surface-hover);
	}
	.search-input {
		flex: 1;
		font-size: var(--text-base);
		font-family: var(--font-sans);
		color: var(--color-text-primary);
		background: none;
		border: none;
		outline: none;
		min-width: 0;
	}
	.search-input::placeholder {
		color: var(--color-text-tertiary);
	}
	.search-input::-webkit-search-cancel-button,
	.search-input::-webkit-search-decoration {
		-webkit-appearance: none;
		appearance: none;
	}
	.search-loading {
		font-size: var(--text-sm);
		color: var(--color-text-tertiary);
	}
	.search-results {
		list-style: none;
		margin: 0;
		padding: 0.5rem;
		max-height: min(20rem, calc(100dvh - 9rem));
		overflow-y: auto;
		overscroll-behavior: contain;
	}
	.search-result {
		display: block;
		text-decoration: none;
		color: inherit;
		padding: 0.625rem 0.75rem;
		border-radius: var(--radius-md);
		transition: background-color var(--duration-fast) var(--ease-base);
	}
	.search-result:hover {
		background-color: var(--color-surface-hover);
	}
	.result-title {
		display: block;
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--color-text-primary);
		margin-bottom: 0.25rem;
	}
	.result-excerpt {
		display: block;
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
		line-height: var(--leading-relaxed);
	}
	.search-empty {
		padding: 1.5rem 1rem;
		font-size: var(--text-sm);
		color: var(--color-text-tertiary);
		text-align: center;
		margin: 0;
	}

	@media (max-width: 640px) {
		.search-backdrop {
			touch-action: none;
		}

		.search-modal {
			top: max(0.75rem, env(safe-area-inset-top));
			left: 50%;
			transform: translateX(-50%);
			width: calc(100vw - 1rem);
			max-height: min(24rem, calc(100dvh - 1.5rem));
			border-radius: var(--radius-lg);
		}

		.search-input-wrap {
			padding: 0.75rem;
			flex-shrink: 0;
		}

		.search-results {
			max-height: min(18rem, calc(100dvh - 6.5rem));
		}
	}
</style>
