import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { docs } from 'content/docs';
import type { Page, Group } from '@/lib/schema';
import { config } from '@/lib/config';

const CONTENT_DIR = path.join(process.cwd(), 'content/docs');

export interface FlatPage {
  href: string;
  slug: string[];
}

export interface PageNavigation {
  prev: FlatPage | null;
  next: FlatPage | null;
}

// Remove route groups (folders in parentheses) and .mdx extension from path
export function pathToSlug(path: string): string[] {
  return path
    .replace(/\.mdx$/, '')
    .split('/')
    .filter((segment) => !segment.startsWith('(') && segment !== 'index');
}

export function slugsEqual(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

export const getPageBySlug = (slug: string[]) => {
  const pages = docs.list();

  for (const page of pages) {
    const pageSlug = pathToSlug(page.path);
    if (slugsEqual(pageSlug, slug)) {
      return page;
    }
  }

  return undefined;
};

export async function getPage(slug: string[], locale?: string) {
  const i18n = await config().then((config) => config.i18n);

  if (!i18n || !locale) {
    return getPageBySlug(slug);
  }

  const localePage = getPageBySlug([locale, ...slug]);

  if (localePage) {
    return localePage;
  }

  return getPageBySlug([i18n.defaultLocale, ...slug]);
}

export async function getMarkdown(page: { path: string }): Promise<string | null> {
  try {
    const filePath = path.join(CONTENT_DIR, page.path);
    return await readFile(filePath, 'utf-8');
  } catch {
    return null;
  }
}

/**
 * Find the deepest section that contains the given slug.
 * Returns the section title or null if not found.
 */
export async function matchSection(slug: string[]): Promise<string | null> {
  const groupConfig = (await config()).navigation.group;
  if (!('groups' in groupConfig)) {
    return null;
  }

  const slugPath = slug.join('/');

  // Find the matching group by link prefix
  const matchingGroup = groupConfig.groups.find((g: Group) => {
    const linkPath = g.link.replace(/^\/docs\/?/, '');
    if (linkPath === '') {
      // Root group matches slugs that don't match other groups
      return !groupConfig.groups.some(
        (other: Group) =>
          other !== g &&
          other.link !== '/docs' &&
          slugPath.startsWith(other.link.replace(/^\/docs\//, '')),
      );
    }
    return slugPath.startsWith(linkPath);
  });

  if (!matchingGroup || matchingGroup.children.length === 0) {
    return null;
  }

  // Calculate the relative slug path within the group (strip group prefix)
  const linkPath = matchingGroup.link.replace(/^\/docs\/?/, '');
  const relativeSlugPath = linkPath
    ? slugPath.startsWith(`${linkPath}/`)
      ? slugPath.slice(linkPath.length + 1)
      : slugPath === linkPath
        ? ''
        : slugPath
    : slugPath;

  // Recursively search for the deepest matching section
  function findSection(pages: Page[], basePath: string): string | null {
    let result: string | null = null;

    for (const page of pages) {
      if (typeof page === 'string') {
        continue;
      }

      // This is a section object
      const section = page;
      const sectionBase = section.base
        ? basePath
          ? `${basePath}/${section.base}`
          : section.base
        : basePath;

      // Check if any child matches the slug
      const hasMatch = section.children.some((child) => {
        if (typeof child === 'string') {
          const childPath =
            child === '.'
              ? sectionBase
              : sectionBase
                ? `${sectionBase}/${child}`
                : child;
          return childPath === relativeSlugPath;
        }
        return false;
      });

      if (hasMatch) {
        result = section.title;
      }

      // Recursively check nested sections
      const nestedResult = findSection(section.children, sectionBase);
      if (nestedResult) {
        result = nestedResult;
      }
    }

    return result;
  }

  const sectionResult = findSection(matchingGroup.children, '');
  if (sectionResult) {
    return sectionResult;
  }

  // If no section matched, check if the page is directly in the group's children
  // (not nested in a section). If so, return the group's title.
  function isDirectChild(pages: Page[], basePath: string): boolean {
    for (const page of pages) {
      if (typeof page === 'string') {
        const childPath =
          page === '.'
            ? basePath
            : basePath
              ? `${basePath}/${page}`
              : page;
        if (childPath === relativeSlugPath) {
          return true;
        }
      }
    }
    return false;
  }

  if (isDirectChild(matchingGroup.children, '')) {
    return matchingGroup.title;
  }

  return null;
}

/**
 * Flatten a Group's children into an ordered list of pages.
 */
export function flattenPages(group: Group): FlatPage[] {
  const result: FlatPage[] = [];
  const baseLink = group.link.replace(/\/$/, '');
  // Extract group path prefix from link (e.g., "/docs/guides" -> ["guides"])
  const groupPrefix = baseLink
    .replace(/^\/docs\/?/, '')
    .split('/')
    .filter(Boolean);

  function collectPages(pages: Page[], basePath: string): void {
    for (const page of pages) {
      if (typeof page === 'string') {
        // Leaf node - this is a page
        const pagePath =
          page === '.' ? basePath : basePath ? `${basePath}/${page}` : page;
        const href = pagePath ? `${baseLink}/${pagePath}` : baseLink;
        const pageSegments = pagePath ? pagePath.split('/') : [];
        const slug = [...groupPrefix, ...pageSegments];
        result.push({ href, slug });
      } else {
        // Section with children - recurse
        const sectionBase = page.base
          ? basePath
            ? `${basePath}/${page.base}`
            : page.base
          : basePath;
        collectPages(page.children, sectionBase);
      }
    }
  }

  collectPages(group.children, '');
  return result;
}

/**
 * Get previous and next page navigation for the given slug.
 */
export function getPageNavigation(
  slug: string[],
  group: Group,
): PageNavigation {
  const pages = flattenPages(group);
  const currentIndex = pages.findIndex((p) => slugsEqual(p.slug, slug));

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: currentIndex > 0 ? pages[currentIndex - 1] : null,
    next: currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null,
  };
}
