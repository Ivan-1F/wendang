import { setRequestLocale } from 'next-intl/server';

export default async function Page({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <div>Go to /docs to view the document</div>;
}
