<script lang="ts">
	interface Props {
		tag: string;
		count?: number;
		href?: string;
	}

	const { tag, count, href }: Props = $props();
</script>

{#if href}
	<a {href} class="tag-badge">
		{tag}
		{#if count !== undefined}
			<span class="tag-count" aria-label="{count} posts">{count}</span>
		{/if}
	</a>
{:else}
	<span class="tag-badge">
		{tag}
		{#if count !== undefined}
			<span class="tag-count" aria-label="{count} posts">{count}</span>
		{/if}
	</span>
{/if}

<style>
	.tag-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		font-size: var(--text-xs);
		color: var(--color-text-secondary);
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-full);
		padding: 0.25rem 0.75rem;
		letter-spacing: var(--tracking-wide);
		text-transform: lowercase;
		text-decoration: none;
		transition:
			background-color var(--duration-fast) var(--ease-base),
			color var(--duration-fast) var(--ease-base);
	}

	a.tag-badge:hover {
		background-color: var(--color-surface-hover);
		color: var(--color-text-primary);
	}

	.tag-count {
		font-size: calc(var(--text-xs) * 0.9);
		color: var(--color-text-tertiary);
		font-variant-numeric: tabular-nums;
	}
</style>
