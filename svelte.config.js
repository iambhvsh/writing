import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex, escapeSvelte } from 'mdsvex';
import { createHighlighter } from 'shiki';
import { sharedRemarkPlugins, sharedRehypePlugins } from './src/lib/markdown.ts';

const DEFAULT_SITE_URL = 'https://writing.iambhvsh.in';

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

const theme = 'github-dark';
const highlighter = await createHighlighter({
	themes: [theme],
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
		highlighter: async (code, lang = 'text') => {
			const html = escapeSvelte(highlighter.codeToHtml(code, { lang, theme }));
			return `{@html \`${html}\`}`;
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
