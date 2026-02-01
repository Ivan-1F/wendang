import { setRequestLocale } from 'next-intl/server';
import DocsLayout from '@/components/docs/layout';
import { DocsConfigProvider } from '@/components/docs/config-context';
import { config } from '@/lib/config';

export default async function Layout({
  children,
  params,
}: LayoutProps<'/[locale]/docs'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const docsConfig = await config();
  const { iconLoader, ...rest } = docsConfig;

  return (
    <DocsConfigProvider config={rest}>
      <DocsLayout config={docsConfig}>{children}</DocsLayout>
    </DocsConfigProvider>
  );
}
