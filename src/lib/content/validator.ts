import { getAssetUrl, listAssetPathsForPost, assetName } from './assets.js';
import { buildPost, normalizePublishedAt, parseTags, type ParsedFrontmatter } from './schema.js';
import type { AssetReference, Post, RawPostFile } from './types.js';
import { basename, calcReadingTime, COVER_FILENAMES, formatValidationReport, isExternalOrRootUrl, normalizeRelativePath, postDirectory } from './utils.js';

const ALLOWED_BODY_VIDEOS = new Set(['.mp4', '.webm']);
const DISALLOWED_BODY_IMAGES = new Set(['.png', '.jpg', '.jpeg', '.avif']);
const REQUIRED_FIELDS = ['title', 'description', 'publishedAt', 'tags'] as const;

function ext(path: string): string {
	const match = /\.[^./]+$/.exec(path);
	return match?.[0].toLowerCase() ?? '';
}

function frontmatterBlock(content: string): string {
	const match = /(?:^|\n)---\n([\s\S]*?)\n---/.exec(content);
	return match?.[1] ?? '';
}

function readTagsLine(content: string): string | undefined {
	return new RegExp('^tags:\\s*([^\\[\\]\\n][^\\n]*)$', 'm').exec(frontmatterBlock(content))?.[1]?.trim();
}


function readFrontmatterValue(content: string, field: string): string | undefined {
	const escaped = field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const value = new RegExp(`^${escaped}:\\s*(.+)$`, 'm').exec(frontmatterBlock(content))?.[1]?.trim();
	if (!value) return undefined;
	if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
		return value.slice(1, -1).trim();
	}
	return value;
}

function parseFrontmatter(file: RawPostFile, errors: string[]): ParsedFrontmatter | undefined {
	for (const field of REQUIRED_FIELDS) {
		if (readFrontmatterValue(file.content, field) === undefined) {
			errors.push(`Missing required frontmatter field.\nFound: ${file.path} has no ${field}.\nAdd ${field} to the post frontmatter.`);
		}
	}
	const title = readFrontmatterValue(file.content, 'title');
	const description = readFrontmatterValue(file.content, 'description');
	const tagsValue = readTagsLine(file.content);
	if (!tagsValue) {
		errors.push(`Invalid tags format.\nFound: tags in ${file.path} are not a single-line comma-separated string.\nUse: tags: Swift, SwiftUI, Apple Development`);
	}
	const publishedValue = readFrontmatterValue(file.content, 'publishedAt');
	const publishedAt = publishedValue ? normalizePublishedAt(publishedValue) : undefined;
	if (!publishedAt) {
		errors.push(`Invalid publishedAt value.\nFound: ${publishedValue ?? 'missing or unsupported'} in ${file.path}.\nUse YYYY-MM-DD, for example: publishedAt: 2026-06-19`);
	}
	const legacyCover = readFrontmatterValue(file.content, 'cover');
	if (legacyCover !== undefined) {
		errors.push(`Invalid cover field.\nFound: cover in ${file.path}.\nUse coverImage with coverAlt, for example: coverImage: "./cover.jpg".`);
	}
	const coverImage = readFrontmatterValue(file.content, 'coverImage');
	const coverAlt = readFrontmatterValue(file.content, 'coverAlt');
	if ((coverImage && !coverAlt) || (!coverImage && coverAlt)) {
		errors.push(`Invalid cover configuration.\nFound: ${file.path} has only one of coverImage and coverAlt.\nUse both fields together or remove both fields.`);
	}
	if (coverImage) {
		const normalized = normalizeRelativePath(coverImage);
		const name = normalized ? basename(normalized) : coverImage;
		if (!normalized || !COVER_FILENAMES.includes(name as (typeof COVER_FILENAMES)[number])) {
			errors.push(`Invalid cover image.\nFound: ${coverImage} in ${file.path}.\nAllowed: ./cover.png ./cover.jpg ./cover.jpeg`);
		} else if (!getAssetUrl(file.path, coverImage)) {
			errors.push(`Missing cover image.\nFound: ${coverImage} in ${file.path}.\nAdd ${postDirectory(file.path)}/${normalized} or update frontmatter.`);
		}
	}
	if (!title || !description || !publishedAt || !tagsValue) return undefined;
	if (coverImage && coverAlt) return { title, description, publishedAt, tags: parseTags(tagsValue), coverImage, coverAlt };
	return { title, description, publishedAt, tags: parseTags(tagsValue) };
}

function collectReferences(file: RawPostFile, frontmatter: ParsedFrontmatter | undefined, errors: string[]): AssetReference[] {
	const refs: AssetReference[] = [];
	if (frontmatter?.coverImage) refs.push({ path: frontmatter.coverImage, kind: 'cover' });
	const body = file.content.replace(/^---[\s\S]*?---/, '');
	const patterns: { regex: RegExp; kind: AssetReference['kind'] }[] = [
		{ regex: /!?\[[^\]]*\]\((\.\.?\/[^)\s]+)[^)]*\)/g, kind: 'link' },
		{ regex: /\b(?:src|href)=['"](\.\.?\/[^'"]+)['"]/g, kind: 'link' },
		{ regex: /\bposter=['"](\.\.?\/[^'"]+)['"]/g, kind: 'poster' },
	];
	for (const { regex, kind } of patterns) {
		for (const match of body.matchAll(regex)) {
			const value = match[1];
			if (!value || isExternalOrRootUrl(value)) continue;
			const normalized = normalizeRelativePath(value);
			if (!normalized) {
				errors.push(`Invalid cross-post asset reference.\nFound: ${value} in ${file.path}.\nReference only files in the same post folder with ./filename.ext.`);
				continue;
			}
			const extension = ext(normalized);
			const inferredKind = /\bposter=/.test(match[0]) ? 'poster' : /\bsrc=/.test(match[0]) && ALLOWED_BODY_VIDEOS.has(extension) ? 'video' : kind;
			if (DISALLOWED_BODY_IMAGES.has(extension)) {
				errors.push(`Invalid body image.\nFound: ${value} in ${file.path}.\nUse .webp or .gif for body images. Cover images must be configured with coverImage.`);
			}
			if (/\bsrc=/.test(match[0]) && /\.(mp4|webm)$/i.exec(normalized) && !ALLOWED_BODY_VIDEOS.has(extension)) {
				errors.push(`Invalid body video.\nFound: ${value} in ${file.path}.\nUse .mp4 or .webm for body videos.`);
			}
			if (!getAssetUrl(file.path, value)) {
				errors.push(`Missing referenced asset.\nFound: ${value} in ${file.path}.\nAdd ${postDirectory(file.path)}/${normalized} or update the reference.`);
			}
			refs.push({ path: value, kind: inferredKind });
		}
	}
	return refs;
}

export function validatePosts(files: readonly RawPostFile[]): readonly Post[] {
	const errors: string[] = [];
	const slugCounts = new Map<string, string[]>();
	for (const file of files) slugCounts.set(file.slug.toLowerCase(), [...(slugCounts.get(file.slug.toLowerCase()) ?? []), file.slug]);
	for (const slugs of slugCounts.values()) if (slugs.length > 1) errors.push(`Duplicate post slug.\nFound: ${slugs.join(', ')}.\nRename folders so slugs are unique case-insensitively.`);
	const posts: Post[] = [];
	for (const file of files) {
		const assetPaths = listAssetPathsForPost(file.path);
		const covers = assetPaths.map(assetName).filter((name) => COVER_FILENAMES.includes(name as (typeof COVER_FILENAMES)[number]));
		if (covers.length > 1) errors.push(`Multiple cover files.\nFound: ${covers.join(', ')} in ${postDirectory(file.path)}.\nKeep only one of cover.png cover.jpg cover.jpeg.`);
		const frontmatter = parseFrontmatter(file, errors);
		const references = collectReferences(file, frontmatter, errors);
		const referenced = new Set(references.map((ref) => `${postDirectory(file.path)}/${normalizeRelativePath(ref.path) ?? ''}`));
		for (const asset of assetPaths) {
			const name = assetName(asset);
			if (name === 'index.svx' || COVER_FILENAMES.includes(name as (typeof COVER_FILENAMES)[number])) continue;
			if (!referenced.has(asset)) errors.push(`Unused asset.\nFound: ${asset}.\nReference it from index.svx or remove the file.`);
		}
		if (frontmatter) {
			const cover = frontmatter.coverImage ? getAssetUrl(file.path, frontmatter.coverImage) : undefined;
			posts.push(cover ? buildPost({ ...frontmatter, slug: file.slug, readingTime: calcReadingTime(file.content), cover }) : buildPost({ ...frontmatter, slug: file.slug, readingTime: calcReadingTime(file.content) }));
		}
	}
	if (errors.length) throw new Error(formatValidationReport(errors));
	return posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}
