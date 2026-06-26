import type { Post } from './types.js';

const WRITINGS_ROOT = '/writings/';

const modules = import.meta.glob('/writings/**/index.{svx,md}', {
	eager: false,
});

const rawModules = import.meta.glob('/writings/**/index.{svx,md}', {
	query: '?raw',
	import: 'default',
	eager: false,
});

const imageModules = import.meta.glob('/writings/**/*.{avif,gif,jpeg,jpg,png,webp}', {
	query: '?url',
	import: 'default',
	eager: true,
});

const WORDS_PER_MINUTE = 200;

interface PostModule {
	metadata: unknown;
	default: unknown;
}

interface NormalizedPostMetadata {
	title: string;
	description: string;
	publishedAt: string;
	updatedAt?: string;
	tags: string[];
	cover?: string;
	coverAlt?: string;
}

function slugFromPath(path: string): string {
	return path.replace(WRITINGS_ROOT, '').replace(/\/index\.(svx|md)$/, '');
}

function parseContentMetrics(content: string): {
	plainText: string;
	wordCount: number;
	readingTime: number;
} {
	// Strip frontmatter
	let plainText = content.replace(/^---[\s\S]*?---/, '');
	// Remove HTML tags (repeat until stable to avoid incomplete multi-character sanitization)
	let previous: string;
	do {
		previous = plainText;
		plainText = plainText.replace(/<[^>]*>/g, '');
	} while (plainText !== previous);
	// Keep only human-readable text from markdown links/images
	plainText = plainText
		.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
	// Remove markdown formatting but keep the readable text
	plainText = plainText.replace(/[`#>*_[\]()~-]/g, ' ');
	// Replace entities
	plainText = plainText.replace(/&[a-z\d#]+;/gi, ' ');
	// Normalize whitespace
	plainText = plainText.replace(/\s+/g, ' ').trim();

	const wordCount = plainText.match(/[\w]+(?:['-][\w]+)*/g)?.length ?? 0;
	const readingTime = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));

	return { plainText, wordCount, readingTime };
}

async function getRawContent(path: string): Promise<string> {
	const loader = rawModules[path];
	return loader ? ((await loader()) as string) : '';
}

function resolveCover(path: string, cover: string | undefined): string | undefined {
	if (cover && (/^(https?:)?\/\//.test(cover) || cover.startsWith('/'))) return cover;

	const postDir = path.replace(/\/index\.(svx|md)$/, '');

	if (cover) {
		const coverPath = `${postDir}/${cover.replace(/^\.\//, '')}`.replace(/\/+/g, '/');
		return imageModules[coverPath] as string | undefined;
	}

	for (const extension of ['avif', 'webp', 'png', 'jpg', 'jpeg']) {
		const coverPath = `${postDir}/cover.${extension}`;
		const resolvedCover = imageModules[coverPath] as string | undefined;
		if (resolvedCover) return resolvedCover;
	}

	return undefined;
}

function isStringArray(value: unknown): value is string[] {
	return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function readTags(path: string, value: unknown): string[] {
	if (value === undefined) return [];

	if (isStringArray(value)) {
		return value.map((tag) => tag.trim()).filter(Boolean);
	}

	if (typeof value === 'string') {
		return value
			.split(',')
			.map((tag) => tag.trim())
			.filter(Boolean);
	}

	throw new Error(`Post tags must be a comma-separated string or an array of strings in ${path}`);
}

function normalizePublishedAt(value: string): string | undefined {
	if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
		return new Date(`${value}T00:00:00.000Z`).toISOString();
	}

	const timestamp = Date.parse(value);
	if (!Number.isFinite(timestamp)) return undefined;

	return new Date(timestamp).toISOString();
}

function readPublishedAt(path: string, value: unknown): string {
	if (typeof value === 'string') {
		const publishedAt = normalizePublishedAt(value);
		if (publishedAt) return publishedAt;
	}

	if (value instanceof Date && Number.isFinite(value.getTime())) return value.toISOString();

	throw new Error(`Post publishedAt must be YYYY-MM-DD or an ISO timestamp in ${path}`);
}

function readPostMetadata(path: string, metadata: unknown): NormalizedPostMetadata {
	if (typeof metadata !== 'object' || metadata === null) {
		throw new Error(`Missing frontmatter in ${path}`);
	}

	const frontmatter = metadata as Record<string, unknown>;

	if (typeof frontmatter.title !== 'string' || frontmatter.title.trim() === '') {
		throw new Error(`Post title must be a non-empty string in ${path}`);
	}

	if (typeof frontmatter.description !== 'string' || frontmatter.description.trim() === '') {
		throw new Error(`Post description must be a non-empty string in ${path}`);
	}

	if (frontmatter.cover !== undefined && typeof frontmatter.cover !== 'string') {
		throw new Error(`Post cover must be a string in ${path}`);
	}

	if (frontmatter.coverAlt !== undefined && typeof frontmatter.coverAlt !== 'string') {
		throw new Error(`Post coverAlt must be a string in ${path}`);
	}

	const normalized: NormalizedPostMetadata = {
		title: frontmatter.title.trim(),
		description: frontmatter.description.trim(),
		publishedAt: readPublishedAt(path, frontmatter.publishedAt),
		tags: readTags(path, frontmatter.tags),
	};

	if (frontmatter.updatedAt !== undefined) {
		normalized.updatedAt = readPublishedAt(path, frontmatter.updatedAt);
	}

	if (frontmatter.cover !== undefined) normalized.cover = frontmatter.cover;
	if (frontmatter.coverAlt !== undefined) normalized.coverAlt = frontmatter.coverAlt;

	return normalized;
}

function buildPost(
	path: string,
	metadata: unknown,
	metrics: { plainText: string; wordCount: number; readingTime: number }
): Post {
	const frontmatter = readPostMetadata(path, metadata);
	const cover = resolveCover(path, frontmatter.cover);

	const post: Post = {
		slug: slugFromPath(path),
		title: frontmatter.title,
		description: frontmatter.description,
		publishedAt: frontmatter.publishedAt,
		tags: frontmatter.tags,
		readingTime: metrics.readingTime,
		plainText: metrics.plainText,
		wordCount: metrics.wordCount,
	};

	if (frontmatter.updatedAt !== undefined) post.updatedAt = frontmatter.updatedAt;

	if (cover !== undefined) post.cover = cover;
	if (frontmatter.coverAlt !== undefined) post.coverAlt = frontmatter.coverAlt;

	return post;
}

export async function getAllPosts(): Promise<Post[]> {
	const posts: Post[] = [];

	for (const [path, loader] of Object.entries(modules)) {
		const mod = (await loader()) as PostModule;

		const rawContent = await getRawContent(path);
		const metrics = rawContent
			? parseContentMetrics(rawContent)
			: { plainText: '', wordCount: 0, readingTime: 1 };
		posts.push(buildPost(path, mod.metadata, metrics));
	}

	return posts.sort(
		(a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
	);
}

export async function getPost(slug: string): Promise<{
	post: Post;
	component: unknown;
} | null> {
	const path = `${WRITINGS_ROOT}${slug}/index.svx`;
	const mdPath = `${WRITINGS_ROOT}${slug}/index.md`;

	const loader = modules[path] ?? modules[mdPath];
	if (!loader) return null;

	const mod = (await loader()) as PostModule;

	const rawContent = await getRawContent(path in modules ? path : mdPath);
	const metrics = rawContent
		? parseContentMetrics(rawContent)
		: { plainText: '', wordCount: 0, readingTime: 1 };
	const postData = buildPost(path in modules ? path : mdPath, mod.metadata, metrics);

	return {
		post: postData,
		component: mod.default,
	};
}
