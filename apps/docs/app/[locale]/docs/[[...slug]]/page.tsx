import type { Metadata } from 'next';
import Image from 'next/image';
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
import { TOCSidebar } from '@/components/docs/toc-sidebar';
import type { TableOfContents } from '@/lib/toc';
import { cn } from '@/lib/utils';
import { Card } from '@/components/docs/prelude/card';

export async function generateStaticParams() {
  const locales = routing().locales;
  const pages = docs.list();

  return locales.flatMap((locale) =>
    pages.map((page) => ({
      locale,
      slug: pathToSlug(page.path),
    })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/docs/[[...slug]]'>): Promise<Metadata> {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const page = await getPage(slug ?? [], locale);

  if (!page) {
    notFound();
  }

  return {
    title: page.compiled.frontmatter.title,
  };
}

export default async function DocsPage({
  params,
}: PageProps<'/[locale]/docs/[[...slug]]'>) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const page = await getPage(slug ?? [], locale);

  if (!page) {
    notFound();
  }

  const {
    default: MDX,
    frontmatter,
    toc = [],
  } = page.compiled as typeof page.compiled & { toc?: TableOfContents };

  const section = await matchSection(slug ?? []);

  // Get navigation for current page
  const groupConfig = (await config()).navigation.group;
  const pathname = `/docs/${(slug ?? []).join('/')}`;
  const currentGroup =
    'groups' in groupConfig
      ? (groupConfig.groups
          .filter(
            (g) => pathname === g.link || pathname.startsWith(`${g.link}/`),
          )
          .sort((a, b) => b.link.length - a.link.length)[0] ?? null)
      : null;
  const navigation = currentGroup
    ? getPageNavigation(slug ?? [], currentGroup)
    : { prev: null, next: null };

  return (
    <div
      className={cn(
        'flex flex-1 gap-12 justify-center py-10 lg:pl-6 max-w-3xl mx-auto',
        { 'xl:pl-18 max-w-6xl': toc.length !== 0 },
      )}
    >
      <div className="grow">
        <header className="space-y-2">
          {section && (
            <p className="text-sm font-semibold text-primary">{section}</p>
          )}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200">
            {frontmatter.title}
          </h1>
          <p className="mt-2 text-lg max-w-none prose dark:prose-invert">
            {frontmatter.description}
          </p>
        </header>

        <article className="mt-8 prose dark:prose-invert max-w-none">
          <MDX
            components={{
              pre: CodeBlock,
              Card,
              img: (props) => (
                <Image
                  {...props}
                  alt={props.alt}
                  sizes={'(max-width: 768px) 100vw, 768px'}
                  className={'rounded-lg'}
                />
              ),
            }}
          />
        </article>

        <PageNavigation prev={navigation.prev} next={navigation.next} />
      </div>
      <TOCSidebar items={toc} />
    </div>
  );
}
