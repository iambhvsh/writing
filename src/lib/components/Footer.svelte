<script lang="ts">
	import { siteConfig } from '$lib/config.js';

	const year = new Date().getFullYear();
</script>

<footer>
	<div class="footer-inner">
		<div class="footer-left">
			<span class="footer-copy">
				© {year}
				<a href={siteConfig.authorUrl} target="_blank" rel="noopener noreferrer">
					{siteConfig.author}
				</a>
			</span>
		</div>

		<nav aria-label="Footer navigation">
			<ul class="footer-links" role="list">
				<li>
					<a href="/rss.xml" target="_blank" rel="noopener noreferrer">RSS</a>
				</li>
				<li>
					<a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">Sitemap</a>
				</li>
				<li>
					<a href={siteConfig.authorUrl} target="_blank" rel="noopener noreferrer">Portfolio</a>
				</li>
				<li>
					<a href="https://work.iambhvsh.in" target="_blank" rel="noopener noreferrer">Work</a>
				</li>
				<li>
					<a href="https://links.iambhvsh.in" target="_blank" rel="noopener noreferrer">Links</a>
				</li>
			</ul>
		</nav>
	</div>
</footer>

<style>
	footer {
		border-top: 1px solid var(--color-border);
		margin-top: 3.5rem;
	}

	.footer-inner {
		max-width: 72rem;
		margin: 0 auto;
		padding: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.footer-copy {
		font-size: var(--text-sm);
		color: var(--color-text-tertiary);
	}

	.footer-copy a {
		color: var(--color-text-secondary);
		text-decoration: none;
	}

	.footer-copy a:hover {
		color: var(--color-text-primary);
		transition: color var(--duration-fast) var(--ease-base);
	}

	.footer-links {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		align-items: center;
		gap: 0.125rem;
		flex-wrap: wrap;
	}

	.footer-links a {
		font-size: var(--text-sm);
		color: var(--color-text-tertiary);
		text-decoration: none;
		padding: 0.25rem 0.5rem;
		border-radius: var(--radius-sm);
		transition:
			color var(--duration-fast) var(--ease-base),
			background-color var(--duration-fast) var(--ease-base);
	}

	.footer-links a:hover {
		color: var(--color-text-primary);
		background-color: var(--color-surface);
	}

	@media (max-width: 640px) {
		.footer-inner {
			justify-content: center;
			text-align: center;
		}

		.footer-left {
			width: 100%;
		}

		.footer-links {
			justify-content: center;
		}
	}
</style>
