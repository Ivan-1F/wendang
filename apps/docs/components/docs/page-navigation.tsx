import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getPage, type FlatPage } from '@/lib/slug';
import { getLocale } from 'next-intl/server';
import { cn } from '@/lib/utils';

interface PageNavigationProps {
  prev: FlatPage | null;
  next: FlatPage | null;
}

async function NavButton({
  page,
  direction,
}: {
  page: FlatPage;
  direction: 'prev' | 'next';
}) {
  const pageData = await getPage(page.slug, await getLocale());
  const title = pageData?.compiled.frontmatter.title ?? page.slug.join('/');

  return (
    <Link
      href={page.href}
      className={cn(
        'group flex flex-col gap-0.5 px-3 py-2 h-full rounded-lg border hover:border-primary',
        direction === 'next' ? 'items-end text-right' : 'items-start',
      )}
    >
      <span className="text-xs text-muted-foreground flex items-center gap-1">
        {direction === 'prev' && <ChevronLeft className="w-3 h-3" />}
        {direction === 'prev' ? 'Previous' : 'Next'}
        {direction === 'next' && <ChevronRight className="w-3 h-3" />}
      </span>
      <span className="text-sm font-medium">
        {title}
      </span>
    </Link>
  );
}

export async function PageNavigation({ prev, next }: PageNavigationProps) {
  if (!prev && !next) {
    return null;
  }

  return (
    <nav className="grid grid-cols-2 gap-4 mt-12 pt-6 border-t">
      <div>{prev && <NavButton page={prev} direction="prev" />}</div>
      <div>{next && <NavButton page={next} direction="next" />}</div>
    </nav>
  );
}
