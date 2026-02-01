import type { MDXComponents } from 'mdx/types';

import { CodeBlock } from '@/components/code-block';
import { Card } from '@/components/docs/prelude/card';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    pre: CodeBlock,
    Card,
  };
}
