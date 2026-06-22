import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, searchForWorkspaceRoot } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		fs: {
			allow: [searchForWorkspaceRoot(process.cwd()), 'writings'],
		},
	},
	build: {
		cssMinify: 'esbuild',
		sourcemap: false,
                assetsInlineLimit: 0,
		rolldownOptions: {
			checks: {
				pluginTimings: false,
			},
		},
	}
});
