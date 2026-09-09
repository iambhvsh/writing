export interface PagefindData {
	url: string;
	meta: { title?: string };
	excerpt?: string;
	plain_excerpt?: string;
	content?: string;
}

export interface PagefindResult {
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

export interface SearchMatch {
	excerpt: string;
	fragmentUrl: string;
}

export interface SearchResultGroup {
	url: string;
	title: string;
	matches: SearchMatch[];
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

function normalizeWhitespace(value: string): string {
	return value.trim().replace(/\s+/g, ' ');
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

export async function buildSearchGroups(result: PagefindResult, query: string): Promise<SearchResultGroup | null> {
    const data = await result.data();
	const url = normalizeResultUrl(data.url);
	const title = data.meta.title ?? 'Post';


	if (!data.content) {
		let excerpt = '';
		if (data.excerpt) excerpt = sanitizePagefindExcerpt(data.excerpt);
		else if (data.plain_excerpt) excerpt = escapeHtml(data.plain_excerpt);

		if (excerpt) {
			return {
				url,
				title,
				matches: [{ excerpt, fragmentUrl: url }]
			};
		}
		return null;
	}

	const searchable = normalizeWhitespace(data.content);
	const phrase = normalizeWhitespace(query);
	const regex = new RegExp(escapeRegExp(phrase), 'gi');

	const matches: SearchMatch[] = [];
	const rawMatches: { start: number; end: number }[] = [];
	let match;

	// Gather all matches
	while ((match = regex.exec(searchable)) !== null) {
		rawMatches.push({ start: match.index, end: match.index + phrase.length });
	}

	if (rawMatches.length > 0) {
		// Group nearby matches to avoid duplicate snippets
		const groupedMatches: { start: number; end: number; matchCoords: {start: number, end: number}[] }[] = [];
		const contextRadius = 40;

		for (const m of rawMatches) {
			let excerptStart = Math.max(0, m.start - contextRadius);
			const spaceBefore = searchable.lastIndexOf(' ', excerptStart);
			if (spaceBefore !== -1) excerptStart = spaceBefore + 1;

			let excerptEnd = Math.min(searchable.length, m.end + contextRadius);
			const spaceAfter = searchable.indexOf(' ', excerptEnd);
			if (spaceAfter !== -1) excerptEnd = spaceAfter;

			const lastGroup = groupedMatches.length > 0 ? groupedMatches[groupedMatches.length - 1] : null;

			// If this match overlaps with the previous group's excerpt window
			if (lastGroup && excerptStart <= lastGroup.end) {
				// Extend the last group
				lastGroup.end = Math.max(lastGroup.end, excerptEnd);
				lastGroup.matchCoords.push(m);
			} else {
				// Create a new group
				groupedMatches.push({ start: excerptStart, end: excerptEnd, matchCoords: [m] });
			}
		}

		const maxMatches = 5;
		for (const group of groupedMatches.slice(0, maxMatches)) {
			const prefix = group.start > 0 ? '...' : '';
			const suffix = group.end < searchable.length ? '...' : '';

			let snippet = `${prefix}${searchable.slice(group.start, group.end)}${suffix}`;

			// Highlight matches
			snippet = escapeHtml(snippet).replace(
				new RegExp(escapeRegExp(phrase), 'gi'),
				(m) => `<mark>${m}</mark>`
			);

			const encodeFragment = encodeURIComponent(phrase);
			matches.push({
				excerpt: snippet,
				// Deep link to the first match in this group
				fragmentUrl: `${url}#:~:text=${encodeFragment}`
			});
		}

		return { url, title, matches };
	}

	let defaultExcerpt = '';
	if (data.excerpt) defaultExcerpt = sanitizePagefindExcerpt(data.excerpt);
	else if (data.plain_excerpt) defaultExcerpt = escapeHtml(data.plain_excerpt);

	if (defaultExcerpt) {
		return {
			url,
			title,
			matches: [{ excerpt: defaultExcerpt, fragmentUrl: url }]
		};
	}

	return null;
}
