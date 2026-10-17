<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	interface TocItem {
		id: string;
		text: string;
		depth: number;
	}

	interface Props {
		containerSelector?: string;
	}

	const { containerSelector = '#article-body' }: Props = $props();

	let items = $state<TocItem[]>([]);
	let activeId = $state<string>('');
	let tocNav = $state<HTMLElement | null>(null);

	let isClickScrolling = false;
	let clickTimer: ReturnType<typeof setTimeout> | null = null;
	let scrollTicking = false;

	function extractHeadings() {
		if (typeof document === 'undefined') return;
		const container = document.querySelector(containerSelector);
		if (!container) {
			items = [];
			activeId = '';
			return;
		}

		const headingEls = container.querySelectorAll('h2, h3');
		const extracted: TocItem[] = [];

		headingEls.forEach((el) => {
			if (el.id && el.id !== 'table-of-contents') {
				extracted.push({
					id: el.id,
					text: el.textContent?.replace(/^#+\s*/, '').replace(/#/g, '').trim() ?? '',
					depth: el.tagName === 'H2' ? 2 : 3
				});
			}
		});

		items = extracted;

		// Check hash in URL or activate first item
		const hash = window.location.hash.slice(1);
		if (hash && items.some((item) => item.id === hash)) {
			activeId = hash;
		} else if (items.length > 0 && !activeId) {
			const first = items[0];
			if (first) {
				activeId = first.id;
			}
		}

		updateActiveHeading();
	}

	function updateActiveHeading() {
		scrollTicking = false;
		if (isClickScrolling || items.length === 0) return;

		const scrollY = window.scrollY || document.documentElement.scrollTop;

		// If at or near bottom of document, activate last item
		if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 30) {
			const last = items[items.length - 1];
			if (last) {
				activeId = last.id;
			}
			return;
		}

		// 56px navbar + 30px offset threshold
		const headerOffset = 86;
		let currentActiveId = items[0]?.id ?? '';

		for (const item of items) {
			const el = document.getElementById(item.id);
			if (el) {
				const top = el.getBoundingClientRect().top;
				if (top <= headerOffset) {
					currentActiveId = item.id;
				} else {
					break;
				}
			}
		}

		if (currentActiveId && activeId !== currentActiveId) {
			activeId = currentActiveId;
		}
	}

	function onScroll() {
		if (isClickScrolling) return;
		if (!scrollTicking) {
			scrollTicking = true;
			requestAnimationFrame(updateActiveHeading);
		}
	}

	function onUserInterrupt() {
		if (isClickScrolling) {
			isClickScrolling = false;
			if (clickTimer) {
				clearTimeout(clickTimer);
				clickTimer = null;
			}
		}
	}

	function handleClick(e: MouseEvent, id: string) {
		e.preventDefault();

		// Immediately highlight clicked item with zero delay
		activeId = id;
		isClickScrolling = true;

		if (clickTimer) {
			clearTimeout(clickTimer);
		}
		clickTimer = setTimeout(() => {
			isClickScrolling = false;
			clickTimer = null;
		}, 800);

		const target = document.getElementById(id);
		if (target) {
			const navbarHeight = 56;
			const padding = 20;
			const targetTop = target.getBoundingClientRect().top + window.scrollY - (navbarHeight + padding);

			window.scrollTo({
				top: Math.max(0, targetTop),
				behavior: 'smooth'
			});

			history.replaceState(null, '', `#${id}`);
		}
	}

	// Keep active TOC link in view if TOC sidebar is scrollable
	$effect(() => {
		if (activeId && tocNav) {
			const activeLink = tocNav.querySelector<HTMLElement>('.toc-link.active');
			if (activeLink) {
				const navRect = tocNav.getBoundingClientRect();
				const linkRect = activeLink.getBoundingClientRect();
				if (linkRect.top < navRect.top) {
					tocNav.scrollTop -= navRect.top - linkRect.top + 12;
				} else if (linkRect.bottom > navRect.bottom) {
					tocNav.scrollTop += linkRect.bottom - navRect.bottom + 12;
				}
			}
		}
	});

	// Re-extract on route navigation
	$effect(() => {
		if (page.url.pathname) {
			requestAnimationFrame(() => {
				extractHeadings();
			});
		}
	});

	onMount(() => {
		extractHeadings();

		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll, { passive: true });
		window.addEventListener('wheel', onUserInterrupt, { passive: true });
		window.addEventListener('touchstart', onUserInterrupt, { passive: true });
		window.addEventListener('keydown', onUserInterrupt, { passive: true });

		return () => {
			if (clickTimer) clearTimeout(clickTimer);
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
			window.removeEventListener('wheel', onUserInterrupt);
			window.removeEventListener('touchstart', onUserInterrupt);
			window.removeEventListener('keydown', onUserInterrupt);
		};
	});
</script>

{#if items.length > 1}
	<nav class="toc-sidebar" aria-label="Table of contents" bind:this={tocNav}>
		<div class="toc-header">
			<span class="toc-title">Contents</span>
		</div>
		<ul class="toc-list" role="list">
			{#each items as item (item.id)}
				<li class="toc-item depth-{item.depth}">
					<a
						href="#{item.id}"
						class="toc-link"
						class:active={activeId === item.id}
						onclick={(e) => {
							handleClick(e, item.id);
						}}
					>
						<span class="toc-text">{item.text}</span>
					</a>
				</li>
			{/each}
		</ul>
	</nav>
{/if}

<style>
	.toc-sidebar {
		width: 100%;
		max-height: calc(100vh - 6.5rem);
		overflow-y: auto;
		scrollbar-width: thin;
		scrollbar-color: var(--color-border) transparent;
		padding-right: 0.25rem;
	}

	.toc-sidebar::-webkit-scrollbar {
		width: 3px;
	}

	.toc-sidebar::-webkit-scrollbar-thumb {
		background: var(--color-border);
		border-radius: var(--radius-full);
	}

	.toc-header {
		margin-bottom: 0.75rem;
		padding-left: 0.625rem;
	}

	.toc-title {
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--color-text-secondary);
		letter-spacing: var(--tracking-normal);
	}

	.toc-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.toc-item {
		position: relative;
	}

	.toc-link {
		display: block;
		padding: 0.25rem 0.5rem 0.25rem 0.625rem;
		font-size: 0.8125rem;
		line-height: 1.4;
		color: var(--color-text-tertiary);
		text-decoration: none;
		border-left: 2px solid transparent;
		transition:
			color var(--duration-fast) var(--ease-base),
			border-color var(--duration-fast) var(--ease-base);
	}

	.toc-item.depth-3 .toc-link {
		padding-left: 1.375rem;
		font-size: 0.75rem;
		line-height: 1.35;
	}

	.toc-text {
		display: block;
		overflow-wrap: break-word;
	}

	.toc-link:hover {
		color: var(--color-text-primary);
	}

	.toc-link.active {
		color: var(--color-text-primary);
		font-weight: 550;
		border-left-color: var(--color-text-primary);
	}
</style>
