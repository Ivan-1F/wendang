'use client';

import type { PropsWithChildren } from 'react';
import { createContext, useContext } from 'react';
import type { DocsConfig } from '@/lib/schema';

const DocsConfigContext = createContext<DocsConfig | null>(null);

export function DocsConfigProvider({
  config,
  children,
}: PropsWithChildren<{ config: DocsConfig }>) {
  return (
    <DocsConfigContext.Provider value={config}>
      {children}
    </DocsConfigContext.Provider>
  );
}

export function useDocsConfig(): DocsConfig {
  const context = useContext(DocsConfigContext);

  if (!context) {
    throw new Error('useDocsConfig must be used within DocsConfigProvider');
  }

  return context;
}
