import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getPage, type FlatPage } from '@/lib/slug';

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
  const pageData = await getPage(page.slug);
  const title = pageData?.compiled.frontmatter.title ?? page.slug.join('/');

  return (
    <Link
      href={page.href}
      className={
        'group flex flex-col gap-1 p-4 rounded-xl border hover:bg-muted transition-colors ' +
        (direction === 'next' ? 'items-end text-right' : 'items-start')
      }
    >
      <span className="text-sm text-muted-foreground flex items-center gap-1">
        {direction === 'prev' && <ChevronLeft className="w-4 h-4" />}
        {direction === 'prev' ? 'Previous' : 'Next'}
        {direction === 'next' && <ChevronRight className="w-4 h-4" />}
      </span>
      <span className="font-medium group-hover:text-primary transition-colors">
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
    <nav className="flex gap-4 mt-12 pt-6 border-t">
      <div className="flex-1">
        {prev && <NavButton page={prev} direction="prev" />}
      </div>
      <div className="flex-1">
        {next && <NavButton page={next} direction="next" />}
      </div>
    </nav>
  );
}
