// @ts-expect-error - satori-html has no types
import { html } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { getPost, getAllPosts } from '$lib/content.js';
import { error } from '@sveltejs/kit';
import { formatDate } from '$lib/utils.js';
import type { RequestHandler, EntryGenerator } from './$types.js';

export const prerender = true;

export const entries: EntryGenerator = async () => {
	const posts = await getAllPosts();
	return posts.map((post) => ({ slug: post.slug }));
};

const width = 1200;
const height = 630;

export const GET: RequestHandler = async ({ params }) => {
	const result = await getPost(params.slug);
	if (!result) {
		error(404, 'Post not found');
	}

	const post = result.post;
	const date = formatDate(post.publishedAt);

	const fontData = Buffer.from(
		await (
			await fetch(
				'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf'
			)
		).arrayBuffer()
	);

	const markup = html`
		<div style="background-color: #ffffff; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 80px; font-family: 'Inter';">
			<div style="display: flex; flex-direction: column; width: 100%; height: 100%; border: 1px solid #eaeaea; border-radius: 24px; padding: 60px; background-color: #fafafa; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
				<div style="display: flex; flex-direction: column; flex: 1; justify-content: center;">
					<div style="font-size: 24px; font-weight: 500; color: #888; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 24px;">${date}</div>
					<h1 style="font-size: 72px; font-weight: 600; color: #111; line-height: 1.1; margin: 0 0 24px 0; letter-spacing: -2px;">${post.title}</h1>
					<p style="font-size: 32px; font-weight: 400; color: #666; margin: 0; line-height: 1.4; max-width: 800px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${post.description}</p>
				</div>
				<div style="display: flex; align-items: center; margin-top: auto;">
					<div style="display: flex; font-size: 24px; font-weight: 600; color: #111; letter-spacing: -0.5px;">Bhavesh Patil</div>
				</div>
			</div>
		</div>
	`;

	const svg = await satori(markup, {
		width,
		height,
		fonts: [
			{
				name: 'Inter',
				data: fontData,
				weight: 400,
				style: 'normal',
			},
			{
				name: 'Inter',
				data: fontData,
				weight: 500,
				style: 'normal',
			},
			{
				name: 'Inter',
				data: fontData,
				weight: 600,
				style: 'normal',
			}
		],
	});

	const resvg = new Resvg(svg, {
		fitTo: {
			mode: 'width',
			value: width,
		},
	});
	const pngData = resvg.render().asPng();

	return new Response(pngData as unknown as BodyInit, {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=31536000, immutable',
		},
	});
};
