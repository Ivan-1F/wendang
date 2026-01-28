import { notFound } from 'next/navigation';
import { getPage } from '@/lib/slug';

export default async function DocsPage({
  params,
}: PageProps<'/docs/[[...slug]]'>) {
  const { slug } = await params;
  const page = await getPage(slug ?? []);

  if (!page) {
    notFound();
  }

  const { default: MDX, frontmatter } = page.compiled;

  return (
    <div className={'pt-10 max-w-3xl w-full mx-auto'}>
      <h1 className={'text-3xl font-bold text-gray-900'}>
        {frontmatter.title}
      </h1>
      <p className={'mt-2 text-lg max-w-none prose prose-gray dark:prose-invert'}>{frontmatter.description}</p>

      <article className={'mt-8 prose max-w-none'}>
        <MDX />
      </article>
    </div>
  );
}
