import { format, formatDistanceToNow, parseISO } from 'date-fns';

export function formatDate(dateStr: string, fmt = 'MMMM d, yyyy'): string {
	return format(parseISO(dateStr), fmt);
}

export function formatDateRelative(dateStr: string): string {
	return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
}

export function formatDateShort(dateStr: string): string {
	return format(parseISO(dateStr), 'MMM d, yyyy');
}

export function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export function truncate(text: string, length = 160): string {
	if (text.length <= length) return text;
	return text.slice(0, length).replace(/\s+\S*$/, '') + '…';
}

export function classNames(...classes: (string | undefined | null | false)[]): string {
	return classes.filter(Boolean).join(' ');
}
