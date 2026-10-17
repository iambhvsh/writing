import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex, escapeSvelte } from 'mdsvex';
import { createHighlighter } from 'shiki';
import { sharedRemarkPlugins, sharedRehypePlugins } from './src/lib/markdown.ts';

const DEFAULT_SITE_URL = 'https://writing.iambhvsh.in';

/** @param {string | undefined} value */
function normalizeOrigin(value) {
	if (!value) return undefined;
	const url = value.startsWith('http') ? value : `https://${value}`;

	try {
		return new URL(url).origin;
	} catch {
		return undefined;
	}
}

const prerenderOrigin =
	normalizeOrigin(process.env.PUBLIC_SITE_URL) ??
	normalizeOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
	normalizeOrigin(process.env.VERCEL_URL) ??
	DEFAULT_SITE_URL;

const themes = {
	light: 'github-light',
	dark: 'github-dark'
};
const highlighter = await createHighlighter({
	themes: [themes.light, themes.dark],
	langs: [
		'javascript',
		'typescript',
		'svelte',
		'html',
		'css',
		'json',
		'swift',
		'markdown',
		'bash',
		'shell',
		'python',
		'c',
		'yaml',
		'toml',
		'sql',
		'diff',
		'text',
		'plaintext'
	]
});

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.svx', '.md'],
	highlight: {
		highlighter: async (code, lang) => {
			const highlighted = highlighter.codeToHtml(code, {
				lang: lang ?? 'text',
				themes,
				defaultColor: 'light-dark()',
				transformers: [
					{
						name: 'remove-pre-bg',
						pre(node) {
							const style = node.properties.style;
							if (typeof style === 'string') {
								node.properties.style = style
									.split(';')
									.filter((s) => !s.trim().startsWith('background-color'))
									.join(';');
							}
						}
					}
				]
			});
			const escaped = escapeSvelte(highlighted);
			const safe = escaped.replaceAll('\\', '\\\\');
			const dataCode = encodeURIComponent(code);
			const withBtn = safe.replace(
				/<pre ([^>]*)>/,
				`<pre $1><button class="code-copy-btn" aria-label="Copy code" data-code="${dataCode}"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg></button>`
			);
			return `{@html \`${withBtn}\`}`;
		}
	},
	remarkPlugins: sharedRemarkPlugins,
	rehypePlugins: sharedRehypePlugins
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.svx', '.md'],
	preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			precompress: false,
			strict: false
		}),
		prerender: {
			origin: prerenderOrigin,
			handleHttpError: ({ path, message }) => {
				if (path === '/og.png') return;
				throw new Error(message);
			},
			entries: ['*', '/og.png']
		}
	}
};

export default config;
