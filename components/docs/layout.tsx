import type { PropsWithChildren } from 'react';
import { Header } from '@/components/docs/header';
import type { DocsConfig } from '@/lib/config';

export default function DocsLayout({
  config,
  children,
}: PropsWithChildren<{ config: DocsConfig }>) {
  return (
    <div>
      <Header config={config} />
      <main>{children}</main>
    </div>
  );
}
