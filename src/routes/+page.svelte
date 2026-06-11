<script lang="ts">
	import type { PageData } from './$types.js';
	import Seo from '$lib/components/Seo.svelte';
	import PostCard from '$lib/components/PostCard.svelte';
	import { buildSeo } from '$lib/seo.js';
	import { siteConfig } from '$lib/config.js';

	interface Props {
		data: PageData;
	}
	const { data }: Props = $props();
	const seo = $derived(
		buildSeo({ path: '/', seoTitle: 'Bhavesh Patil – Writing', origin: data.origin })
	);
</script>

<Seo {seo} />

<div class="page-container">
	<section class="hero" aria-labelledby="hero-heading">
		<img
			class="hero-avatar"
			src="https://db.iambhvsh.in/assets/profile.webp"
			alt="Bhavesh Patil"
			width="88"
			height="88"
		/>
		<h1 id="hero-heading" class="hero-title">{siteConfig.title} – Writing</h1>
		<p class="hero-bio">{siteConfig.description}</p>
	</section>

	{#if data.posts.length > 0}
		<section class="posts-section" aria-label="Recent posts">
			{#each data.posts as post, i (post.slug)}
				<PostCard {post} featured={i === 0} />
			{/each}
		</section>
	{:else}
		<p class="empty-state">No posts yet. Come back soon.</p>
	{/if}
</div>

<style>
	.page-container {
		max-width: 48rem;
		margin: 0 auto;
		padding: 0 1.5rem;
	}
	.hero {
		padding: 3.25rem 0 2.5rem;
		border-bottom: 1px solid var(--color-border);
		text-align: center;
	}
	.hero-avatar {
		display: block;
		width: 88px;
		height: 88px;
		margin: 0 auto 1.5rem;
		border-radius: var(--radius-full);
		object-fit: cover;
		background-color: var(--color-surface);
	}
	.hero-title {
		font-family: var(--font-serif);
		font-size: clamp(28px, 7vw, 34px);
		font-weight: 400;
		letter-spacing: var(--tracking-normal);
		line-height: 1.15;
		color: var(--color-text-primary);
		margin: 0 0 8px;
	}
	.hero-bio {
		font-family: var(--font-sans);
		font-size: 14px;
		font-weight: 400;
		color: var(--color-text-secondary);
		letter-spacing: var(--tracking-normal);
		line-height: 1.5;
		margin: 0 auto;
		max-width: 44ch;
	}
	.posts-section {
		padding-top: 0.25rem;
	}
	.empty-state {
		padding: 3rem 0;
		font-size: var(--text-base);
		color: var(--color-text-tertiary);
	}
</style>
