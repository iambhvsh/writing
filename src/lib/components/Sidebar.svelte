<script lang="ts">
	import { siteConfig } from '$lib/config.js';
	import { Rss, Check, Copy, ChevronLeft, ChevronRight, ExternalLink } from '@lucide/svelte';

	interface Props {
		prevPost?: { slug: string; title: string } | null;
		nextPost?: { slug: string; title: string } | null;
	}

	const { prevPost = null, nextPost = null }: Props = $props();

	let copiedRss = $state(false);
	const avatarUrl = 'https://db.iambhvsh.in/images/profile.webp';

	async function copyRssUrl() {
		if (typeof window === 'undefined') return;
		try {
			await navigator.clipboard.writeText(`${window.location.origin}/rss.xml`);
			copiedRss = true;
			setTimeout(() => {
				copiedRss = false;
			}, 2000);
		} catch {
			// Ignore silently
		}
	}
</script>

<aside class="sidebar-wrapper" aria-label="Sidebar information">
	<!-- Series / Adjoining Posts (if available) -->
	{#if prevPost ?? nextPost}
		<div class="sidebar-card">
			<span class="sidebar-label">Series Navigation</span>
			<div class="series-nav">
				{#if prevPost}
					<a href="/{prevPost.slug}" class="series-link prev">
						<span class="series-direction"><ChevronLeft size={12} /> Previous</span>
						<span class="series-title">{prevPost.title}</span>
					</a>
				{/if}
				{#if nextPost}
					<a href="/{nextPost.slug}" class="series-link next">
						<span class="series-direction">Next <ChevronRight size={12} /></span>
						<span class="series-title">{nextPost.title}</span>
					</a>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Author Profile Card -->
	<div class="sidebar-card profile-card">
		<div class="profile-header">
			<img
				src={`${avatarUrl}?width=64&height=64&fit=cover&quality=80&format=webp`}
				srcset={`${avatarUrl}?width=64&height=64&fit=cover&quality=80&format=webp 1x, ${avatarUrl}?width=128&height=128&fit=cover&quality=80&format=webp 2x`}
				alt={siteConfig.author}
				width="48"
				height="48"
				class="profile-avatar"
				loading="lazy"
				decoding="async"
			/>
			<div class="profile-meta">
				<span class="profile-name">{siteConfig.author}</span>
				<span class="profile-role">Independent Builder & Writer</span>
			</div>
		</div>
		<p class="profile-bio">{siteConfig.description}</p>
		<div class="profile-links">
			<a href={siteConfig.authorUrl} target="_blank" rel="noopener noreferrer" class="profile-link">
				<span>Portfolio</span>
				<ExternalLink size={11} />
			</a>
			<a href="https://github.com/iambhvsh" target="_blank" rel="noopener noreferrer" class="profile-link">
				<span>GitHub</span>
				<ExternalLink size={11} />
			</a>
			<a href="https://x.com/iambhvsh" target="_blank" rel="noopener noreferrer" class="profile-link">
				<span>X</span>
				<ExternalLink size={11} />
			</a>
		</div>
	</div>

	<!-- RSS Feed Card -->
	<div class="sidebar-card rss-card">
		<div class="rss-header">
			<div class="rss-icon-wrap" aria-hidden="true">
				<Rss size={15} />
			</div>
			<div>
				<span class="rss-title">Subscribe via RSS</span>
				<span class="rss-sub">Stay updated in your favorite reader</span>
			</div>
		</div>
		<div class="rss-actions">
			<a href="/rss.xml" class="rss-btn primary" target="_blank" rel="noopener noreferrer">
				View Feed
			</a>
			<button type="button" class="rss-btn secondary" onclick={copyRssUrl} aria-label="Copy RSS URL">
				{#if copiedRss}
					<Check size={13} class="copied-check" />
					<span>Copied</span>
				{:else}
					<Copy size={13} />
					<span>Copy URL</span>
				{/if}
			</button>
		</div>
	</div>
</aside>

<style>
	.sidebar-wrapper {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-height: calc(100vh - 6.5rem);
		overflow-y: auto;
		scrollbar-width: thin;
		scrollbar-color: var(--color-border) transparent;
	}

	.sidebar-wrapper::-webkit-scrollbar {
		width: 3px;
	}

	.sidebar-wrapper::-webkit-scrollbar-thumb {
		background: var(--color-border);
		border-radius: var(--radius-full);
	}

	.sidebar-card {
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: 1.125rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		transition: border-color var(--duration-fast) var(--ease-base);
	}

	.sidebar-card:hover {
		border-color: var(--color-border-strong);
	}

	.sidebar-label {
		font-size: var(--text-xs);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: var(--tracking-wider);
		color: var(--color-text-secondary);
	}

	.series-nav {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.series-link {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
		padding: 0.5rem 0.625rem;
		background-color: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		text-decoration: none;
		transition: border-color var(--duration-fast) var(--ease-base);
	}

	.series-link:hover {
		border-color: var(--color-border-strong);
	}

	.series-direction {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: var(--tracking-wider);
		color: var(--color-text-tertiary);
		font-weight: 600;
	}

	.series-title {
		font-size: var(--text-xs);
		color: var(--color-text-primary);
		line-height: var(--leading-snug);
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.profile-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.profile-avatar {
		width: 3rem;
		height: 3rem;
		border-radius: var(--radius-full);
		border: 1px solid var(--color-border);
		object-fit: cover;
		background-color: var(--color-surface);
		flex-shrink: 0;
	}

	.profile-meta {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
		min-width: 0;
	}

	.profile-name {
		font-family: var(--font-serif);
		font-size: var(--text-lg);
		font-weight: 550;
		color: var(--color-text-primary);
		line-height: var(--leading-tight);
	}

	.profile-role {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
		letter-spacing: var(--tracking-wide);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.profile-bio {
		font-size: var(--text-xs);
		color: var(--color-text-secondary);
		line-height: var(--leading-relaxed);
		margin: 0;
	}

	.profile-links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
		padding-top: 0.125rem;
	}

	.profile-link {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.25rem 0.5rem;
		font-size: 0.6875rem;
		color: var(--color-text-secondary);
		background-color: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-full);
		text-decoration: none;
		letter-spacing: var(--tracking-wide);
		transition:
			color var(--duration-fast) var(--ease-base),
			border-color var(--duration-fast) var(--ease-base),
			background-color var(--duration-fast) var(--ease-base);
	}

	.profile-link:hover {
		color: var(--color-text-primary);
		border-color: var(--color-border-strong);
		background-color: var(--color-surface-hover);
	}

	.rss-header {
		display: flex;
		align-items: center;
		gap: 0.625rem;
	}

	.rss-icon-wrap {
		width: 1.875rem;
		height: 1.875rem;
		border-radius: var(--radius-md);
		background-color: var(--color-bg);
		border: 1px solid var(--color-border);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-text-primary);
		flex-shrink: 0;
	}

	.rss-title {
		display: block;
		font-size: var(--text-xs);
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.rss-sub {
		display: block;
		font-size: 0.6875rem;
		color: var(--color-text-tertiary);
		line-height: var(--leading-tight);
	}

	.rss-actions {
		display: flex;
		gap: 0.5rem;
		margin-top: 0.125rem;
	}

	.rss-btn {
		flex: 1;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.375rem;
		padding: 0.375rem 0.5rem;
		font-size: var(--text-xs);
		border-radius: var(--radius-sm);
		text-decoration: none;
		cursor: pointer;
		transition:
			background-color var(--duration-fast) var(--ease-base),
			color var(--duration-fast) var(--ease-base),
			border-color var(--duration-fast) var(--ease-base);
	}

	.rss-btn.primary {
		background-color: var(--color-text-primary);
		color: var(--color-text-inverse);
		border: 1px solid var(--color-text-primary);
	}

	.rss-btn.primary:hover {
		opacity: 0.9;
	}

	.rss-btn.secondary {
		background-color: var(--color-bg);
		color: var(--color-text-secondary);
		border: 1px solid var(--color-border);
	}

	.rss-btn.secondary:hover {
		color: var(--color-text-primary);
		border-color: var(--color-border-strong);
	}

	:global(.copied-check) {
		color: var(--color-code-btn-copied, #16a34a);
	}
</style>
