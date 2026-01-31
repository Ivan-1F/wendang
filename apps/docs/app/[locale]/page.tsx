import { setRequestLocale } from 'next-intl/server';
import { ComponentExample } from "@/components/component-example";

export default async function Page({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ComponentExample />;
}