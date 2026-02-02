import { type NextRequest, NextResponse } from 'next/server';
import { getMarkdown, getPageBySlug } from '@/lib/slug';

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  const { slug = [] } = await params;

  const page = getPageBySlug(slug);

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
