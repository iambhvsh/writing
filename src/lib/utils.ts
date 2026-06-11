import { format, parseISO } from 'date-fns';

export function formatDate(dateStr: string, fmt = 'MMMM d, yyyy'): string {
	return format(parseISO(dateStr), fmt);
}
