// @ts-expect-error - satori-html has no types
import { html } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import fs from 'node:fs/promises';
import { join } from 'node:path';
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

	const fontPathInter = join(process.cwd(), 'static/fonts/inter-latin-400-normal.ttf');
	const fontDataInter = await fs.readFile(fontPathInter);
	const fontPathInter500 = join(process.cwd(), 'static/fonts/inter-latin-500-normal.ttf');
	const fontDataInter500 = await fs.readFile(fontPathInter500);
	const fontPathInter600 = join(process.cwd(), 'static/fonts/inter-latin-600-normal.ttf');
	const fontDataInter600 = await fs.readFile(fontPathInter600);
	const fontPathSerif = join(process.cwd(), 'static/fonts/InstrumentSerif-Regular.ttf');
	const fontDataSerif = await fs.readFile(fontPathSerif);

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
					style="font-family: 'Instrument Serif'; font-size: 100px; font-weight: 400; color: #111; line-height: 1.1; margin: 0 0 32px 0; letter-spacing: -2px;"
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
					style="display: flex; font-size: 28px; font-weight: 400; color: #333; letter-spacing: -0.5px;"
				>
					Bhavesh Patil
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
				data: fontDataInter,
				weight: 400,
				style: 'normal',
			},
			{
				name: 'Inter',
				data: fontDataInter500,
				weight: 500,
				style: 'normal',
			},
			{
				name: 'Inter',
				data: fontDataInter600,
				weight: 600,
				style: 'normal',
			},
			{
				name: 'Instrument Serif',
				data: fontDataSerif,
				weight: 400,
				style: 'normal',
			},
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
