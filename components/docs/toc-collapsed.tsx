'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon, AlignJustifyIcon } from 'lucide-react';
import { Collapsible } from '@base-ui/react/collapsible';
import { cn } from '@/lib/utils';
import type { TOCProps, TableOfContents } from '@/lib/toc';
import {
  AnchorProvider,
  ScrollProvider,
  TOCItem,
} from 'fumadocs-core/toc';

function useActiveItem(items: TableOfContents) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '-100px 0px -80% 0px' }
    );

    for (const item of items) {
      const id = item.url.slice(1); // Remove # prefix
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [items]);

  return items.find((item) => item.url === `#${activeId}`) ?? items[0];
}

export function TOCCollapsed({ items }: TOCProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeItem = useActiveItem(items);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div ref={containerRef} className="xl:hidden sticky top-14 lg:top-24 z-10">
      <Collapsible.Root open={open} onOpenChange={setOpen}>
        <Collapsible.Trigger
          className={cn(
            'w-full h-10 flex items-center text-sm bg-background border-b',
            // lg: if sidebar does not exist, we need to align collapsible trigger with header
            'px-6 lg:px-9',
            // if sidebar exists, we do not need to align collapsible trigger's left edge with header, so reduce padding to look better
            'lg:group-has-[.docs-sidebar]/docs-main:pl-6',
          )}
        >
          <AlignJustifyIcon className="size-4 shrink-0 mr-2" />
          <span className="truncate font-medium flex-1 text-left">
            {activeItem?.title ?? 'On this page'}
          </span>
          <ChevronDownIcon
            className={cn(
              'size-4 shrink-0 ml-2 transition-transform duration-200 data-panel-open:rotate-180'
            )}
          />
        </Collapsible.Trigger>
        <Collapsible.Panel
          keepMounted
          className={cn(
            'absolute left-0 right-0 bg-background border-b shadow-lg transition-all duration-200 origin-top',
            'data-open:scale-y-100 data-open:opacity-100',
            'data-closed:scale-y-0 data-closed:opacity-0 data-closed:pointer-events-none',
            'data-starting-style:scale-y-0 data-starting-style:opacity-0',
            'data-ending-style:scale-y-0 data-ending-style:opacity-0'
          )}
        >
          <AnchorProvider toc={items} single>
            <ScrollProvider containerRef={containerRef}>
              <nav className="py-3 px-6">
                <div className="flex flex-col gap-1 text-sm">
                  {items.map((item) => (
                    <TOCItem
                      key={item.url}
                      href={item.url}
                      onClick={() => setOpen(false)}
                      className="py-1.5 text-muted-foreground transition-colors hover:text-foreground data-[active=true]:font-medium data-[active=true]:text-primary"
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
        </Collapsible.Panel>
      </Collapsible.Root>
    </div>
  );
}
