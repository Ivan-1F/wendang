import type { Group, Page } from '@/lib/config';
import { cn } from '@/lib/utils';
import { renderIcon } from '@/lib/icon';
import docsConfig from '@/docs.config';
import Link from 'next/link';
import { getPage } from '@/lib/slug';
import { connectLinks } from '@/lib/link';

async function SidebarItem({
  page,
  depth = 0,
  base,
  className,
}: {
  page: Page;
  depth?: number;
  base?: string;
  className?: string;
}) {
  if (typeof page === 'string') {
    const href = connectLinks(base, page);

    const pageData = await getPage(
      href.replace('/docs', '').split('/').filter(Boolean),
    );

    return (
      <Link
        href={href}
        className={cn('block hover:bg-muted py-1.5 px-3 rounded-xl', className)}
      >
        {pageData ? pageData.compiled.frontmatter.title : page}
      </Link>
    );
  }

  return (
    <div className={cn('space-y-px', className)}>
      <div
        className={cn('[&>svg]:size-4 ml-3 flex items-center gap-2', {
          'text-primary mb-3.5': depth === 0,
          'py-1.5': depth !== 0,
        })}
      >
        {renderIcon(page.icon, docsConfig)}
        {page.title}
      </div>
      {page.children.map((child, index) => (
        <SidebarItem
          key={index}
          page={child}
          depth={depth + 1}
          base={connectLinks(base, page.base)}
          className={cn({ 'pl-8': depth !== 0 })}
        />
      ))}
    </div>
  );
}

export function Sidebar({ group }: { group: Group }) {
  return (
    <aside
      className={
        'w-80 p-5 pl-0 border-r space-y-8 font-medium text-muted-foreground text-sm'
      }
    >
      {group.children.map((page, index) => (
        <SidebarItem key={index} page={page} base={group.link} />
      ))}
    </aside>
  );
}
