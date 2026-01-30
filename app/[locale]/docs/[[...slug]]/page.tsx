import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import {
  getPage,
  matchSection,
  getPageNavigation,
  pathToSlug,
} from '@/lib/slug';
import { PageNavigation } from '@/components/docs/page-navigation';
import { config } from '@/lib/config';
import { docs } from 'content/docs';
import { CodeBlock } from '@/components/code-block';
import { routing } from '@/i18n/routing';

export async function generateStaticParams() {
  const locales = routing().locales;
  const pages = docs.list();

  return locales.flatMap((locale) =>
    pages.map((page) => ({
      locale,
      slug: pathToSlug(page.path),
    }))
  );
}

export default async function DocsPage({
  params,
}: PageProps<'/[locale]/docs/[[...slug]]'>) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const page = await getPage(slug ?? []);

  if (!page) {
    notFound();
  }

  const { default: MDX, frontmatter } = page.compiled;

  const section = await matchSection(slug ?? []);

  // Get navigation for current page
  const groupConfig = (await config()).navigation.group;
  const currentGroup = 'groups' in groupConfig ? groupConfig.groups[0] : null;
  const navigation = currentGroup
    ? getPageNavigation(slug ?? [], currentGroup)
    : { prev: null, next: null };

  return (
    <div className={'py-10 max-w-3xl w-full mx-auto'}>
      <header className={'space-y-2'}>
        {section && (
          <p className={'text-sm font-semibold text-primary'}>{section}</p>
        )}
        <h1 className={'text-3xl font-bold text-gray-900 dark:text-gray-200'}>
          {frontmatter.title}
        </h1>
        <p className={'mt-2 text-lg max-w-none prose dark:prose-invert'}>
          {frontmatter.description}
        </p>
      </header>

      <article className={'mt-8 prose dark:prose-invert max-w-none'}>
        <MDX components={{ pre: CodeBlock }} />
      </article>

      <PageNavigation prev={navigation.prev} next={navigation.next} />
    </div>
  );
}
