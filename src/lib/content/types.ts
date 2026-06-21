import type { Component } from 'svelte';

export interface BasePost {
	slug: string;
	title: string;
	description: string;
	publishedAt: string;
	tags: readonly string[];
	readingTime: number;
}

export type Post =
	| (BasePost & { cover: string; coverAlt: string })
	| (BasePost & { cover?: undefined; coverAlt?: undefined });

export interface PostModule {
	metadata: Record<string, object | string | number | boolean | Date | readonly string[] | undefined>;
	default: Component;
}

export interface LoadedPost {
	post: Post;
	component: Component;
}

export interface RawPostFile {
	path: string;
	slug: string;
	content: string;
	metadata: Record<string, object | string | number | boolean | Date | readonly string[] | undefined>;
}

export interface AssetReference {
	path: string;
	kind: 'cover' | 'image' | 'link' | 'video' | 'poster';
}
