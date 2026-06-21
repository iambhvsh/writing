import { siteConfig } from './config.js';
import type { Post } from './content/index.js';

export interface SeoMeta {
	title: string;
	description: string;
	canonical: string;
	og: OgMeta;
	twitter: TwitterMeta;
	jsonLd: string;
}

interface OgMeta {
	title: string;
	description: string;
	url: string;
	type: 'website' | 'article';
	image: string;
	imageAlt: string;
	siteName: string;
	publishedTime?: string;
	author?: string;
	tags?: readonly string[];
}

interface TwitterMeta {
	card: 'summary_large_image';
	title: string;
	description: string;
	image: string;
	site?: string;
	creator?: string;
}

function serializeJsonLd(value: unknown): string {
	return JSON.stringify(value).replace(/</g, '\\u003c');
}

export function buildSeo(options: {
	title?: string;
	seoTitle?: string;
	description?: string;
	path?: string;
	origin?: string;
	post?: Post;
}): SeoMeta {
	const { title, seoTitle, description, path = '/', origin, post } = options;

	const pageTitle = seoTitle ?? (title ? `${title} | ${siteConfig.title}` : siteConfig.title);
	const pageDesc = description ?? siteConfig.description;
	const baseUrl = (origin ?? siteConfig.url).replace(/\/$/, '');
	const pagePath = path.startsWith('/') ? path : `/${path}`;
	const canonical = `${baseUrl}${pagePath}`;
	const fallbackImage = siteConfig.ogImage ?? '/og.png';
	const imagePath = post ? (post.cover ?? `${pagePath}/og.png`) : fallbackImage;
	const ogImage = imagePath.startsWith('http') ? imagePath : `${baseUrl}${imagePath}`;

	const og: OgMeta = {
		title: pageTitle,
		description: pageDesc,
		url: canonical,
		type: post ? 'article' : 'website',
		image: ogImage,
		imageAlt: post ? (post.coverAlt ?? post.title) : siteConfig.title,
		siteName: siteConfig.title,
		...(post && {
			publishedTime: new Date(post.publishedAt).toISOString(),
			author: siteConfig.author,
			tags: post.tags,
		}),
	};

	const twitter: TwitterMeta = {
		card: 'summary_large_image',
		title: pageTitle,
		description: pageDesc,
		image: ogImage,
		...(siteConfig.twitter && {
			site: siteConfig.twitter,
			creator: siteConfig.twitter,
		}),
	};

	const jsonLd = serializeJsonLd(
		post
			? {
					'@context': 'https://schema.org',
					'@type': 'BlogPosting',
					headline: post.title,
					description: post.description,
					author: {
						'@type': 'Person',
						name: siteConfig.author,
						url: siteConfig.authorUrl,
					},
					datePublished: new Date(post.publishedAt).toISOString(),
					url: canonical,
					image: ogImage,
					keywords: post.tags.join(', '),
					publisher: {
						'@type': 'Organization',
						name: siteConfig.title,
						url: baseUrl,
					},
				}
			: {
					'@context': 'https://schema.org',
					'@type': 'WebSite',
					name: siteConfig.title,
					description: siteConfig.description,
					url: baseUrl,
					author: {
						'@type': 'Person',
						name: siteConfig.author,
						url: siteConfig.authorUrl,
					},
				}
	);

	return {
		title: pageTitle,
		description: pageDesc,
		canonical,
		og,
		twitter,
		jsonLd,
	};
}
