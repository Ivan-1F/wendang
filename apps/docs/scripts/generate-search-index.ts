/**
 * Generate search index for Orama at build time.
 * Uses fuma-content to get compiled pages with TOC.
 * Run with: bun --preload ./scripts/preload.ts scripts/generate-search-index.ts
 */

import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { create, insertMultiple, save } from '@orama/orama';
import { content } from './preload';

const OUTPUT_FILE = path.join(process.cwd(), 'public/search-index.json');

interface SearchDocument {
  id: string;
  title: string;
  pageTitle: string;
  content: string;
  path: string;
  locale: string;
}

interface TOCItem {
  title: string;
  url: string;
  depth: number;
}

// Extract locale from path (e.g., "cn/guides/index.mdx" -> "cn")
function extractLocale(filePath: string): string {
  const parts = filePath.split('/');
  const locales = ['cn', 'en', 'jp'];
  return locales.find((l) => parts[0] === l) || 'en';
}

// Convert file path to URL slug
function pathToSlug(filePath: string): string {
  return filePath
    .replace(/\.mdx$/, '')
    .split('/')
    .filter((segment) => !segment.startsWith('(') && segment !== 'index')
    .join('/');
}

async function main() {
  console.log('Generating search index...');

  // Emit/compile collection files first
  await content.emit();

  // Now import the compiled docs
  const { docs } = await import('content/docs');
  const pages = docs.list();
  console.log(`Found ${pages.length} pages`);

  // Create Orama database
  const db = create({
    schema: {
      id: 'string',
      title: 'string',
      pageTitle: 'string',
      content: 'string',
      path: 'string',
      locale: 'string',
    },
  });

  const documents: SearchDocument[] = [];

  for (const page of pages) {
    const compiled = page.compiled as {
      frontmatter: { title: string; description?: string };
      toc?: TOCItem[];
    };

    const { frontmatter, toc = [] } = compiled;
    const slug = pathToSlug(page.path);
    const locale = extractLocale(page.path);
    const basePath = slug ? `/docs/${slug}` : '/docs';
    const pageTitle = frontmatter.title || slug.split('/').pop() || 'Untitled';

    // Add the page itself (intro)
    documents.push({
      id: `${page.path}#intro`,
      title: pageTitle,
      pageTitle,
      content: frontmatter.description || '',
      path: basePath,
      locale,
    });

    // Add each TOC item as a separate document
    for (const item of toc) {
      // url is like "#quick-start"
      const anchor = item.url.startsWith('#') ? item.url.slice(1) : item.url;

      documents.push({
        id: `${page.path}#${anchor}`,
        title: item.title,
        pageTitle,
        content: '',
        path: `${basePath}#${anchor}`,
        locale,
      });
    }
  }

  // Insert documents into database
  await insertMultiple(db, documents);
  console.log(`Indexed ${documents.length} sections`);

  // Save index to file
  const serialized = await save(db);
  await mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await writeFile(OUTPUT_FILE, JSON.stringify(serialized));

  console.log(`Search index saved to ${OUTPUT_FILE}`);
}

main().catch(console.error);
