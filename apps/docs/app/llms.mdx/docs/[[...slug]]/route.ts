import { type NextRequest, NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { docs } from 'content/docs';
import { pathToSlug, slugsEqual } from '@/lib/slug';

const CONTENT_DIR = path.join(process.cwd(), 'content/docs');

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  const { slug = [] } = await params;

  const pages = docs.list();
  const targetPage = pages.find((page) => {
    const pageSlug = pathToSlug(page.path);
    return slugsEqual(pageSlug, slug);
  });

  if (!targetPage) {
    return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  }

  try {
    const filePath = path.join(CONTENT_DIR, targetPage.path);
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
