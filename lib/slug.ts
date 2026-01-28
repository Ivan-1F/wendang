import { docs } from 'content/docs';

// Remove route groups (folders in parentheses) and .mdx extension from path
export function pathToSlug(path: string): string[] {
  return path
    .replace(/\.mdx$/, '')
    .split('/')
    .filter(segment => !segment.startsWith('(') && segment !== 'index');
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
