<script lang="ts">
	interface PostItem {
		slug: string;
		title: string;
		tags: string[];
	}

	interface Props {
		posts: PostItem[];
		activeTag?: string | null;
		ontagselect?: (tag: string | null) => void;
	}

	const { posts, activeTag = null, ontagselect }: Props = $props();

	// Compute top 5 tag counts sorted descending by post count
	const tagCounts = $derived.by(() => {
		const counts: Record<string, number> = {};
		for (const post of posts) {
			for (const tag of post.tags) {
				counts[tag] = (counts[tag] ?? 0) + 1;
			}
		}
		return Object.entries(counts)
			.map(([tag, count]) => ({ tag, count }))
			.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
			.slice(0, 5);
	});
</script>

<nav class="home-topics-sidebar" aria-label="Writings sections">
	<div class="topics-header">
		<span class="topics-title">Sections</span>
		{#if activeTag}
			<button
				type="button"
				class="clear-filter-link"
				onclick={() => {
					ontagselect?.(null);
				}}
			>
				Reset
			</button>
		{/if}
	</div>

	<ul class="topics-list" role="list">
		<li class="topic-item">
			<button
				type="button"
				class="topic-link"
				class:active={!activeTag}
				onclick={() => {
					ontagselect?.(null);
				}}
			>
				<span class="topic-name">All Writings</span>
				<span class="topic-count">{posts.length}</span>
			</button>
		</li>
		{#each tagCounts as { tag, count } (tag)}
			<li class="topic-item">
				<button
					type="button"
					class="topic-link"
					class:active={activeTag === tag}
					onclick={() => {
						ontagselect?.(activeTag === tag ? null : tag);
					}}
				>
					<span class="topic-name">{tag}</span>
					<span class="topic-count">{count}</span>
				</button>
			</li>
		{/each}
	</ul>
</nav>

<style>
	.home-topics-sidebar {
		width: 100%;
		max-height: calc(100vh - 6.5rem);
		overflow-y: auto;
		scrollbar-width: thin;
		scrollbar-color: var(--color-border) transparent;
		padding-right: 0.25rem;
	}

	.home-topics-sidebar::-webkit-scrollbar {
		width: 3px;
	}

	.home-topics-sidebar::-webkit-scrollbar-thumb {
		background: var(--color-border);
		border-radius: var(--radius-full);
	}

	.topics-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.75rem;
		padding-left: 0.625rem;
		padding-right: 0.5rem;
	}

	.topics-title {
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--color-text-secondary);
		letter-spacing: var(--tracking-normal);
	}

	.clear-filter-link {
		font-size: 0.6875rem;
		color: var(--color-text-tertiary);
		background: none;
		border: none;
		cursor: pointer;
		text-decoration: underline;
		padding: 0;
	}

	.clear-filter-link:hover {
		color: var(--color-text-primary);
	}

	.topics-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.topic-item {
		position: relative;
	}

	.topic-link {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 0.25rem 0.5rem 0.25rem 0.625rem;
		font-size: 0.8125rem;
		line-height: 1.4;
		color: var(--color-text-tertiary);
		background: transparent;
		border: none;
		border-left: 2px solid transparent;
		text-align: left;
		cursor: pointer;
		transition:
			color var(--duration-fast) var(--ease-base),
			border-color var(--duration-fast) var(--ease-base);
	}

	.topic-link:hover {
		color: var(--color-text-primary);
	}

	.topic-link.active {
		color: var(--color-text-primary);
		font-weight: 550;
		border-left-color: var(--color-text-primary);
	}

	.topic-name {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.topic-count {
		font-size: 0.6875rem;
		font-variant-numeric: tabular-nums;
		color: var(--color-text-tertiary);
		margin-left: 0.5rem;
	}

	.topic-link.active .topic-count {
		color: var(--color-text-primary);
	}
</style>
