/**
 * Generate search index for Orama at build time.
 * Uses fuma-content to get compiled pages with TOC.
 * Reads MDX source to extract section content.
 * Run with: bun --preload ./scripts/preload.ts scripts/generate-search-index.ts
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { create, insertMultiple, save } from '@orama/orama';
import { content } from './preload';

const CONTENT_DIR = path.join(process.cwd(), 'content/docs');
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

interface Section {
  anchor: string;
  title: string;
  content: string;
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

// Generate anchor slug from heading text (GitHub-style)
function headingToSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Clean text for indexing (remove MDX syntax)
function cleanText(text: string): string {
  return text
    // Remove import statements
    .replace(/^import\s+.*$/gm, '')
    // Remove JSX components
    .replace(/<[A-Z][a-zA-Z]*[^>]*\/>/g, '')
    .replace(/<[A-Z][a-zA-Z]*[^>]*>[\s\S]*?<\/[A-Z][a-zA-Z]*>/g, '')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`[^`]+`/g, '')
    // Remove markdown links but keep text
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    // Remove image syntax
    .replace(/!\[.*?]\(.*?\)/g, '')
    // Remove emphasis markers
    .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1')
    // Remove heading markers
    .replace(/^#{1,6}\s+/gm, '')
    // Collapse whitespace
    .replace(/\n{2,}/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Parse MDX content into sections
function parseSections(mdxContent: string): { intro: string; sections: Section[] } {
  // Remove frontmatter
  const body = mdxContent.replace(/^---\n[\s\S]*?\n---\n?/, '');

  const sections: Section[] = [];
  const lines = body.split('\n');

  const introLines: string[] = [];
  let currentSection: { title: string; anchor: string; lines: string[] } | null = null;

  for (const line of lines) {
    // Match ## or ### headings
    const headingMatch = line.match(/^(#{2,3})\s+(.+)$/);

    if (headingMatch) {
      // Save previous section
      if (currentSection) {
        sections.push({
          anchor: currentSection.anchor,
          title: currentSection.title,
          content: cleanText(currentSection.lines.join('\n')),
        });
      }

      // Start new section
      const title = headingMatch[2].trim();
      currentSection = {
        title,
        anchor: headingToSlug(title),
        lines: [],
      };
    } else if (currentSection) {
      currentSection.lines.push(line);
    } else {
      introLines.push(line);
    }
  }

  // Save last section
  if (currentSection) {
    sections.push({
      anchor: currentSection.anchor,
      title: currentSection.title,
      content: cleanText(currentSection.lines.join('\n')),
    });
  }

  return {
    intro: cleanText(introLines.join('\n')),
    sections,
  };
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

    const { frontmatter } = compiled;
    const slug = pathToSlug(page.path);
    const locale = extractLocale(page.path);
    const basePath = slug ? `/docs/${slug}` : '/docs';
    const pageTitle = frontmatter.title || slug.split('/').pop() || 'Untitled';

    // Read MDX source file to extract section content
    let intro = frontmatter.description || '';
    const sectionContents: Map<string, string> = new Map();

    try {
      const mdxPath = path.join(CONTENT_DIR, page.path);
      const mdxContent = await readFile(mdxPath, 'utf-8');
      const parsed = parseSections(mdxContent);

      // Use parsed intro if no description
      if (!intro && parsed.intro) {
        intro = parsed.intro.slice(0, 200);
      }

      // Map section content by anchor
      for (const section of parsed.sections) {
        sectionContents.set(section.anchor, section.content.slice(0, 300));
      }
    } catch {
      // File read failed, continue with empty content
    }

    // Add the page itself (intro)
    documents.push({
      id: `${page.path}#intro`,
      title: pageTitle,
      pageTitle,
      content: intro,
      path: basePath,
      locale,
    });

    // Add each TOC item as a separate document
    const toc = compiled.toc || [];
    for (const item of toc) {
      const anchor = item.url.startsWith('#') ? item.url.slice(1) : item.url;
      const sectionContent = sectionContents.get(anchor) || '';

      documents.push({
        id: `${page.path}#${anchor}`,
        title: item.title,
        pageTitle,
        content: sectionContent,
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
