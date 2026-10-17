import { getAllPosts } from '$lib/content.js';
import type { PageLoad } from './$types.js';

export const prerender = true;

export const load: PageLoad = async ({ url }) => {
	const posts = await getAllPosts();
	const mappedPosts = posts.map(
		({ slug, title, description, publishedAt, tags, readingTime, cover, coverAlt }) => ({
			slug,
			title,
			description,
			publishedAt,
			tags,
			readingTime,
			...(cover ? { cover } : {}),
			...(coverAlt ? { coverAlt } : {})
		})
	);
	return { origin: url.origin, posts: mappedPosts };
};
