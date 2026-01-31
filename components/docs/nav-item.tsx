'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { usePathname } from '@/i18n/navigation';

export function NavItem({
  icon,
  title,
  href,
  allLinks,
}: {
  icon?: ReactNode;
  title: string;
  href: string;
  allLinks: string[];
}) {
  const pathname = usePathname();

  // Find the longest matching link
  const activeHref =
    allLinks
      .filter((link) => pathname === link || pathname.startsWith(`${link}/`))
      .sort((a, b) => b.length - a.length)[0] ?? null;

  const active = href === activeHref;

  return (
    <Link
      href={href}
      className={cn('relative h-full flex items-center gap-2 [&>svg]:size-4 font-medium', {
        'text-primary font-semibold': active,
      })}
    >
      {icon}
      <span className={'text-sm'}>{title}</span>
      <div
        className={cn('absolute z-10 bottom-0 w-full left-0 h-px', {
          'bg-primary': active,
        })}
      ></div>
    </Link>
  );
}
