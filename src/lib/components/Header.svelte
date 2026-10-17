<script lang="ts">
	import { onMount } from 'svelte';
	import { Moon, Sun } from '@lucide/svelte';
	import Search from '$lib/components/Search.svelte';
	import { siteConfig } from '$lib/config.js';
	import { page } from '$app/state';

	type Theme = 'light' | 'dark';

	let theme = $state<Theme>('light');
	let progressScale = $state(0);
	let showProgress = $state(false);
	let ticking = false;

	function applyTheme(nextTheme: Theme) {
		theme = nextTheme;
		document.documentElement.dataset.theme = nextTheme;
		localStorage.setItem('theme', nextTheme);
	}

	function toggleTheme() {
		applyTheme(theme === 'dark' ? 'light' : 'dark');
	}

	function updateProgress() {
		ticking = false;
		const article = document.getElementById('article-body');
		if (!article) {
			showProgress = false;
			progressScale = 0;
			return;
		}

		showProgress = true;
		const scrollY = window.scrollY || document.documentElement.scrollTop;

		// When at or near the top of the page, strictly 0%
		if (scrollY <= 2) {
			progressScale = 0;
			return;
		}

		const rect = article.getBoundingClientRect();
		const articleBottom = rect.top + scrollY + article.offsetHeight;
		const end = articleBottom - window.innerHeight;

		if (end <= 0) {
			progressScale = window.innerHeight + scrollY >= document.documentElement.scrollHeight - 5 ? 1 : 0;
			return;
		}

		if (scrollY >= end || window.innerHeight + scrollY >= document.documentElement.scrollHeight - 5) {
			progressScale = 1;
		} else {
			progressScale = Math.min(1, Math.max(0, scrollY / end));
		}
	}

	function onScroll() {
		if (!ticking) {
			ticking = true;
			requestAnimationFrame(updateProgress);
		}
	}

	onMount(() => {
		const savedTheme = localStorage.getItem('theme');
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		applyTheme(savedTheme === 'dark' || (!savedTheme && prefersDark) ? 'dark' : 'light');

		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll, { passive: true });
		updateProgress();

		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
		};
	});

	$effect(() => {
		if (page.url.pathname) {
			requestAnimationFrame(updateProgress);
		}
	});
</script>

<header>
	<div class="header-bg"></div>
	<div class="header-inner">
		<a href="/" class="wordmark" aria-label="{siteConfig.title} home">
			{siteConfig.title}
		</a>
		<div class="header-actions">
			<Search />
			<button
				type="button"
				class="theme-toggle"
				aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
				title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
				onclick={toggleTheme}
			>
				{#if theme === 'dark'}
					<Sun size={17} strokeWidth={1.8} />
				{:else}
					<Moon size={17} strokeWidth={1.8} />
				{/if}
			</button>
		</div>
	</div>

	<div class="nav-progress-track" aria-hidden="true" class:visible={showProgress}>
		<div class="nav-progress-bar" style="transform: scaleX({progressScale});"></div>
	</div>
</header>

<style>
	header {
		position: sticky;
		top: 0;
		z-index: 50;
		border-bottom: 1px solid var(--color-border);
		isolation: isolate;
	}
	.header-bg {
		--header-glass-filter: blur(28px) saturate(1.18);

		position: absolute;
		inset: 0;
		z-index: 0;
		pointer-events: none;
		background: var(--color-bg);
		backdrop-filter: var(--header-glass-filter);
		-webkit-backdrop-filter: var(--header-glass-filter);
	}
	@supports (backdrop-filter: blur(1px)) {
		.header-bg {
			backdrop-filter: var(--header-glass-filter);
		}
	}
	@supports (-webkit-backdrop-filter: blur(1px)) {
		.header-bg {
			backdrop-filter: var(--header-glass-filter);
			-webkit-backdrop-filter: var(--header-glass-filter);
		}
	}
	.header-inner {
		position: relative;
		z-index: 1;
		max-width: 1440px;
		margin: 0 auto;
		padding: 0 1.5rem;
		height: 3.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.wordmark {
		font-family: var(--font-serif);
		font-size: var(--text-xl);
		font-weight: 600;
		color: var(--color-text-primary);
		text-decoration: none;
		letter-spacing: var(--tracking-tight);
		line-height: 1;
		transition: opacity var(--duration-fast) var(--ease-base);
	}
	.wordmark:hover {
		opacity: 0.7;
	}
	.header-actions {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}
	.theme-toggle {
		width: 2rem;
		height: 2rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: var(--color-text-secondary);
		background-color: transparent;
		border: 1px solid transparent;
		border-radius: var(--radius-md);
		cursor: pointer;
		transition:
			color var(--duration-fast) var(--ease-base),
			background-color var(--duration-fast) var(--ease-base),
			border-color var(--duration-fast) var(--ease-base);
	}
	.theme-toggle:hover {
		color: var(--color-text-primary);
		background-color: var(--color-surface);
		border-color: var(--color-border);
	}
	.nav-progress-track {
		position: absolute;
		bottom: -1px;
		left: 0;
		width: 100%;
		height: 2px;
		pointer-events: none;
		z-index: 10;
		opacity: 0;
		background: transparent;
		transition: opacity var(--duration-fast) var(--ease-base);
	}
	.nav-progress-track.visible {
		opacity: 1;
	}
	.nav-progress-bar {
		width: 100%;
		height: 100%;
		background-color: var(--color-text-primary);
		transform-origin: left center;
		will-change: transform;
	}
</style>
