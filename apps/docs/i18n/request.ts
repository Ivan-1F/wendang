import { getRequestConfig } from 'next-intl/server';
import { config } from '@/lib/config';
import type { Translations } from '@/lib/schema';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = (await requestLocale) || 'default';

  const { i18n } = await config(requested);

  return {
    locale: requested,
    messages: i18n?.locales[requested].translations,
  };
});

declare module 'next-intl' {
  interface AppConfig {
    Messages: Translations;
  }
}
