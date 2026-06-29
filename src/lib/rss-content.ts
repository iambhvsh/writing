/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { sharedRemarkPlugins, sharedRehypePlugins } from './markdown.ts';

export async function compileMarkdownToHtml(markdown: string): Promise<string> {
	const processor = unified().use(remarkParse);

	for (const plugin of sharedRemarkPlugins) {
		if (Array.isArray(plugin)) {
			processor.use(plugin[0], plugin[1]);
		} else {
			processor.use(plugin);
		}
	}

	processor.use(remarkRehype);

	for (const plugin of sharedRehypePlugins) {
		if (Array.isArray(plugin)) {
			processor.use(plugin[0], plugin[1]);
		} else {
			processor.use(plugin);
		}
	}

	processor.use(rehypeStringify);

	const file = await processor.process(markdown);
	return String(file);
}
