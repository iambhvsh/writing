import { siteConfig } from './config.js';
import type { Post } from './types.js';

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
	modifiedTime?: string;
	author?: string;
	tags?: string[];
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

export function getPostImageUrl(post: Post, baseUrl: string): string {
	const normalizedBase = baseUrl.replace(/\/$/, '');
	const imagePath = post.cover ?? `/${post.slug}/og.png`;
	return imagePath.startsWith('http') ? imagePath : `${normalizedBase}${imagePath}`;
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
	const ogImage = post
		? getPostImageUrl(post, baseUrl)
		: fallbackImage.startsWith('http')
			? fallbackImage
			: `${baseUrl}${fallbackImage}`;

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
			...(post.updatedAt && { modifiedTime: new Date(post.updatedAt).toISOString() }),
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

	const publisherLogo = {
		'@type': 'ImageObject',
		url: `${baseUrl}/og.png`,
	};

	const organizationSchema = {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: siteConfig.title,
		url: baseUrl,
		logo: publisherLogo,
		image: `${baseUrl}/og.png`,
		description: siteConfig.description,
		founder: {
			'@type': 'Person',
			name: siteConfig.author,
			url: siteConfig.authorUrl,
		},
		sameAs: [siteConfig.authorUrl],
	};

	const jsonLd = serializeJsonLd(
		post
			? [
					{
						'@context': 'https://schema.org',
						'@type': 'BlogPosting',
						mainEntityOfPage: {
							'@type': 'WebPage',
							'@id': canonical,
						},
						headline: post.title,
						description: post.description,
						articleBody: post.plainText,
						wordCount: post.wordCount,
						inLanguage: 'en-US',
						isAccessibleForFree: true,
						url: canonical,
						image: ogImage,
						keywords: post.tags.join(', '),
						datePublished: new Date(post.publishedAt).toISOString(),
						...(post.updatedAt && { dateModified: new Date(post.updatedAt).toISOString() }),
						author: {
							'@type': 'Person',
							name: siteConfig.author,
							url: siteConfig.authorUrl,
						},
						publisher: organizationSchema,
					},
					{
						'@context': 'https://schema.org',
						'@type': 'BreadcrumbList',
						itemListElement: [
							{
								'@type': 'ListItem',
								position: 1,
								name: 'Home',
								item: baseUrl,
							},
							{
								'@type': 'ListItem',
								position: 2,
								name: post.title,
								item: canonical,
							},
						],
					},
				]
			: [
					{
						'@context': 'https://schema.org',
						'@type': 'WebSite',
						name: siteConfig.title,
						description: siteConfig.description,
						url: baseUrl,
						inLanguage: 'en-US',
					},
					organizationSchema,
				]
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
