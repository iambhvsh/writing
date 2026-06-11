export function xmlText(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

export function xmlCdata(value: string): string {
	return `<![CDATA[${value.replaceAll(']]>', ']]]]><![CDATA[>')}]]>`;
}
