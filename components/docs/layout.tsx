import type { PropsWithChildren } from 'react';
import { Header } from '@/components/docs/header';
import { Sidebar } from '@/components/docs/sidebar';
import { SidebarWrapper } from '@/components/docs/sidebar-wrapper';
import { SearchModalProvider } from '@/components/search-modal-provider';
import type { DocsConfig } from '@/lib/schema';

export default function DocsLayout({
  config,
  children,
}: PropsWithChildren<{ config: DocsConfig }>) {
  const { group } = config.navigation;

  return (
    <SearchModalProvider>
      <div>
        <Header config={config} />
        <main className={'group/docs-main flex w-full'}>
          {'groups' in group && (
            <SidebarWrapper links={group.groups.map((g) => g.link)}>
              {group.groups.map((g) => (
                <Sidebar key={g.link} group={g} />
              ))}
            </SidebarWrapper>
          )}
          {children}
        </main>
      </div>
    </SearchModalProvider>
  );
}
