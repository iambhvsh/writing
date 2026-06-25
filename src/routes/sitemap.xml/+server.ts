import { getAllPosts } from '$lib/content.js';
import { siteConfig } from '$lib/config.js';
import { xmlText } from '$lib/xml.js';
import type { RequestHandler } from './$types.js';

export const prerender = true;

export const GET: RequestHandler = async () => {
	const posts = await getAllPosts();

	const staticUrls = [{ path: '/', priority: '1.0', changefreq: 'weekly' }]
		.map(
			({ path, priority, changefreq }) => `
  <url>
    <loc>${xmlText(`${siteConfig.url}${path}`)}</loc>
    <priority>${priority}</priority>
    <changefreq>${changefreq}</changefreq>
  </url>`
		)
		.join('');

	const postUrls = posts
		.map((post) => {
			const lastmod = new Date(post.publishedAt).toISOString().split('T')[0] ?? '';
			const baseUrl = siteConfig.url.replace(/\/$/, '');
			const imagePath = post.cover ?? `/${post.slug}/og.png`;
			const imageUrl = imagePath.startsWith('http') ? imagePath : `${baseUrl}${imagePath}`;
			return `
  <url>
    <loc>${xmlText(`${siteConfig.url}/${post.slug}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>0.8</priority>
    <changefreq>monthly</changefreq>
    <image:image>
      <image:loc>${xmlText(imageUrl)}</image:loc>
    </image:image>
  </url>`;
		})
		.join('');

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${staticUrls}
  ${postUrls}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'max-age=0, s-maxage=86400',
		},
	});
};
