import { getAllPosts } from '$lib/content.js';
import { siteConfig } from '$lib/config.js';
import type { RequestHandler } from './$types.js';

export const prerender = true;

export const GET: RequestHandler = async () => {
	const posts = await getAllPosts();

	const items = posts
		.slice(0, 20)
		.map(
			(post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description}]]></description>
      <link>${siteConfig.url}/${post.slug}</link>
      <guid isPermaLink="true">${siteConfig.url}/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      ${post.tags.map((t) => `<category><![CDATA[${t}]]></category>`).join('\n      ')}
    </item>`
		)
		.join('');

	const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${siteConfig.title}]]></title>
    <description><![CDATA[${siteConfig.description}]]></description>
    <link>${siteConfig.url}</link>
    <atom:link href="${siteConfig.url}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
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
