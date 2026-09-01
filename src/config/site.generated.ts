/**
 * This file is generated from site-spec.yaml.
 * Do not edit directly.
 * Run npm run site:generate instead.
 *
 * Template baseline: Example Game demo config is checked in so template mode
 * builds without a site-spec.yaml. Generated sites overwrite this file.
 */
import type { GameConfig } from './game-types';
import { pageHref } from '../lib/paths';

const siteMode = 'standalone' as const;
const hubPath = '/';
const href = (slug: string) => pageHref(hubPath, slug);

export const siteConfig: GameConfig = {
	presentationVersion: 3,
	name: 'Example Game',
	shortName: 'Example Game',
	title: 'Example Game Guide & Wiki',
	description:
		'A fictional demo wiki used to validate a shared Astro + Starlight starter for single-game guide sites.',
	tagline: 'Guides, locations, and characters for a fictional demo game.',
	siteUrl: 'https://example-game.example',
	siteMode,
	hubPath,
	hubTitle: 'Example Game Guide & Wiki',
	locale: 'en',
	releaseStatus: 'released',
	releaseDate: '2026-03-12',
	developer: 'Northlamp Studio',
	publisher: 'Paper Harbor Games',
	platforms: ['PC', 'PlayStation 5', 'Xbox Series X|S'],
	accentColor: '#0f9b8e',
	accentForeground: '#041012',
	heroImage: 'placeholder.svg',
	heroAlt: 'Example Game demo artwork placeholder',
	heroPosition: 'center',
	portal: {
		primaryNav: [
			{ label: 'Guides', href: '/guides/' },
			{ label: 'Bosses', href: '/bosses/' },
			{ label: 'Puzzles', href: '/puzzles/' },
			{ label: 'Fixes', href: '/fixes/' },
		],
		primaryCta: { label: 'Start Here', href: href('overview') },
		secondaryCta: { label: 'Browse Guides', href: '#browse-guides' },
		popularQuestions: [
			{ label: 'How do I get started?', context: 'System Reqs → Beginner Route → Core Loop', href: href('overview') },
			{ label: 'Where should I explore first?', href: href('example-location') },
			{ label: 'How does the main gameplay system work?', context: 'Scout → Loadout → Encounter', href: href('example-guide') },
			{ label: 'Who are the main characters?', href: href('example-character') },
			{ label: 'When does the game release?', href: href('release-info') },
		],
		startHere: [
			{
				title: 'Beginner Overview',
				description: 'What this wiki covers and where to go first.',
				href: href('overview'),
				label: 'Getting started',
				badge: 'Start here',
			},
			{
				title: 'Core Gameplay',
				description: 'Sample systems page for combat and practical tips.',
				href: href('example-guide'),
				label: 'Systems',
				image: 'placeholder.svg',
			},
			{
				title: 'Key Location',
				description: 'A demo district used for world routing checks.',
				href: href('example-location'),
				label: 'World',
				image: 'placeholder.svg',
			},
			{
				title: 'How to Make Money',
				description: 'Fictional economy tips for the demo world.',
				href: href('how-to-make-money'),
				label: 'Progression',
				badge: 'Popular',
			},
		],
		evidence: {
			title: 'See the Game in Action',
			description: 'Optional media strip for official or verified gameplay stills. Demo uses placeholders only.',
			items: [
				{
					image: 'placeholder.svg',
					alt: 'Example Game placeholder still — wide shot',
					caption: 'Official / press still (placeholder)',
				},
				{
					image: 'placeholder.svg',
					alt: 'Example Game placeholder still — detail A',
					caption: 'Gameplay detail (placeholder)',
					href: href('example-guide'),
				},
				{
					image: 'placeholder.svg',
					alt: 'Example Game placeholder still — detail B',
					caption: 'World beat (placeholder)',
					href: href('example-location'),
				},
			],
		},
		showRecentlyUpdated: true,
		maxRecent: 3,
	},
	/**
	 * Template-baseline demo routes. A generated site carries the same shape,
	 * produced from `site-spec.yaml` → `routes[]`. UI consumes only this runtime
	 * config; `routes[].pages` is the single membership source.
	 */
	routes: [
		{
			id: 'getting-started',
			eyebrow: 'New Player Route',
			title: 'Getting Started',
			description: 'Everything you need before your first serious run.',
			href: '/routes/getting-started/',
			visual: 'placeholder.svg',
			pages: [
				{
					pageId: 'overview',
					href: href('overview'),
					title: 'Beginner Overview',
					description: 'What this wiki covers and where to go first.',
					eyebrow: 'Getting Started',
					image: 'placeholder.svg',
				},
				{
					pageId: 'example-guide',
					href: href('example-guide'),
					title: 'Example Guide',
					description: 'A sample gameplay article covering combat and practical tips.',
					eyebrow: 'Combat Primer',
				},
				{
					pageId: 'example-location',
					href: href('example-location'),
					title: 'Key Location',
					description: 'A demo district used for world routing checks.',
					eyebrow: 'World',
				},
				{
					pageId: 'how-to-make-money',
					href: href('how-to-make-money'),
					title: 'How to Make Money',
					description: 'Fictional economy tips for the demo world.',
					eyebrow: 'Progression',
				},
			],
			fastAnswers: [
				{
					question: 'How do I get started?',
					answer: 'Read the Beginner Overview first — it covers what this wiki contains.',
					pageId: 'overview',
					href: href('overview'),
				},
				{
					question: 'What should I learn before exploring?',
					answer: 'The core gameplay loop in the Example Guide.',
					pageId: 'example-guide',
					href: href('example-guide'),
				},
				{
					question: 'Where should I go first?',
					answer: 'Start with the Key Location for world routing.',
					pageId: 'example-location',
					href: href('example-location'),
				},
			],
		},
		{
			id: 'core-gameplay',
			eyebrow: 'Systems & Combat',
			title: 'Core Gameplay',
			description: 'Understand the systems that power every run.',
			href: '/routes/core-gameplay/',
			pages: [
				{
					pageId: 'example-guide',
					href: href('example-guide'),
					title: 'Example Guide',
					description: 'A sample gameplay article covering combat and practical tips.',
					eyebrow: 'Combat Primer',
					image: 'placeholder.svg',
				},
				{
					pageId: 'second-example-guide',
					href: href('second-example-guide'),
					title: 'Second Example Guide',
					description: 'A deeper dive into the demo game\'s advanced systems.',
					eyebrow: 'Advanced Systems',
				},
				{
					pageId: 'how-to-make-money',
					href: href('how-to-make-money'),
					title: 'How to Make Money',
					description: 'Fictional economy tips for the demo world.',
					eyebrow: 'Progression',
				},
			],
		},
		{
			id: 'world-exploration',
			eyebrow: 'Places',
			title: 'World & Exploration',
			description: 'Find the districts and landmarks worth knowing.',
			href: '/routes/world-exploration/',
			visual: 'placeholder.svg',
			pages: [
				{
					pageId: 'example-location',
					href: href('example-location'),
					title: 'Key Location',
					description: 'A demo district used for world routing checks.',
					eyebrow: 'World',
				},
				{
					pageId: 'how-to-make-money',
					href: href('how-to-make-money'),
					title: 'How to Make Money',
					description: 'Fictional economy tips for the demo world.',
					eyebrow: 'Progression',
				},
			],
		},
		{
			id: 'story-characters',
			eyebrow: 'People & Plot',
			title: 'Story & Characters',
			description: 'Follow the people and threads of the demo world.',
			href: '/routes/story-characters/',
			pages: [
				{
					pageId: 'example-character',
					href: href('example-character'),
					title: 'Example Character',
					description: 'A fictional character used to validate the story section.',
					eyebrow: 'Characters',
				},
			],
		},
	],
	categories: [
		{
			id: 'getting-started',
			label: 'Getting Started',
			description: 'Start here if you are new to the game.',
			icon: 'rocket',
			order: 1,
		},
		{
			id: 'gameplay',
			label: 'Gameplay',
			description: 'Mechanics, systems, and practical guides.',
			icon: 'puzzle',
			order: 2,
			image: 'placeholder.svg',
		},
		{
			id: 'world',
			label: 'World',
			description: 'Places, districts, and landmarks.',
			icon: 'star',
			order: 3,
			image: 'placeholder.svg',
		},
		{
			id: 'story',
			label: 'Story & Characters',
			description: 'People and plot threads.',
			icon: 'open-book',
			order: 4,
		},
		{
			id: 'game-info',
			label: 'Game Info',
			description: 'Release details, platforms, and credits.',
			icon: 'information',
			order: 5,
		},
		{
			id: 'school-life',
			label: 'School Life',
			description: 'Fictional school systems used to test URL decoupling.',
			icon: 'laptop',
			order: 6,
		},
		{
			id: 'bosses',
			label: 'Bosses',
			description: 'Boss encounters, phases, and reliable answers.',
			icon: 'bolt',
			order: 7,
			image: 'v3/gameplay.svg',
		},
		{
			id: 'puzzles',
			label: 'Puzzles',
			description: 'Puzzle solutions and step-by-step routes.',
			icon: 'puzzle',
			order: 8,
			image: 'v3/gameplay.svg',
		},
		{
			id: 'weapons',
			label: 'Weapons',
			description: 'Weapon locations and early-game recommendations.',
			icon: 'star',
			order: 9,
			image: 'v3/gameplay.svg',
		},
		{
			id: 'locations',
			label: 'Locations',
			description: 'Important locations and collectibles.',
			icon: 'map',
			order: 10,
			image: 'v3/gameplay.svg',
		},
		{
			id: 'fixes',
			label: 'Fixes',
			description: 'Platform-specific fixes and troubleshooting.',
			icon: 'information',
			order: 11,
			image: 'v3/gameplay.svg',
		},
	],
};
