import { getPost } from '$lib/content.js';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types.js';

export const prerender = true;

export const load: PageLoad = async ({ params, url }) => {
	const result = await getPost(params.slug);

	if (!result) {
		error(404, { message: 'Post not found' });
	}

	return { ...result, origin: url.origin };
};
