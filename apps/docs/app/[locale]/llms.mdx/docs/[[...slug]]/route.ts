import { type NextRequest, NextResponse } from 'next/server';
import { getMarkdown, getPage } from '@/lib/slug';

export async function GET(
  _: NextRequest,
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
