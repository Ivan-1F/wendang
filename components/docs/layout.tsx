import type { PropsWithChildren } from 'react';
import { Header } from '@/components/docs/header';
import { Sidebar } from '@/components/docs/sidebar';
import type { DocsConfig } from '@/lib/config';

export default function DocsLayout({
  config,
  children,
}: PropsWithChildren<{ config: DocsConfig }>) {
  return (
    <div>
      <Header config={config} />
      <main className={'mx-auto max-w-7xl flex'}>
        {/* @ts-expect-error: TODO */}
        <Sidebar group={config.group.groups[0]} />
        {children}
      </main>
    </div>
  );
}
