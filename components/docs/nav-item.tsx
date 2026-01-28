'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export function NavItem({
  icon,
  title,
  href,
}: {
  icon?: ReactNode;
  title: string;
  href: string;
}) {
  const pathname = usePathname();
  const active = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn('relative h-full flex items-center gap-2 [&>svg]:size-4', {
        'text-primary': active,
      })}
    >
      {icon}
      <span className={'text-sm font-medium'}>{title}</span>
      <div
        className={cn('absolute z-10 bottom-0 w-full left-0 h-px', {
          'bg-primary': active,
        })}
      ></div>
    </Link>
  );
}
