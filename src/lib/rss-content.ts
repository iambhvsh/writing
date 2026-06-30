import { unified, type Processor } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

import { sharedRemarkPlugins, sharedRehypePlugins } from './markdown.js';
import { visit } from 'unist-util-visit';
import { siteConfig } from './config.js';
import type { Root as HastRoot, Element as HastElement } from 'hast';

function rehypeAbsoluteUrls(options: { slug: string }) {
	return (tree: HastRoot) => {
		// Ensure baseUrl always has a trailing slash for correct relative resolution
		const siteUrl = siteConfig.url.endsWith('/') ? siteConfig.url : `${siteConfig.url}/`;
		const baseUrl = new URL(`${options.slug}/`, siteUrl).href;

		visit(tree, 'element', (node: HastElement) => {
			if (node.tagName === 'a' && typeof node.properties?.href === 'string') {
				try {
					node.properties.href = new URL(node.properties.href, baseUrl).href;
				} catch {
					// Ignore invalid URLs
				}
			}
			if (node.tagName === 'img' && typeof node.properties?.src === 'string') {
				try {
					node.properties.src = new URL(node.properties.src, baseUrl).href;
				} catch {
					// Ignore invalid URLs
				}
			}
		});
	};
}


function applyPlugins(processor: Processor, plugins: typeof sharedRemarkPlugins) {
	for (const plugin of plugins) {
		if (Array.isArray(plugin)) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			processor.use(plugin[0], ...plugin.slice(1));
		} else {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			processor.use(plugin);
		}
	}
}

export async function compileMarkdownToHtml(markdown: string, slug: string): Promise<string> {
	const processor = unified().use(remarkParse);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
	applyPlugins(processor as any, sharedRemarkPlugins);
	processor.use(remarkRehype);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
	applyPlugins(processor as any, sharedRehypePlugins);
	processor.use(rehypeAbsoluteUrls, { slug });
	processor.use(rehypeStringify);

	const file = await processor.process(markdown);
	return String(file);
}
