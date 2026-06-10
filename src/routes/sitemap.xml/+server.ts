import { getAllPosts } from '$lib/content.js';
import { siteConfig } from '$lib/config.js';
import type { RequestHandler } from './$types.js';

export const prerender = true;

export const GET: RequestHandler = async () => {
	const posts = await getAllPosts();

	const staticUrls = [{ path: '/', priority: '1.0', changefreq: 'weekly' }]
		.map(
			({ path, priority, changefreq }) => `
  <url>
    <loc>${siteConfig.url}${path}</loc>
    <priority>${priority}</priority>
    <changefreq>${changefreq}</changefreq>
  </url>`
		)
		.join('');

	const postUrls = posts
		.map((post) => {
			const lastmod = new Date(post.publishedAt).toISOString().split('T')[0] ?? '';
			return `
  <url>
    <loc>${siteConfig.url}/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>0.8</priority>
    <changefreq>monthly</changefreq>
  </url>`;
		})
		.join('');

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
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
