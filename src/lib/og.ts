import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs/promises';
import { join } from 'node:path';
import satori from 'satori';

const ogSize = {
	width: 1200,
	height: 630,
} as const;

type FontWeight = 400 | 500 | 600;
type OgMarkup = Parameters<typeof satori>[0];

interface OgFont {
	name: 'Inter' | 'Instrument Serif';
	data: Buffer;
	weight: FontWeight;
	style: 'normal';
}

const interFontFiles: Record<FontWeight, string> = {
	400: 'inter-latin-400-normal.ttf',
	500: 'inter-latin-500-normal.ttf',
	600: 'inter-latin-600-normal.ttf',
};

const serifFontFile = 'InstrumentSerif-Regular.ttf';

function interFontFile(weight: FontWeight): string {
	return interFontFiles[weight];
}

async function readOgFont(file: string): Promise<Buffer> {
	return fs.readFile(join(process.cwd(), 'static/fonts/og', file));
}

export async function getOgFonts(weights: FontWeight[] = [400]): Promise<OgFont[]> {
	const fonts: OgFont[] = await Promise.all(
		weights.map(async (weight) => ({
			name: 'Inter',
			data: await readOgFont(interFontFile(weight)),
			weight,
			style: 'normal',
		}))
	);

	fonts.push({
		name: 'Instrument Serif',
		data: await readOgFont(serifFontFile),
		weight: 400,
		style: 'normal',
	});

	return fonts;
}

export async function renderOgImage(markup: OgMarkup, fonts: OgFont[]): Promise<Blob> {
	const svg = await satori(markup, {
		width: ogSize.width,
		height: ogSize.height,
		fonts,
	});

	const png = new Resvg(svg, {
		fitTo: {
			mode: 'width',
			value: ogSize.width,
		},
	})
		.render()
		.asPng();

	const arrayBuffer = new ArrayBuffer(png.byteLength);
	new Uint8Array(arrayBuffer).set(png);

	return new Blob([arrayBuffer], { type: 'image/png' });
}
