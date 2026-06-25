import path from 'node:path';
import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';

/**
 * remarkRelativeAssets — Vite-native replacement for `mdsvex-relative-images`,
 * generalized to any relative asset, not just images.
 *
 * Relies on mdsvex's existing `transform_hast` pass, which reverses the
 * `{`/`}` percent-encoding that mdast-util-to-hast applies to href/src,
 * so `{identifier}` placeholders survive in `a`/`img` elements. Raw HTML
 * is rewritten in place since it bypasses that encoding step.
 *
 * mdsvex calls `unified().process({ contents, filename })`, so the source
 * path arrives on `file.filename`; `file.path` is a fallback for standalone
 * unified/remark usage.
 */

const EXTERNAL_PROTOCOL_PATTERN = /^[a-zA-Z][a-zA-Z\d+.-]*:/;

function isRelativeAssetPath(value: string | null | undefined): value is string {
	if (!value) return false;
	if (value.startsWith('#')) return false;
	if (value.startsWith('/')) return false;
	if (value.startsWith('$')) return false;
	if (EXTERNAL_PROTOCOL_PATTERN.test(value)) return false;
	return value.startsWith('./') || value.startsWith('../');
}

/** Splits "./file.ext?already=query#hash" into the importable path and the leftover suffix. */
function splitPathAndSuffix(value: string): { cleanPath: string; suffix: string } {
	const match = /^([^?#]+)([?#].*)?$/.exec(value);
	if (!match) return { cleanPath: value, suffix: '' };
	return { cleanPath: match[1] ?? value, suffix: match[2] ?? '' };
}

function toIdentifierBase(relativePath: string): string {
	const base = relativePath
		.replace(/^\.\.?\//, '')
		.replace(/\.[^./]+$/, '')
		.replace(/[^a-zA-Z0-9]+/g, '_')
		.replace(/^_+|_+$/g, '');
	return base.length > 0 ? base : 'file';
}

export default function remarkRelativeAssets() {
	return function transformer(tree: Root, file: { filename?: string; path?: string }) {
		const sourcePath = file.filename ?? file.path;
		if (!sourcePath) return;

		const identifiersByPath = new Map<string, string>();
		let counter = 0;

		function resolveImport(cleanPath: string): string {
			const existing = identifiersByPath.get(cleanPath);
			if (existing) return existing;

			counter += 1;
			const identifier = `__asset_${toIdentifierBase(cleanPath)}_${String(counter)}`;
			identifiersByPath.set(cleanPath, identifier);
			return identifier;
		}

		function substitute(value: string): string {
			const { cleanPath, suffix } = splitPathAndSuffix(value);
			const identifier = resolveImport(cleanPath);
			return suffix ? `{${identifier}}${suffix}` : `{${identifier}}`;
		}

		visit(tree, (node) => {
			if (node.type === 'image' || node.type === 'link') {
				if (isRelativeAssetPath(node.url)) {
					node.url = substitute(node.url);
				}
				return;
			}

			if (node.type === 'html') {
				if (!/(?:href|src|poster)\s*=/.test(node.value)) return;

				node.value = node.value.replace(
					/((?:href|src|poster)\s*=\s*)(["'])([^"']*)\2/gi,
					(full: string, prefix: string, quote: string, value: string) => {
						if (!isRelativeAssetPath(value)) return full;
						return `${prefix}${quote}${substitute(value)}${quote}`;
					}
				);
			}
		});

		if (identifiersByPath.size === 0) return;

		const sourceDir = path.dirname(sourcePath);
		const importStatements = [...identifiersByPath.entries()]
			.map(([cleanPath, identifier]) => {
				const specifier = cleanPath.startsWith('.')
					? cleanPath
					: `./${path.relative(sourceDir, path.resolve(sourceDir, cleanPath))}`;
				return `import ${identifier} from ${JSON.stringify(`${specifier}?url`)};`;
			})
			.join('\n');

		const SCRIPT_OPEN_TAG = /<script(?:\s+[a-zA-Z-]+(?:=(?:"[^"]*"|'[^']*'))?)*\s*>/;
		const MODULE_SCRIPT_OPEN_TAG = /<script[^>]*\b(?:context\s*=\s*["']module["']|module\b)[^>]*>/;

		let mergedIntoExisting = false;
		visit(tree, (node) => {
			if (mergedIntoExisting) return;
			if (node.type !== 'html') return;
			if (!SCRIPT_OPEN_TAG.test(node.value)) return;
			if (MODULE_SCRIPT_OPEN_TAG.test(node.value)) return;

			node.value = node.value.replace(
				SCRIPT_OPEN_TAG,
				(openTag) => `${openTag}\n${importStatements}`
			);
			mergedIntoExisting = true;
		});

		if (!mergedIntoExisting) {
			tree.children.push({
				type: 'html',
				value: `<script>\n${importStatements}</script>`,
			});
		}
	};
}
