export interface Post {
	slug: string;
	title: string;
	description: string;
	publishedAt: string;
	updatedAt?: string;
	tags: string[];
	cover?: string;
	coverSourcePath?: string;
	coverAlt?: string;
	readingTime: number;
	plainText: string;
	wordCount: number;
	body: string;
}

export interface SiteConfig {
	title: string;
	description: string;
	url: string;
	author: string;
	authorUrl: string;
	twitter?: string;
	ogImage?: string;
	rssLimit?: number;
}
