import DocsLayout from '@/components/docs/layout';
import { config } from '@/lib/config';

export default async function Layout({
  children,
}: LayoutProps<'/[locale]/docs'>) {
  return <DocsLayout config={await config()}>{children}</DocsLayout>;
}
