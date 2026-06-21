const WORDS_PER_MINUTE = 200;
export const WRITINGS_ROOT = '/writings/';
export const COVER_FILENAMES = ['cover.png', 'cover.jpg', 'cover.jpeg'] as const;
export const POST_FILENAME = 'index.svx';

export function slugFromPath(path: string): string {
	return path.replace(WRITINGS_ROOT, '').replace(/\/index\.svx$/, '');
}

export function postDirectory(path: string): string {
	return path.replace(/\/index\.svx$/, '');
}

export function basename(path: string): string {
	return path.split('/').at(-1) ?? path;
}

export function calcReadingTime(content: string): number {
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

export function normalizeRelativePath(value: string): string | undefined {
	if (!value.startsWith('./')) return undefined;
	const withoutPrefix = value.slice(2);
	if (!withoutPrefix || withoutPrefix.includes('//')) return undefined;
	const parts = withoutPrefix.split('/');
	if (parts.some((part) => part === '..' || part === '.' || part === '')) return undefined;
	return withoutPrefix;
}

export function isExternalOrRootUrl(value: string): boolean {
	return /^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(value) || value.startsWith('/') || value.startsWith('#');
}

export function formatValidationReport(errors: readonly string[]): string {
	return `\nContent validation failed with ${String(errors.length)} error${errors.length === 1 ? '' : 's'}.\n\n${errors
		.map((error, index) => `${String(index + 1)}. ${error}`)
		.join('\n\n')}`;
}
