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
