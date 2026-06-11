import { getAllPosts, getPost } from '$lib/content.js';
import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types.js';

export const prerender = true;

export const entries: EntryGenerator = async () => {
	const posts = await getAllPosts();
	return posts.map((post) => ({ slug: post.slug }));
};

export const load: PageLoad = async ({ params, url }) => {
	const result = await getPost(params.slug);

	if (!result) {
		error(404, { message: 'Post not found' });
	}

	return { ...result, origin: url.origin };
};
