'use client';

import { AlignJustifyIcon } from 'lucide-react';
import { SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

export function SidebarSheetTrigger() {
  return (
    <SheetTrigger
      render={
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden"
          aria-label="Toggle sidebar"
        >
          <AlignJustifyIcon className="size-4" />
        </Button>
      }
    />
  );
}
