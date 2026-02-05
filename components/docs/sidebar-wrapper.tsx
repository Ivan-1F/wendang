'use client';

import type { ReactNode } from 'react';
import { usePathname } from '@/i18n/navigation';

export function SidebarWrapper({
  children,
  links,
}: {
  children: ReactNode[];
  links: string[];
}) {
  const pathname = usePathname();

  // Find the longest matching link
  const activeIndex = links.reduce(
    (bestIdx, link, idx) => {
      const matches = pathname === link || pathname.startsWith(`${link}/`);
      if (matches && link.length > (links[bestIdx]?.length ?? 0)) {
        return idx;
      }
      return bestIdx;
    },
    -1,
  );

  return <>{children[activeIndex] ?? null}</>;
}
