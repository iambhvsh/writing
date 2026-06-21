import { basename, postDirectory, normalizeRelativePath } from './utils.js';

const assetModules = import.meta.glob('/writings/**/*', {
	query: '?url',
	import: 'default',
	eager: true,
});

const assets = new Map<string, string>();
for (const [path, url] of Object.entries(assetModules)) {
	if (!path.endsWith('/index.svx') && typeof url === 'string') assets.set(path, url);
}

export function getAssetUrl(postPath: string, relativePath: string): string | undefined {
	const normalized = normalizeRelativePath(relativePath);
	if (!normalized) return undefined;
	return assets.get(`${postDirectory(postPath)}/${normalized}`);
}

export function listAssetPathsForPost(postPath: string): readonly string[] {
	const dir = `${postDirectory(postPath)}/`;
	return [...assets.keys()].filter((path) => path.startsWith(dir));
}

export function assetName(path: string): string {
	return basename(path);
}
