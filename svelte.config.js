import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex, escapeSvelte } from 'mdsvex';
import { createHighlighter } from 'shiki';
import remarkToc from 'remark-toc';
import rehypeSlug from 'rehype-slug';
import rehypeUnwrapImages from 'rehype-unwrap-images';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

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
		'markdown',
		'bash',
		'shell',
		'python',
		'rust',
		'go',
		'java',
		'cpp',
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
	remarkPlugins: [[remarkToc, { tight: true, ordered: false }]],
	rehypePlugins: [rehypeUnwrapImages, rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]]
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.svx', '.md'],
	preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
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
