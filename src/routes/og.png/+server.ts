// @ts-expect-error - satori-html has no types
import { html } from 'satori-html';
import { siteConfig } from '$lib/config.js';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import fs from 'node:fs/promises';
import { join } from 'node:path';

export const prerender = true;

const width = 1200;
const height = 630;

export async function GET() {
	const fontPathInter = join(process.cwd(), 'static/fonts/inter-latin-400-normal.ttf');
	const fontDataInter = await fs.readFile(fontPathInter);
	const fontPathSerif = join(process.cwd(), 'static/fonts/InstrumentSerif-Regular.ttf');
	const fontDataSerif = await fs.readFile(fontPathSerif);

	const markup = html`
		<div
			style="background-color: #ffffff; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: space-between; padding: 100px; font-family: 'Inter';"
		>
			<div style="display: flex; flex-direction: column; flex: 1; justify-content: center;">
				<h1
					style="font-family: 'Instrument Serif'; font-size: 110px; font-weight: 400; color: #111; line-height: 1; margin: 0 0 32px 0; letter-spacing: -2px;"
				>
					${siteConfig.title}
				</h1>
				<p
					style="font-size: 40px; font-weight: 400; color: #666; margin: 0; line-height: 1.4; max-width: 900px;"
				>
					${siteConfig.description}
				</p>
			</div>
			<div
				style="display: flex; align-items: center; justify-content: flex-start; margin-top: auto;"
			>
				<div
					style="display: flex; font-size: 28px; font-weight: 400; color: #333; letter-spacing: -0.5px;"
				>
					writing.iambhvsh.in
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
}
