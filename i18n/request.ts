import { getRequestConfig } from 'next-intl/server';
import { config } from '@/lib/config';
import { type Translations, translationsSchema } from '@/lib/schema';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = (await requestLocale) || 'default';

  const { i18n } = await config(requested);

  const defaultTranslations = translationsSchema.parse({});

  const translations =
    i18n?.locales[requested].translations ?? defaultTranslations;

  return {
    locale: requested,
    messages: translations,
  };
});

declare module 'next-intl' {
  interface AppConfig {
    Messages: Translations;
  }
}
