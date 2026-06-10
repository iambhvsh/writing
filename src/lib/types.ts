export interface PostFrontmatter {
	title: string;
	description: string;
	tags: string[];
	cover?: string;
	coverAlt?: string;
}

export interface Post {
	slug: string;
	title: string;
	description: string;
	publishedAt: string;
	tags: string[];
	cover?: string;
	coverAlt?: string;
	readingTime: number;
	toc?: TocEntry[];
}

export interface TocEntry {
	id: string;
	text: string;
	level: number;
	children?: TocEntry[];
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

export interface SearchResult {
	slug: string;
	title: string;
	description: string;
	excerpt: string;
	tags: string[];
}

export interface RssFeed {
	title: string;
	description: string;
	link: string;
	items: RssItem[];
}

export interface RssItem {
	title: string;
	description: string;
	link: string;
	pubDate: string;
	guid: string;
}
