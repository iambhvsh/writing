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
		visit(tree, 'element', (node: HastElement) => {
			if (node.tagName === 'a' && node.properties?.href) {
				const href = String(node.properties.href);
				if (href.startsWith('./') || href.startsWith('../') || (!href.startsWith('http') && !href.startsWith('#') && !href.startsWith('/'))) {
					node.properties.href = `${siteConfig.url}/${options.slug}/${href.replace(/^\.\//, '')}`;
				} else if (href.startsWith('/')) {
					node.properties.href = `${siteConfig.url}${href}`;
				}
			}
			if (node.tagName === 'img' && node.properties?.src) {
				const src = String(node.properties.src);
				if (src.startsWith('./') || src.startsWith('../') || (!src.startsWith('http') && !src.startsWith('/'))) {
					node.properties.src = `${siteConfig.url}/${options.slug}/${src.replace(/^\.\//, '')}`;
				} else if (src.startsWith('/')) {
					node.properties.src = `${siteConfig.url}${src}`;
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
