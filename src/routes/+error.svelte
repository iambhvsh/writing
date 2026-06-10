<script lang="ts">
	import { page } from '$app/stores';
	import Seo from '$lib/components/Seo.svelte';
	import { buildSeo } from '$lib/seo.js';
	import { ChevronLeft } from '@lucide/svelte';

	const seo = buildSeo({ title: `${String($page.status)} Error`, path: $page.url.pathname });
</script>

<Seo {seo} />

<div class="error-page">
	<p class="error-status">{$page.status}</p>
	<h1 class="error-title">
		{$page.status === 404 ? 'Page not found.' : 'Something went wrong.'}
	</h1>
	<p class="error-message">
		{$page.error?.message ?? 'An unexpected error occurred.'}
	</p>
	<a href="/" class="error-back">
		<ChevronLeft size={16} />
		Go home
	</a>
</div>

<style>
	.error-page {
		max-width: 48rem;
		margin: 0 auto;
		padding: 6rem 1.5rem;
	}
	.error-status {
		font-size: var(--text-sm);
		color: var(--color-text-tertiary);
		letter-spacing: var(--tracking-widest);
		text-transform: uppercase;
		margin: 0 0 1rem;
	}
	.error-title {
		font-family: var(--font-serif);
		font-size: var(--text-4xl);
		font-weight: 400;
		letter-spacing: var(--tracking-tight);
		margin: 0 0 1rem;
	}
	.error-message {
		font-size: var(--text-base);
		color: var(--color-text-secondary);
		margin: 0 0 2rem;
	}
	.error-back {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		text-decoration: none;
		transition: color var(--duration-fast) var(--ease-base);
	}
	.error-back:hover {
		color: var(--color-text-primary);
	}
</style>
