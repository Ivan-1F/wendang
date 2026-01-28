'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function SidebarLink({
  href,
  title,
  className,
}: {
  href: string;
  title: string;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={cn(
        'block hover:bg-muted py-1.5 px-3 rounded-xl',
        { 'bg-primary/10 text-primary font-medium': pathname === href },
        className,
      )}
    >
      {title}
    </Link>
  );
}
