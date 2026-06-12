import { dev } from '$app/environment';
import { injectAnalytics } from '@vercel/analytics/sveltekit';
import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

injectAnalytics({ mode: dev ? 'development' : 'production' });
injectSpeedInsights();

export const prerender = true;
export const trailingSlash = 'always';
