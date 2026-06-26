export interface Post {
	slug: string;
	title: string;
	description: string;
	publishedAt: string;
	updatedAt?: string;
	tags: string[];
	cover?: string;
	coverAlt?: string;
	readingTime: number;
	plainText: string;
	wordCount: number;
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
