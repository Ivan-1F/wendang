import { defineRouting } from 'next-intl/routing';
import docsConfig from '@/docs.config';

export const routing = () => {
  const locales = docsConfig.i18n
    ? Object.keys(docsConfig.i18n.locales)
    : ['default'];
  const defaultLocale = docsConfig.i18n
    ? docsConfig.i18n.defaultLocale
    : 'default';

  return defineRouting({
    locales,
    defaultLocale,

    localePrefix: 'as-needed',
  });
};
