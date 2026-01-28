import type { Group, Page } from '@/lib/config';
import { cn } from '@/lib/utils';
import { renderIcon } from '@/lib/icon';
import docsConfig from '@/docs.config';
import Link from 'next/link';

function SidebarItem({
  page,
  depth = 0,
  className,
}: {
  page: Page;
  depth?: number;
  className?: string;
}) {
  if (typeof page === 'string') {
    return (
      <Link
        href={page}
        className={cn(
          'block hover:bg-muted py-1.5 px-3 rounded-xl',
          className,
        )}
      >
        {page}
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
      {page.children.map((page, index) => (
        <SidebarItem
          key={index}
          page={page}
          depth={depth + 1}
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
        <SidebarItem key={index} page={page} />
      ))}
    </aside>
  );
}
