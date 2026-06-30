import { unified, type Processor } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { sharedRemarkPlugins, sharedRehypePlugins } from './markdown.ts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyPlugins(processor: Processor<any, any, any, any, any>, plugins: typeof sharedRemarkPlugins) {
	for (const plugin of plugins) {
		if (Array.isArray(plugin)) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			processor.use(plugin[0], ...(plugin.slice(1)));
		} else {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			processor.use(plugin);
		}
	}
}

export async function compileMarkdownToHtml(markdown: string): Promise<string> {
	const processor = unified().use(remarkParse);
	applyPlugins(processor, sharedRemarkPlugins);
	processor.use(remarkRehype);
	applyPlugins(processor, sharedRehypePlugins);
	processor.use(rehypeStringify);

	const file = await processor.process(markdown);
	return String(file);
}
