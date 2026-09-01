#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] ?? '.');
const generatedPath = path.join(root, 'src/v4/generated/example-site.json');
const required = [
  'astro.config.mjs',
  'package.json',
  'tsconfig.json',
  'src/pages/index.astro',
  'src/pages/search.astro',
  'src/pages/category.astro',
  'src/pages/[...page].astro',
  generatedPath,
];
const forbidden = [
  'src/g017',
  'src/layouts',
  'src/content',
  'src/lib',
  'src/config',
  'tests',
  'scripts/lib',
  'scripts/validate-generated-site.ts',
];

for (const entry of required) {
  if (!existsSync(path.isAbsolute(entry) ? entry : path.join(root, entry))) {
    throw new Error(`V4 standalone validation failed: missing ${entry}`);
  }
}
for (const entry of forbidden) {
  if (existsSync(path.join(root, entry))) {
    throw new Error(`V4 standalone validation failed: non-runtime source present: ${entry}`);
  }
}

const generated = JSON.parse(readFileSync(generatedPath, 'utf8')) as {
  game?: { name?: string };
  pages?: Array<{ id?: string; href?: string }>;
};
if (!generated.game?.name?.trim() || !generated.pages?.length) {
  throw new Error('V4 standalone validation failed: generated site has no game identity or pages.');
}
const ids = new Set<string>();
for (const page of generated.pages) {
  if (!page.id || !page.href?.startsWith('/')) throw new Error('V4 standalone validation failed: invalid generated page.');
  if (ids.has(page.id)) throw new Error(`V4 standalone validation failed: duplicate page id ${page.id}.`);
  ids.add(page.id);
}
console.log(`validate:generated V4 standalone PASS (${generated.pages.length} pages)`);
