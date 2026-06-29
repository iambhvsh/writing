/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment */
import remarkToc from 'remark-toc';
import rehypeSlug from 'rehype-slug';
import rehypeUnwrapImages from 'rehype-unwrap-images';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkRelativeAssets from './assets.ts'; // NOTE: extension is .ts originally in svelte.config.js but we should import `.js` to be TS-Node/Vite compliant, wait, .js is fine.
import { visit } from 'unist-util-visit';

export function remarkTableOfContentsHeading() {
	return (tree: any) => {
		const isTocHeading = (node: any) =>
			node.type === 'heading' &&
			node.depth === 2 &&
			node.children.some(
				(child: any) => child.type === 'text' && child.value.toLowerCase() === 'table of contents'
			);

		tree.children = tree.children.filter((node: any, index: number, children: any[]) => {
			if (isTocHeading(node)) return false;
			if (node.type === 'list' && index > 0 && isTocHeading(children[index - 1])) return false;
			return true;
		});

		tree.children.unshift({
			type: 'heading',
			depth: 2,
			children: [{ type: 'text', value: 'Table of Contents' }],
		});
	};
}

export function rehypeFigure() {
	return (tree: any) => {
		visit(tree, 'element', (node: any, index, parent) => {
			if (node.tagName === 'img' && parent?.type === 'root' && index !== undefined) {
				const alt = typeof node.properties?.alt === 'string' ? node.properties.alt : '';

				const figure = {
					type: 'element',
					tagName: 'figure',
					properties: {},
					children: [node],
				};

				if (alt.trim() !== '') {
					figure.children.push({
						type: 'element',
						tagName: 'figcaption',
						properties: {},
						children: [{ type: 'text', value: alt }],
					});
				}

				parent.children[index] = figure;
			}
		});
	};
}

export const sharedRemarkPlugins: any[] = [
	remarkRelativeAssets,
	remarkTableOfContentsHeading,
	[remarkToc, { tight: true, ordered: false }],
];

export const sharedRehypePlugins: any[] = [
	rehypeUnwrapImages,
	rehypeFigure,
	rehypeSlug,
	[rehypeAutolinkHeadings, { behavior: 'wrap' }],
];
