<script lang="ts">
	import type { SeoMeta } from '$lib/seo.js';

	interface Props {
		seo: SeoMeta;
	}

	const { seo }: Props = $props();

	// JSON-LD is generated internally from typed data — no XSS risk
	const jsonLdScript = $derived(`<script type="application/ld+json">${seo.jsonLd}<` + `/script>`);
</script>

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
	<link rel="canonical" href={seo.canonical} />
	<meta property="og:title" content={seo.og.title} />
	<meta property="og:description" content={seo.og.description} />
	<meta property="og:url" content={seo.og.url} />
	<meta property="og:type" content={seo.og.type} />
	<meta property="og:image" content={seo.og.image} />
	<meta property="og:image:alt" content={seo.og.imageAlt} />
	<meta property="og:site_name" content={seo.og.siteName} />
	{#if seo.og.publishedTime}
		<meta property="article:published_time" content={seo.og.publishedTime} />
	{/if}
	{#if seo.og.author}
		<meta property="article:author" content={seo.og.author} />
	{/if}
	{#if seo.og.tags}
		{#each seo.og.tags as tag (tag)}
			<meta property="article:tag" content={tag} />
		{/each}
	{/if}
	<meta name="twitter:card" content={seo.twitter.card} />
	<meta name="twitter:title" content={seo.twitter.title} />
	<meta name="twitter:description" content={seo.twitter.description} />
	<meta name="twitter:image" content={seo.twitter.image} />
	{#if seo.twitter.site}
		<meta name="twitter:site" content={seo.twitter.site} />
	{/if}
	{#if seo.twitter.creator}
		<meta name="twitter:creator" content={seo.twitter.creator} />
	{/if}
	{@html jsonLdScript}
</svelte:head>
