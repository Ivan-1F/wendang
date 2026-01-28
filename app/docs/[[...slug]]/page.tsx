import { notFound } from 'next/navigation';
import { getPage, matchSection, getPageNavigation } from '@/lib/slug';
import { PageNavigation } from '@/components/docs/page-navigation';
import docsConfig from '@/docs.config';

export default async function DocsPage({
  params,
}: PageProps<'/docs/[[...slug]]'>) {
  const { slug } = await params;
  const page = await getPage(slug ?? []);

  if (!page) {
    notFound();
  }

  const { default: MDX, frontmatter } = page.compiled;

  const section = matchSection(slug ?? []);

  // Get navigation for current page
  const groupConfig = docsConfig.group;
  const currentGroup =
    'groups' in groupConfig ? groupConfig.groups[0] : null;
  const navigation = currentGroup
    ? getPageNavigation(slug ?? [], currentGroup)
    : { prev: null, next: null };

  return (
    <div className={'py-10 max-w-3xl w-full mx-auto'}>
      <header className={'space-y-2'}>
        {section && (
          <p className={'text-sm font-semibold text-primary'}>{section}</p>
        )}
        <h1 className={'text-3xl font-bold text-gray-900'}>
          {frontmatter.title}
        </h1>
        <p
          className={
            'mt-2 text-lg max-w-none prose prose-gray dark:prose-invert'
          }
        >
          {frontmatter.description}
        </p>
      </header>

      <article className={'mt-8 prose max-w-none'}>
        <MDX />
      </article>

      <PageNavigation prev={navigation.prev} next={navigation.next} />
    </div>
  );
}
