<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	interface Props {
		children: Snippet;
	}

	const { children }: Props = $props();
</script>

<div class="site-wrapper">
	<Header />
	<main id="main-content" tabindex="-1">
		{@render children()}
	</main>
	<Footer />
</div>

<svelte:head>
	<script>
		document.addEventListener('click', (e) => {
			const btn = e.target.closest('.code-copy-btn');
			if (!btn) return;
			const code = decodeURIComponent(btn.dataset.code ?? '');
			navigator.clipboard.writeText(code).then(() => {
				btn.classList.add('copied');
				const original = btn.innerHTML;
				btn.innerHTML =
					'<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
				setTimeout(() => {
					btn.classList.remove('copied');
					btn.innerHTML = original;
				}, 2000);
			});
		});
	</script>
</svelte:head>

<style>
	.site-wrapper {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}
	main {
		flex: 1;
		outline: none;
	}
</style>
