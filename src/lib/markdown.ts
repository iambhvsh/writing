import remarkToc from 'remark-toc';
import rehypeSlug from 'rehype-slug';
import rehypeUnwrapImages from 'rehype-unwrap-images';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkRelativeAssets from './assets.ts';
import { visit } from 'unist-util-visit';
import type { Root as MdastRoot, RootContent as MdastContent } from 'mdast';
import type { Root as HastRoot, Element as HastElement } from 'hast';

function remarkTableOfContentsHeading() {
	return (tree: MdastRoot) => {
		const isTocHeading = (node: MdastContent) =>
			node.type === 'heading' &&
			'depth' in node &&
			node.depth === 2 &&
			'children' in node &&
			node.children.some(
				(child: MdastContent) =>
					child.type === 'text' &&
					'value' in child &&
					typeof child.value === 'string' &&
					child.value.toLowerCase() === 'table of contents'
			);

		tree.children = tree.children.filter(
			(node: MdastContent, index: number, children: MdastContent[]) => {
				if (isTocHeading(node)) return false;
				const prev = children[index - 1];
				if (node.type === 'list' && prev && isTocHeading(prev)) return false;
				return true;
			}
		);

		tree.children.unshift({
			type: 'heading',
			depth: 2,
			children: [{ type: 'text', value: 'Table of Contents' }],
		} as unknown as MdastContent);
	};
}

function rehypeFigure() {
	return (tree: HastRoot) => {
		visit(tree, 'element', (node: HastElement, index, parent) => {
			if (node.tagName === 'img' && parent?.type === 'root' && index !== undefined) {
				const alt = typeof node.properties?.alt === 'string' ? node.properties.alt : '';

				const figure: HastElement = {
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
						children: [{ type: 'text', value: alt } as unknown as HastElement],
					});
				}


				parent.children[index] = figure;
			}
		});
	};
}

// Ensure the array type is correctly identified by Unified
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UnifiedPluginItem = any;

export const sharedRemarkPlugins: UnifiedPluginItem[] = [
	remarkRelativeAssets,
	remarkTableOfContentsHeading,
	[remarkToc, { tight: true, ordered: false }],
];

export const sharedRehypePlugins: UnifiedPluginItem[] = [
	rehypeUnwrapImages,
	rehypeFigure,
	rehypeSlug,
	[rehypeAutolinkHeadings, { behavior: 'wrap' }],
];
