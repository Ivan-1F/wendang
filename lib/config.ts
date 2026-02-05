import { getLocale } from 'next-intl/server';
import docsConfig from '@/docs.config';
import { merge } from 'ts-deepmerge';
import { type DocsConfig, docsConfigSchema } from '@/lib/schema';

// server-side helper to get docs config
export const config = async (locale?: string): Promise<DocsConfig> => {
  const finalLocale = locale ?? await getLocale();

  if (!docsConfig.i18n) {
    return docsConfig;
  }

  const localeConfig = docsConfig.i18n.locales[finalLocale];

  if (!localeConfig) {
    return docsConfig;
  }

  if (!localeConfig.config) {
    return docsConfig;
  }

  return docsConfigSchema.parse(
    merge.withOptions(
      { mergeArrays: false },
      docsConfig,
      docsConfigSchema.parse(localeConfig.config),
    ),
  );
};
