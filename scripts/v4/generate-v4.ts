import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createPageData, type PageDataInput } from '../../src/v4/page-data-contract';
import { composePage } from '../../src/v4/page-composer';
import { resolveIntent } from '../../src/v4/intent-resolver';
import { bindTaskMedia } from '../../src/v4/media-binding';
import type { PageFact, PageEvidence, PageFreshness, LegacyPrimitivePayload, PrimitiveInstance, PageAssetCandidate } from '../../src/v4/page-data-contract';
import type { PlayerTask, ResolverEvidence } from '../../src/v4/intent-contract';
import { createV4Theme, type V4Theme } from '../../src/v4/visual-system';
import type { V4Navigation } from '../../src/v4/navigation';

export interface V4InputPage {
	id: string;
	title: string;
	href: string;
	query: string;
	playerProblem: string;
	primaryTask?: PlayerTask;
	resolverEvidence?: ResolverEvidence;
	primitiveSupport?: Readonly<Record<string, 'available'|'unresolved'|'unsupported'>>;
	priority?: number;
	facts?: readonly PageFact[];
	evidence?: readonly PageEvidence[];
	freshness?: PageFreshness;
	assets?: readonly PageAssetCandidate[];
	primitiveData?: readonly (PrimitiveInstance|LegacyPrimitivePayload)[];
}

export interface V4SiteInput {
	game: { name: string; slug: string; accent?: string; accentForeground?: string };
	navigation?: V4Navigation;
	pages: readonly V4InputPage[];
}

export interface V4GeneratedPage {
	id: string;
	title: string;
	href: string;
	pageData: ReturnType<typeof createPageData>;
	composition: ReturnType<typeof composePage>;
}

export interface V4GeneratedSite {
	game: V4SiteInput['game'];
	theme: V4Theme;
	navigation: V4Navigation;
	homepage: { pageIds: readonly string[]; assets: readonly PageAssetCandidate[] };
	pages: readonly V4GeneratedPage[];
}

const canonicalHref = (href: string): string => {
	if (href === '/v4-preview/' || href === '/v4-preview') return '/';
	if (href.startsWith('/v4-preview/')) return href.slice('/v4-preview'.length) || '/';
	return href;
};

function canonicalizeValue<T>(value: T): T {
	if (typeof value === 'string') return canonicalHref(value) as T;
	if (Array.isArray(value)) return value.map((item) => canonicalizeValue(item)) as T;
	if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, canonicalizeValue(item)])) as T;
	return value;
}

function toCanonicalSite(site: V4GeneratedSite): V4GeneratedSite {
	return {
		...site,
		navigation: {
			...site.navigation,
			primary: site.navigation.primary.map((category) => ({
				...category,
				href: canonicalHref(category.href),
				groups: category.groups?.map((group) => ({ ...group, items: group.items.map((item) => ({ ...item, href: canonicalHref(item.href) })) })),
			})),
			utilities: site.navigation.utilities?.map((item) => ({ ...item, href: canonicalHref(item.href) })),
		},
		pages: site.pages.map((page) => canonicalizeValue({ ...page, href: canonicalHref(page.href) })),
	};
}

export function generateV4(input: V4SiteInput): V4GeneratedSite {
	const homepageAssets: PageAssetCandidate[] = [];
	const pages = input.pages.map((page) => {
		const intent = resolveIntent({
			query: page.query,
			playerProblem: page.playerProblem,
			primaryTask: page.primaryTask,
			evidence: page.resolverEvidence,
			priority: page.priority,
		});
		const pageAssets = (page.assets ?? []).filter((asset) => {
			// Hero media is homepage media by default. A content page may retain
			// it only when its input explicitly references media from its own
			// primitive data; an empty mediaRefs list is not an opt-in.
			if (asset.role !== 'hero') return true;
			const explicitlyBound = (page.primitiveData ?? []).some((raw) => (raw.mediaRefs ?? []).length > 0);
			if (explicitlyBound) return true;
			homepageAssets.push(asset);
			return false;
		});
		const media = bindTaskMedia(intent.primaryTask, pageAssets);
		const pageDataInput: PageDataInput = {
			intent,
			page: { id: page.id, title: page.title, href: page.href },
			facts: page.facts,
			evidence: page.evidence,
			freshness: page.freshness,
			assets: media.assets,
			primitiveData: page.primitiveData,
				primitiveSupport: { ...media.primitiveSupport, ...page.primitiveSupport },
		};
		const pageData = createPageData(pageDataInput);
		return { id: page.id, title: page.title, href: page.href, pageData, composition: composePage(pageData) };
	});
	return {
		game: input.game,
		theme: createV4Theme(input.game.accent, input.game.accentForeground),
		navigation: input.navigation ?? { primary: [] },
		homepage: { pageIds: [...pages].sort((a, b) => b.pageData.intent.priority - a.pageData.intent.priority || a.id.localeCompare(b.id)).map((page) => page.id), assets: homepageAssets },
		pages,
	};
}

export function generateV4File(inputPath: string, outputPath: string): V4GeneratedSite {
	const input = JSON.parse(readFileSync(inputPath, 'utf8')) as V4SiteInput;
	const output = generateV4(input);
	mkdirSync(path.dirname(outputPath), { recursive: true });
	writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
	return output;
}

export function generateV4Standalone(inputPath: string, destination: string): V4GeneratedSite {
	if (existsSync(destination) && readdirSync(destination).length > 0) {
		throw new Error(`Standalone destination must be empty: ${destination}`);
	}
	const root = path.resolve(new URL('.', import.meta.url).pathname, '../..');
	const generated = toCanonicalSite(generateV4(JSON.parse(readFileSync(inputPath, 'utf8')) as V4SiteInput));
	mkdirSync(path.join(destination, 'src'), { recursive: true });
	for (const directory of ['components/v4', 'v4']) cpSync(path.join(root, 'src', directory), path.join(destination, 'src', directory), { recursive: true });
	cpSync(path.join(root, 'public/v4'), path.join(destination, 'public/v4'), { recursive: true });
	cpSync(path.join(root, 'scripts/v4/standalone/astro.config.mjs'), path.join(destination, 'astro.config.mjs'));
	cpSync(path.join(root, 'scripts/v4/standalone/package.json'), path.join(destination, 'package.json'));
	if (existsSync(path.join(root, 'scripts/v4/standalone/package-lock.json'))) cpSync(path.join(root, 'scripts/v4/standalone/package-lock.json'), path.join(destination, 'package-lock.json'));
	cpSync(path.join(root, 'scripts/v4/standalone/tsconfig.json'), path.join(destination, 'tsconfig.json'));
	cpSync(path.join(root, 'scripts/v4/standalone/validate-generated-site.ts'), path.join(destination, 'scripts/v4/standalone/validate-generated-site.ts'));
	for (const file of readdirSync(path.join(root, 'scripts/v4/standalone/pages'))) cpSync(path.join(root, 'scripts/v4/standalone/pages', file), path.join(destination, 'src/pages', file), { recursive: true });
	writeFileSync(path.join(destination, 'src/v4/generated/example-site.json'), `${JSON.stringify(generated, null, 2)}\n`, 'utf8');
	return generated;
}

if (process.argv[1]?.endsWith('generate-v4.ts')) {
	const [, , inputPath, outputPath] = process.argv;
	if (!inputPath || !outputPath) throw new Error('Usage: tsx scripts/v4/generate-v4.ts <input.json> <output.json>');
	generateV4File(inputPath, outputPath);
}
