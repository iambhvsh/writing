import { getAllPosts, getAssetUrl } from '$lib/content.js';
import { error, redirect } from '@sveltejs/kit';
import type { EntryGenerator, RequestHandler } from './$types.js';

export const prerender = true;

const assetModules = import.meta.glob('/writings/*/*', {
	query: '?url',
	import: 'default',
	eager: true,
});

export const entries: EntryGenerator = () => {
	return Object.keys(assetModules)
		.filter((path) => !path.endsWith('/index.svx'))
		.map((path) => {
			const [, , slug, asset] = path.split('/');
			return slug && asset ? { slug, asset } : undefined;
		})
		.filter((entry): entry is { slug: string; asset: string } => entry !== undefined);
};

export const GET: RequestHandler = async ({ params }) => {
	const posts = await getAllPosts();
	if (!posts.some((post) => post.slug === params.slug)) error(404, 'Post not found');
	const assetUrl = getAssetUrl(`/writings/${params.slug}/index.svx`, `./${params.asset}`);
	if (!assetUrl) error(404, 'Asset not found');
	redirect(308, assetUrl);
};
