import type { Post, PostFrontmatter } from './types.js';

const WRITINGS_ROOT = '/writings/';
declare const __WRITING_DATES__: Record<string, { publishedAt: string }>;
const writingDates = __WRITING_DATES__;

// Glob import all post entry files from writings/<slug>/index.svx|md
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

function slugFromPath(path: string): string {
	return path.replace(WRITINGS_ROOT, '').replace(/\/index\.(svx|md)$/, '');
}

function calcReadingTime(content: string): number {
	const text = content
		.replace(/^---[\s\S]*?---/, ' ')
		.replace(/<[^>]*>/g, ' ')
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/`[^`]*`/g, ' ')
		.replace(/[#>*_[\]()~-]/g, ' ')
		.replace(/&[a-z\d#]+;/gi, ' ')
		.trim();
	const wordCount = text.match(/[\w]+(?:['-][\w]+)*/g)?.length ?? 0;
	return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

async function getRawContent(path: string): Promise<string> {
	const loader = rawModules[path];
	return loader ? ((await loader()) as string) : '';
}

function resolveCover(path: string, cover: string | undefined): string | undefined {
	if (!cover) return undefined;
	if (/^(https?:)?\/\//.test(cover) || cover.startsWith('/')) return cover;

	const postDir = path.replace(/\/index\.(svx|md)$/, '');
	const coverPath = `${postDir}/${cover.replace(/^\.\//, '')}`.replace(/\/+/g, '/');
	return imageModules[coverPath] as string | undefined;
}

function buildPost(path: string, metadata: PostFrontmatter, readingTime: number): Post {
	const slug = slugFromPath(path);
	const cover = resolveCover(path, metadata.cover);
	const publishedAt = writingDates[slug]?.publishedAt ?? new Date(0).toISOString();

	const post: Post = {
		slug,
		title: metadata.title,
		description: metadata.description,
		publishedAt,
		tags: metadata.tags ?? [],
		readingTime,
	};

	if (cover !== undefined) post.cover = cover;
	if (metadata.coverAlt !== undefined) post.coverAlt = metadata.coverAlt;

	return post;
}

export async function getAllPosts(): Promise<Post[]> {
	const posts: Post[] = [];

	for (const [path, loader] of Object.entries(modules)) {
		const mod = (await loader()) as {
			metadata: PostFrontmatter;
			default: { render?: () => { html: string } };
		};

		const rawContent = await getRawContent(path);
		const rt = rawContent ? calcReadingTime(rawContent) : 1;
		posts.push(buildPost(path, mod.metadata, rt));
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

	const mod = (await loader()) as {
		metadata: PostFrontmatter;
		default: { render?: () => { html: string } };
	};

	const rawContent = await getRawContent(path in modules ? path : mdPath);
	const rt = rawContent ? calcReadingTime(rawContent) : 1;
	const postData = buildPost(path in modules ? path : mdPath, mod.metadata, rt);

	return {
		post: postData,
		component: mod.default,
	};
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
	const all = await getAllPosts();
	return all.filter((p) => p.tags.includes(tag));
}

export async function getAllTags(): Promise<Record<string, number>> {
	const all = await getAllPosts();
	const counts: Record<string, number> = {};
	for (const post of all) {
		for (const tag of post.tags) {
			counts[tag] = (counts[tag] ?? 0) + 1;
		}
	}
	return counts;
}

export async function getRelatedPosts(
	currentSlug: string,
	tags: string[],
	limit = 3
): Promise<Post[]> {
	const all = await getAllPosts();
	return all
		.filter((p) => p.slug !== currentSlug)
		.map((p) => ({
			post: p,
			score: p.tags.filter((t) => tags.includes(t)).length,
		}))
		.filter(({ score }) => score > 0)
		.sort((a, b) => b.score - a.score)
		.slice(0, limit)
		.map(({ post }) => post);
}

export async function getAdjacentPosts(
	currentSlug: string
): Promise<{ prev: Post | null; next: Post | null }> {
	const all = await getAllPosts();
	const idx = all.findIndex((p) => p.slug === currentSlug);
	return {
		prev: idx < all.length - 1 ? (all[idx + 1] ?? null) : null,
		next: idx > 0 ? (all[idx - 1] ?? null) : null,
	};
}
