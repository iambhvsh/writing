import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, searchForWorkspaceRoot } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';

function getWritingDates() {
	const writingsDir = path.resolve(process.cwd(), 'writings');
	const dates: Record<string, { publishedAt: string }> = {};

	try {
		const entries = readdirSync(writingsDir, { withFileTypes: true });

		for (const entry of entries) {
			if (!entry.isDirectory()) continue;

			for (const filename of ['index.svx', 'index.md']) {
				try {
					const file = path.join(writingsDir, entry.name, filename);
					const stats = statSync(file);
					const publishedAt = stats.birthtimeMs > 0 ? stats.birthtime : stats.ctime;
					dates[entry.name] = { publishedAt: publishedAt.toISOString() };
					break;
				} catch {
					// Try the next supported writing entry filename.
				}
			}
		}
	} catch {
		// Keep config usable before writings exist.
	}

	return dates;
}

export default defineConfig({
	define: {
		__WRITING_DATES__: JSON.stringify(getWritingDates()),
	},
	plugins: [tailwindcss(), sveltekit()],
	server: {
		fs: {
			allow: [searchForWorkspaceRoot(process.cwd()), 'writings'],
		},
	},
	build: {
		cssMinify: true,
		sourcemap: false,
		rolldownOptions: {
			checks: {
				pluginTimings: false,
			},
		},
	}
});
