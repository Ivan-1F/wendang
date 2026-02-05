import { TOC } from '@/components/docs/toc';
import type { TOCProps } from '@/lib/toc';

export function TOCSidebar({ items }: TOCProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <aside className="hidden xl:block w-64 shrink-0">
      <div className="sticky top-34">
        <TOC items={items} />
      </div>
    </aside>
  );
}
