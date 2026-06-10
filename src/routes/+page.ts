import { getAllPosts } from '$lib/content.js';
import type { PageLoad } from './$types.js';

export const prerender = true;

export const load: PageLoad = async () => {
	const posts = await getAllPosts();
	return { posts: posts.slice(0, 6) };
};
