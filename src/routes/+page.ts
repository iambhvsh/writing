import { getAllPosts } from '$lib/content.js';
import type { PageLoad } from './$types.js';

export const prerender = true;

export const load: PageLoad = async ({ url }) => {
	const posts = await getAllPosts();
	return { origin: url.origin, posts: posts.slice(0, 6) };
};
