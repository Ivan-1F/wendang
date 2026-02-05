import { NextResponse } from 'next/server';
import { getMarkdown, getPage, pathToSlug } from '@/lib/slug';
import { docs } from 'content/docs';
import { routing } from '@/i18n/routing';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  const locales = routing().locales;
  const pages = docs.list();

  return locales.flatMap((locale) =>
    pages.map((page) => ({
      locale,
      slug: pathToSlug(page.path),
    })),
  );
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ locale: string; slug?: string[] }> },
) {
  const { locale, slug = [] } = await params;

  const page = await getPage(slug, locale);

  if (!page) {
    return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  }

  const content = await getMarkdown(page);

  if (!content) {
    return NextResponse.json({ error: 'Failed to read file' }, { status: 500 });
  }

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
}
