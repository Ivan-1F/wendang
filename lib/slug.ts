import { docs } from 'content/docs';
import config from '@/docs.config';
import type { Page, Group } from '@/lib/config';

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

export async function getPage(slug: string[]) {
  const pages = await docs.list();

  for (const page of pages) {
    const pageSlug = pathToSlug(page.path);
    if (slugsEqual(pageSlug, slug)) {
      return page;
    }
  }

  return undefined;
}

/**
 * Find the deepest section that contains the given slug.
 * Returns the section title or null if not found.
 */
export function matchSection(slug: string[]): string | null {
  const groupConfig = config.group;
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
          return childPath === slugPath;
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

  return findSection(matchingGroup.children, '');
}
