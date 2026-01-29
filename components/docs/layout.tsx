import type { PropsWithChildren } from 'react';
import { Header } from '@/components/docs/header';
import { Sidebar } from '@/components/docs/sidebar';
import type { DocsConfig } from '@/lib/schema';

export default function DocsLayout({
  config,
  children,
}: PropsWithChildren<{ config: DocsConfig }>) {
  return (
    <div>
      <Header config={config} />
      <main className={'flex px-6'}>
        {/* @ts-expect-error: TODO */}
        <Sidebar group={config.navigation.group.groups[0]} />
        {children}
      </main>
    </div>
  );
}
