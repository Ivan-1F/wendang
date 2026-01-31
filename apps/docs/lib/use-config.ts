import docsConfig from '@/docs.config';
import { docsConfigSchema } from '@/lib/schema';
import { merge } from 'ts-deepmerge';
import { useLocale } from 'next-intl';

// TODO: extract common part with config()
export const useConfig = () => {
  const locale = useLocale();

  if (!docsConfig.i18n) {
    return docsConfig;
  }

  const localeConfig = docsConfig.i18n.locales[locale];

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
