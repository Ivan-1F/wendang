import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import {
  getPage,
  matchSection,
  getPageNavigation,
  pathToSlug,
  getMarkdown,
} from '@/lib/slug';
import { PageNavigation } from '@/components/docs/page-navigation';
import { config } from '@/lib/config';
import { docs } from 'content/docs';
import { CodeBlock } from '@/components/code-block';
import { routing } from '@/i18n/routing';
import { TOCSidebar } from '@/components/docs/toc-sidebar';
import { TOCCollapsed } from '@/components/docs/toc-collapsed';
import type { TableOfContents } from '@/lib/toc';
import { cn } from '@/lib/utils';
import { Card } from '@/components/docs/prelude/card';
import { AiActions } from '@/components/docs/ai-actions';

const isExternalLink = (href?: string) => {
  if (!href) return false;
  if (href.startsWith('/') || href.startsWith('#') || href.startsWith('?')) {
    return false;
  }
  if (href.startsWith('./') || href.startsWith('../')) {
    return false;
  }
  return /^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('//');
};

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

  const docsConfig = await config(locale);
  const pageTitle = page.compiled.frontmatter.title;
  const title = docsConfig.siteName
    ? `${pageTitle} - ${docsConfig.siteName}`
    : pageTitle;

  return {
    title,
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

  const rawMarkdown = await getMarkdown(page);

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
    <div className="flex-1">
      <TOCCollapsed items={toc} />
      {/* Main: Article + Sidebar */}
      <div
        className={cn(
          'flex mx-auto gap-12 justify-center py-10 max-w-3xl',
          'px-6 lg:pr-9', // lg: align with header
          { 'xl:pl-18 xl:max-w-6xl': toc.length !== 0 },
        )}
      >
        {/* Article */}
        <div className="grow">
          <header className="space-y-2">
            {section && (
              <p className="text-sm font-semibold text-primary">{section}</p>
            )}
            <div className={'flex items-start justify-between gap-4'}>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200">
                {frontmatter.title}
              </h1>
              <AiActions className={'hidden sm:block'} markdown={rawMarkdown || ''} />
            </div>
            <p className="text-lg max-w-none prose dark:prose-invert text-muted-foreground">
              {frontmatter.description}
            </p>
            <AiActions className={'mt-4 sm:hidden'} markdown={rawMarkdown || ''} />
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
                a: ({ href, className, target, rel, ...rest }) => {
                  const isExternal = isExternalLink(href);

                  return (
                    <a
                      {...rest}
                      href={href}
                      target={isExternal ? target ?? '_blank' : target}
                      rel={isExternal ? rel ?? 'noopener noreferrer' : rel}
                      className={cn(
                        'underline decoration-primary decoration-1 underline-offset-4 hover:decoration-2 transition-all',
                        className,
                      )}
                    />
                  );
                },
              }}
            />
          </article>

          <PageNavigation prev={navigation.prev} next={navigation.next} />
        </div>

        {/* Sidebar */}
        <TOCSidebar items={toc} />
      </div>
    </div>
  );
}
