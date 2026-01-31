import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  return {
    // TODO
    locale: requested || 'en',
    messages: {},
  };
});
