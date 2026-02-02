import { type NextRequest, NextResponse } from 'next/server';
import { getMarkdown } from '@/lib/slug';

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  const { slug = [] } = await params;

  const content = await getMarkdown(slug);

  if (!content) {
    return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  }

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
}
