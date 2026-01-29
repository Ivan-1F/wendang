import DocsLayout from '@/components/docs/layout';
import docsConfig from '@/docs.config';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return <DocsLayout config={docsConfig}>{children}</DocsLayout>;
}
