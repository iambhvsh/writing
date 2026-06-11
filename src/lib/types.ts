export interface Post {
	slug: string;
	title: string;
	description: string;
	publishedAt: string;
	tags: string[];
	cover?: string;
	coverAlt?: string;
	readingTime: number;
}

export interface SiteConfig {
	title: string;
	description: string;
	url: string;
	author: string;
	authorUrl: string;
	twitter?: string;
	ogImage?: string;
}
