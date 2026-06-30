import { unified, type Processor } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

import { sharedRemarkPlugins, sharedRehypePlugins } from './markdown.ts';

function applyPlugins(processor: Processor, plugins: typeof sharedRemarkPlugins) {
	for (const plugin of plugins) {
		if (Array.isArray(plugin)) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			processor.use(plugin[0], ...plugin.slice(1));
		} else {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			processor.use(plugin);
		}
	}
}

export async function compileMarkdownToHtml(markdown: string): Promise<string> {
	const processor = unified().use(remarkParse);
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
	applyPlugins(processor as any, sharedRemarkPlugins);
	processor.use(remarkRehype);
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
	applyPlugins(processor as any, sharedRehypePlugins);
	processor.use(rehypeStringify);

	const file = await processor.process(markdown);
	return String(file);
}
