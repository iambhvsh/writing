export function portal(node: HTMLElement, target: HTMLElement | string = 'body') {
	const targetNode = (typeof target === 'string' ? document.querySelector(target) : target) ?? document.body;
	targetNode.appendChild(node);
	return {
		destroy() {
			if (node.parentNode) {
				node.parentNode.removeChild(node);
			}
		}
	};
}
