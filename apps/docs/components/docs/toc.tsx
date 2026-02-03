'use client';

import { useRef } from 'react';
import { AnchorProvider, ScrollProvider, TOCItem } from 'fumadocs-core/toc';
import type { TOCProps } from '@/lib/toc';
import { useTranslations } from 'next-intl';

export function TOC({ items }: TOCProps) {
  const t = useTranslations();

  const containerRef = useRef<HTMLDivElement>(null);

  if (items.length === 0) {
    return null;
  }

  return (
    <AnchorProvider toc={items} single>
      <ScrollProvider containerRef={containerRef}>
        <nav aria-label="Table of Contents">
          <p className="mb-4 text-sm font-medium">{t('on_this_page')}</p>
          <div ref={containerRef} className="flex flex-col gap-1 text-sm">
            {items.map((item) => (
              <TOCItem
                key={item.url}
                href={item.url}
                className="py-1 text-muted-foreground transition-colors hover:text-foreground data-[active=true]:font-medium data-[active=true]:text-foreground"
                style={{
                  paddingLeft: item.depth === 3 ? '1rem' : undefined,
                }}
              >
                {item.title}
              </TOCItem>
            ))}
          </div>
        </nav>
      </ScrollProvider>
    </AnchorProvider>
  );
}
