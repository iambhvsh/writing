import { getAllPosts } from '$lib/content.js';
import { siteConfig } from '$lib/config.js';
import { xmlCdata, xmlText } from '$lib/xml.js';
import type { RequestHandler } from './$types.js';

export const prerender = true;

export const GET: RequestHandler = async () => {
	const posts = await getAllPosts();
	const lastBuildDate = posts[0]?.publishedAt;

	const items = posts
		.slice(0, 20)
		.map((post) => {
			const baseUrl = siteConfig.url.replace(/\/$/, '');
			const imagePath = post.cover ?? `/${post.slug}/og.png`;
			const imageUrl = imagePath.startsWith('http') ? imagePath : `${baseUrl}${imagePath}`;
			return `
    <item>
      <title>${xmlCdata(post.title)}</title>
      <description>${xmlCdata(post.description)}</description>
      <link>${xmlText(`${siteConfig.url}/${post.slug}`)}</link>
      <guid isPermaLink="true">${xmlText(`${siteConfig.url}/${post.slug}`)}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <enclosure url="${xmlText(imageUrl)}" type="image/png" />
      ${post.tags.map((tag) => `<category>${xmlCdata(tag)}</category>`).join('\n      ')}
    </item>`;
		})
		.join('');

	const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlCdata(siteConfig.title)}</title>
    <description>${xmlCdata(siteConfig.description)}</description>
    <link>${xmlText(siteConfig.url)}</link>
    <atom:link href="${xmlText(`${siteConfig.url}/rss.xml`)}" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    ${lastBuildDate ? `<lastBuildDate>${new Date(lastBuildDate).toUTCString()}</lastBuildDate>` : ''}
    ${items}
  </channel>
</rss>`;

	return new Response(rss, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'max-age=0, s-maxage=3600',
		},
	});
};
