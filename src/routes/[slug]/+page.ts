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

	const allPosts = await getAllPosts();
	const chronological = [...allPosts].sort(
		(a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
	);
	const currentIndex = chronological.findIndex((p) => p.slug === params.slug);
	const prevPost = currentIndex > 0 ? chronological[currentIndex - 1] : null;
	const nextPost =
		currentIndex >= 0 && currentIndex < chronological.length - 1
			? chronological[currentIndex + 1]
			: null;

	return {
		...result,
		origin: url.origin,
		prevPost: prevPost ? { slug: prevPost.slug, title: prevPost.title } : null,
		nextPost: nextPost ? { slug: nextPost.slug, title: nextPost.title } : null
	};
};
