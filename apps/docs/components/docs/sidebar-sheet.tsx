import type { DocsConfig } from '@/lib/schema';
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet';
import { Sidebar } from '@/components/docs/sidebar';
import { SidebarWrapper } from '@/components/docs/sidebar-wrapper';
import { SidebarSheetTrigger } from '@/components/docs/sidebar-sheet-trigger';
import { GroupSelect } from '@/components/group-select';

export const SidebarSheet = ({ config }: { config: DocsConfig }) => {
  if (!('groups' in config.navigation.group)) {
    return null;
  }

  const { groups } = config.navigation.group;

  return (
    <Sheet>
      <SidebarSheetTrigger />
      <SheetContent showCloseButton={false} side="left" className="px-6">
        <SheetHeader className={'px-0'}>
          <div className={'mb-4 font-medium'}>{config.title}</div>
          <GroupSelect />
        </SheetHeader>
        <SidebarWrapper links={groups.map((group) => group.link)}>
          {groups.map((group) => (
            <Sidebar
              key={group.link}
              group={group}
              className="block static h-auto w-full border-0 p-0"
            />
          ))}
        </SidebarWrapper>
      </SheetContent>
    </Sheet>
  );
};
