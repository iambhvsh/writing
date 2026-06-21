import type { Post } from './types.js';

export interface ParsedFrontmatter {
	title: string;
	description: string;
	publishedAt: string;
	tags: readonly string[];
	coverImage?: string;
	coverAlt?: string;
}

export function isRecord(value: object | string | number | boolean | Date | readonly string[] | undefined): value is Record<string, never> {
	return typeof value === 'object' && value !== null && !(value instanceof Date) && !Array.isArray(value);
}

export function normalizePublishedAt(value: string | Date): string | undefined {
	if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
		return new Date(`${value}T00:00:00.000Z`).toISOString();
	}
	const timestamp = value instanceof Date ? value.getTime() : Date.parse(value);
	return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : undefined;
}

export function parseTags(value: string): readonly string[] {
	return value.split(',').map((tag) => tag.trim()).filter(Boolean);
}

export function buildPost(input: ParsedFrontmatter & { slug: string; readingTime: number; cover?: string }): Post {
	const base = {
		slug: input.slug,
		title: input.title,
		description: input.description,
		publishedAt: input.publishedAt,
		tags: input.tags,
		readingTime: input.readingTime,
	};
	return input.cover ? { ...base, cover: input.cover, coverAlt: input.coverAlt ?? '' } : base;
}
