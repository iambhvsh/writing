import { html } from 'satori-html';
import { getAllPosts, getPost } from '$lib/content.js';
import { error } from '@sveltejs/kit';
import { formatDate } from '$lib/utils.js';
import { getOgFonts, renderOgImage } from '$lib/og.js';
import type { EntryGenerator, RequestHandler } from './$types.js';

export const prerender = true;

export const entries: EntryGenerator = async () => {
	const posts = await getAllPosts();
	return posts.filter((post) => !post.cover).map((post) => ({ slug: post.slug }));
};

export const GET: RequestHandler = async ({ params }) => {
	const result = await getPost(params.slug);
	if (!result) {
		error(404, 'Post not found');
	}

	const post = result.post;
	if (post.cover) {
		error(404, 'Cover image is used for this post');
	}

	const date = formatDate(post.publishedAt);

	const markup = html`
		<div
			style="background-color: #ffffff; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: space-between; padding: 100px; font-family: 'Inter';"
		>
			<div style="display: flex; flex-direction: column; flex: 1; justify-content: center;">
				<div
					style="font-size: 28px; font-weight: 400; color: #888; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 32px;"
				>
					${date}
				</div>
				<h1
					style="font-family: 'Instrument Serif'; font-size: 100px; font-weight: 400; color: #111; line-height: 1.1; margin: 0 0 32px 0; letter-spacing: 0;"
				>
					${post.title}
				</h1>
				<p
					style="font-size: 36px; font-weight: 400; color: #666; margin: 0; line-height: 1.4; max-width: 900px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
				>
					${post.description}
				</p>
			</div>
			<div style="display: flex; align-items: center; margin-top: auto;">
				<div
					style="display: flex; font-size: 28px; font-weight: 400; color: #333; letter-spacing: 0;"
				>
					Bhavesh Patil
				</div>
			</div>
		</div>
	`;

	const pngData = await renderOgImage(markup, await getOgFonts([400, 500, 600]));

	return new Response(pngData, {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=31536000, immutable',
		},
	});
};
