import { html } from 'satori-html';
import { siteConfig } from '$lib/config.js';
import { getOgFonts, renderOgImage } from '$lib/og.js';

export const prerender = true;

export async function GET() {
	const markup = html`
		<div
			style="background-color: #ffffff; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: space-between; padding: 100px; font-family: 'Inter';"
		>
			<div style="display: flex; flex-direction: column; flex: 1; justify-content: center;">
				<h1
					style="font-family: 'Instrument Serif'; font-size: 110px; font-weight: 400; color: #111; line-height: 1; margin: 0 0 32px 0; letter-spacing: 0;"
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
					style="display: flex; font-size: 28px; font-weight: 400; color: #333; letter-spacing: 0;"
				>
					writing.iambhvsh.in
				</div>
			</div>
		</div>
	`;

	const pngData = await renderOgImage(markup, await getOgFonts());

	return new Response(pngData, {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=31536000, immutable',
		},
	});
}
