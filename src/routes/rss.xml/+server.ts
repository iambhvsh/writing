import { getAllPosts } from '$lib/content.js';
import { siteConfig } from '$lib/config.js';
import { getPostImageUrl } from '$lib/seo.js';
import { xmlCdata, xmlText } from '$lib/xml.js';
import { compileMarkdownToHtml } from '$lib/rss-content.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { RequestHandler } from './$types.js';

export const prerender = true;

function getMimeType(filePath: string): string {
	const ext = path.extname(filePath).toLowerCase();
	switch (ext) {
		case '.png':
			return 'image/png';
		case '.jpg':
		case '.jpeg':
			return 'image/jpeg';
		case '.webp':
			return 'image/webp';
		case '.gif':
			return 'image/gif';
		case '.avif':
			return 'image/avif';
		default:
			return 'application/octet-stream';
	}
}

async function getEnclosureLength(filePath: string): Promise<string | null> {
	try {
		const stat = await fs.stat(filePath);
		return stat.size.toString();
	} catch {
		return null;
	}
}

function truncateDescription(text: string, length = 155): string {
	if (text.length <= length) return text;
	const lastSpace = text.lastIndexOf(' ', length);
	return lastSpace > 0 ? text.slice(0, lastSpace) + '…' : text.slice(0, length) + '…';
}

export const GET: RequestHandler = async () => {
	const posts = await getAllPosts();
	const newestPostTime = Math.max(
		...posts.map((post) => new Date(post.updatedAt ?? post.publishedAt).getTime())
	);
	const lastBuildDate = new Date(
		Number.isFinite(newestPostTime) ? newestPostTime : 0
	).toUTCString();

	const items = await Promise.all(
		posts.slice(0, siteConfig.rssLimit ?? 20).map(async (post) => {
			const imageUrl = getPostImageUrl(post, siteConfig.url);
			let enclosure = '';

			if (post.coverSourcePath) {
				const normalizedCoverPath = post.coverSourcePath.replace(/^\/+/, '');
				const resolvedCoverPath = path.resolve(process.cwd(), normalizedCoverPath);
				const length = await getEnclosureLength(resolvedCoverPath);
				if (length) {
					const type = getMimeType(normalizedCoverPath);
					enclosure = `\n      <enclosure url="${xmlText(imageUrl)}" length="${length}" type="${type}" />`;
				}
			}

			const contentHtml = await compileMarkdownToHtml(post.body, post.slug);
			// Reformat category to not alter case, use post tags directly
			const categories = post.tags
				.map((tag) => `\n      <category>${xmlCdata(tag)}</category>`)
				.join('');

			// Generate 120-180 char description
			const safeDesc = truncateDescription(post.description || post.plainText, 155);

			return `
    <item>
      <title>${xmlCdata(post.title)}</title>
      <description>${xmlCdata(safeDesc)}</description>
      <link>${xmlText(`${siteConfig.url}/${post.slug}`)}</link>
      <guid isPermaLink="true">${xmlText(`${siteConfig.url}/${post.slug}`)}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>${enclosure}
      <author>${xmlText(`${siteConfig.email} (${siteConfig.author})`)}</author>
      <dc:creator>${xmlCdata(siteConfig.author)}</dc:creator>${categories}
      <content:encoded>${xmlCdata(contentHtml)}</content:encoded>
    </item>`;
		})
	);

	const itemsXml = items.join('');
	const channelImageUrl = xmlText(new URL(siteConfig.ogImage ?? '/og.png', siteConfig.url).href);

	const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${xmlCdata(siteConfig.title)}</title>
    <description>${xmlCdata(siteConfig.description)}</description>
    <link>${xmlText(siteConfig.url)}</link>
    <atom:link href="${xmlText(`${siteConfig.url}/rss.xml`)}" rel="self" type="application/rss+xml"/>
    <language>en-US</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <generator>${xmlText(siteConfig.url)}</generator>
    <docs>https://www.rssboard.org/rss-specification</docs>
    <ttl>360</ttl>
    <copyright>${xmlText(`© ${new Date().getFullYear().toString()} ${siteConfig.author}`)}</copyright>
    <managingEditor>${xmlText(`${siteConfig.email} (${siteConfig.author})`)}</managingEditor>
    <webMaster>${xmlText(`${siteConfig.email} (${siteConfig.author})`)}</webMaster>
    <image>
      <url>${channelImageUrl}</url>
      <title>${xmlCdata(siteConfig.title)}</title>
      <link>${xmlText(siteConfig.url)}</link>
    </image>
    ${itemsXml}
  </channel>
</rss>`;

	return new Response(rss.trim(), {
		headers: {
			'Content-Type': 'application/rss+xml; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
		},
	});
};
