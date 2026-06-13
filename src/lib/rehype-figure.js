import { visit } from 'unist-util-visit';

/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('hast').Root} Root
 */

export default function customRehypeFigure() {
	/**
	 * @param {Root} tree
	 */
	return (tree) => {
		visit(tree, 'element', /** @param {Element} node @param {number|undefined} index @param {Element|Root|undefined} parent */ (node, index, parent) => {
			if (node.tagName === 'img' && parent && (parent.type === 'root' || (parent.type === 'element' && parent.tagName !== 'figure')) && index !== undefined) {
				const alt = typeof node.properties?.alt === 'string' ? node.properties.alt : '';

				/** @type {Element} */
				const figure = {
					type: 'element',
					tagName: 'figure',
					properties: {},
					children: [node]
				};

				if (alt.trim() !== '') {
					figure.children.push({
						type: 'element',
						tagName: 'figcaption',
						properties: {},
						children: [{ type: 'text', value: alt }]
					});
				}

				parent.children[index] = figure;
			}
		});
	};
}
