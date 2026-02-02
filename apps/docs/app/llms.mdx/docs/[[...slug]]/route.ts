import { type NextRequest, NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getPageBySlug } from '@/lib/slug';

const CONTENT_DIR = path.join(process.cwd(), 'content/docs');

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  const { slug = [] } = await params;

  const page = getPageBySlug(slug);

  if (!page) {
    return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  }

  try {
    const filePath = path.join(CONTENT_DIR, page.path);
    const content = await readFile(filePath, 'utf-8');

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to read file' }, { status: 500 });
  }
}
