import type { ReactNode } from 'react';
import type { DocsConfig, StringOrElement } from '@/lib/config';

export const renderIcon = (
  icon: StringOrElement,
  config: DocsConfig,
): ReactNode => {
  if (typeof icon === 'string') {
    if (config.iconLoader) {
      return config.iconLoader(icon);
    } else {
      throw new Error('Used icon name while no icon loader configured');
    }
  }

  return icon;
};
