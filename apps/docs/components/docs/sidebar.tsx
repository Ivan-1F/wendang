import type { Group, Page } from '@/lib/schema';
import { cn } from '@/lib/utils';
import { renderIcon } from '@/lib/icon';
import { getPage } from '@/lib/slug';
import { connectLinks } from '@/lib/link';
import { SidebarLink } from '@/components/docs/sidebar-link';
import { config } from '@/lib/config';
import { getLocale } from 'next-intl/server';

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
      await getLocale(),
    );

    return (
      <SidebarLink
        className={className}
        href={href}
        title={pageData ? pageData.compiled.frontmatter.title : page}
      />
    );
  }

  return (
    <div className={cn('space-y-px', className)}>
      <div
        className={cn('[&>svg]:size-4 ml-3 flex items-center gap-2', {
          'text-foreground mb-3.5': depth === 0,
          'py-1.5': depth !== 0,
        })}
      >
        {renderIcon(page.icon, await config())}
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
      className={cn(
        'hidden lg:block',
        'w-80 p-5 pl-0 border-r space-y-8 font-medium text-muted-foreground text-sm',
        'sticky h-[calc(100vh-96px)] top-24 bottom-0 overflow-y-auto',
      )}
    >
      {group.children.map((page, index) => (
        <SidebarItem key={index} page={page} base={group.link} />
      ))}
    </aside>
  );
}
