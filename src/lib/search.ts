export interface PagefindData {
	url: string;
	meta: { title?: string };
	excerpt?: string;
	plain_excerpt?: string;
	content?: string;
}

interface PagefindResult {
	data: () => Promise<PagefindData>;
}

export interface Pagefind {
	search: (query: string) => Promise<{ results: PagefindResult[] }>;
	debouncedSearch?: (
		query: string,
		options?: Record<string, never>,
		timeout?: number
	) => Promise<{ results: PagefindResult[] } | null>;
	options?: (options: {
		basePath?: string;
		excerptLength?: number;
		noWorker?: boolean;
	}) => Promise<void>;
	init?: () => Promise<void> | void;
}

export interface SearchResultView {
	url: string;
	title: string;
	excerpt?: string;
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isPhrase(query: string): boolean {
	return query.trim().split(/\s+/).length > 1;
}

function normalizeWhitespace(value: string): string {
	return value.trim().replace(/\s+/g, ' ');
}

function highlightPhrase(content: string, query: string): string | undefined {
	const phrase = normalizeWhitespace(query);
	const searchable = normalizeWhitespace(content);
	const start = searchable.toLowerCase().indexOf(phrase.toLowerCase());

	if (start < 0) return undefined;

	const end = start + phrase.length;
	const excerptStart = Math.max(0, start - 72);
	const excerptEnd = Math.min(searchable.length, end + 72);
	const prefix = excerptStart > 0 ? '...' : '';
	const suffix = excerptEnd < searchable.length ? '...' : '';
	const snippet = `${prefix}${searchable.slice(excerptStart, excerptEnd)}${suffix}`;

	return escapeHtml(snippet).replace(
		new RegExp(escapeRegExp(phrase), 'i'),
		(match) => `<mark>${match}</mark>`
	);
}

function sanitizePagefindExcerpt(excerpt: string): string {
	return escapeHtml(excerpt)
		.replace(/&lt;mark&gt;/g, '<mark>')
		.replace(/&lt;\/mark&gt;/g, '</mark>');
}

export function normalizeResultUrl(url: string): string {
	return (
		url
			.replace(/\/index\.html(?=($|[?#]))/, '/')
			.replace(/\.html(?=($|[?#]))/, '')
			.replace(/\/$/, '') || '/'
	);
}

export function buildSearchExcerpt(data: PagefindData, query: string): string | undefined {
	if (isPhrase(query) && data.content) {
		const phraseExcerpt = highlightPhrase(data.content, query);
		if (phraseExcerpt) return phraseExcerpt;
	}

	if (data.excerpt) return sanitizePagefindExcerpt(data.excerpt);
	if (data.plain_excerpt) return escapeHtml(data.plain_excerpt);
	return undefined;
}
