<script lang="ts">
	import { onMount } from 'svelte';

	interface TocItem {
		id: string;
		text: string;
		level: number;
	}

	interface Props {
		items: TocItem[];
	}

	const { items }: Props = $props();
	let activeId = $state('');

	onMount(() => {
		if (items.length === 0) return;

		const headings = items
			.map(({ id }) => document.getElementById(id))
			.filter((el): el is HTMLElement => el !== null);

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						activeId = entry.target.id;
					}
				}
			},
			{ rootMargin: '-10% 0% -80% 0%' }
		);

		headings.forEach((el) => {
			observer.observe(el);
		});
		return () => {
			observer.disconnect();
		};
	});
</script>

{#if items.length > 2}
	<nav class="toc" aria-label="Table of contents">
		<p class="toc-label">On this page</p>
		<ol class="toc-list" role="list">
			{#each items as item (item.id)}
				<li class="toc-item" class:h3={item.level === 3}>
					<a
						href="#{item.id}"
						class="toc-link"
						class:active={activeId === item.id}
						aria-current={activeId === item.id ? 'location' : undefined}
					>
						{item.text}
					</a>
				</li>
			{/each}
		</ol>
	</nav>
{/if}

<style>
	.toc {
		position: sticky;
		top: 5rem;
		padding: 1.25rem;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		max-height: calc(100vh - 7rem);
		overflow-y: auto;
	}
	.toc-label {
		font-size: var(--text-xs);
		font-weight: 600;
		letter-spacing: var(--tracking-widest);
		text-transform: uppercase;
		color: var(--color-text-tertiary);
		margin: 0 0 0.75rem;
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
		line-height: 1;
	}
	.toc-item.h3 {
		padding-left: 0.875rem;
	}
	.toc-link {
		display: block;
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		text-decoration: underline;
		text-underline-offset: 3px;
		text-decoration-thickness: 1px;
		text-decoration-color: var(--color-border);
		padding: 0.3125rem 0.5rem;
		border-radius: var(--radius-sm);
		line-height: var(--leading-snug);
		transition:
			color var(--duration-fast) var(--ease-base),
			text-decoration-color var(--duration-fast) var(--ease-base),
			background-color var(--duration-fast) var(--ease-base);
	}
	.toc-link:hover {
		color: var(--color-text-primary);
		text-decoration-color: var(--color-border-strong);
		background-color: var(--color-surface-hover);
	}
	.toc-link.active {
		color: var(--color-text-primary);
		text-decoration-color: var(--color-border-strong);
		background-color: var(--color-surface-hover);
		font-weight: 500;
	}
</style>
