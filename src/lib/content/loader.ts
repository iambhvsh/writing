import { getAssetUrl } from './assets.js';
import type { LoadedPost, PostModule, RawPostFile } from './types.js';
import { slugFromPath } from './utils.js';
import { validatePosts } from './validator.js';

const modules = import.meta.glob('/writings/**/index.svx', { eager: true });
const rawModules = import.meta.glob('/writings/**/index.svx', { query: '?raw', import: 'default', eager: true });

const rawFiles: RawPostFile[] = Object.entries(modules).map(([path, mod]) => ({
	path,
	slug: slugFromPath(path),
	content: typeof rawModules[path] === 'string' ? rawModules[path] : '',
	metadata: (mod as PostModule).metadata ?? {},
}));

const posts = validatePosts(rawFiles);

export function getAllPosts() {
	return Promise.resolve(posts);
}

export function getPost(slug: string): Promise<LoadedPost | null> {
	const path = `/writings/${slug}/index.svx`;
	const mod = modules[path] as PostModule | undefined;
	const post = posts.find((item) => item.slug === slug);
	return Promise.resolve(mod && post ? { post, component: mod.default } : null);
}

export { getAssetUrl };
