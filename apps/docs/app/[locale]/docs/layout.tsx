import { setRequestLocale } from 'next-intl/server';
import DocsLayout from '@/components/docs/layout';
import { config } from '@/lib/config';

export default async function Layout({
  children,
  params,
}: LayoutProps<'/[locale]/docs'>) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <DocsLayout config={await config()}>{children}</DocsLayout>;
}
