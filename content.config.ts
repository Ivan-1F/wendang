import rehypeShiki from '@shikijs/rehype';
import {
  transformerNotationDiff,
  transformerNotationHighlight,
} from '@shikijs/transformers';
import { mdxCollection } from 'fuma-content/collections/mdx';
import { defineConfig } from 'fuma-content/config';
import remarkGfm from 'remark-gfm';
import type { ShikiTransformer } from 'shiki';
import z from 'zod';
import { remarkHeading, remarkImage } from 'fumadocs-core/mdx-plugins';

const metaTransformer: ShikiTransformer = {
  name: 'meta-to-data-attrs',
  pre(node) {
    node.properties['data-language'] = this.options.lang || 'text';
    // Parse meta string directly
    const metaString = (this.options.meta as { __raw?: string })?.__raw || '';
    const titleMatch = metaString.match(/title="([^"]+)"/);
    if (titleMatch) node.properties['data-title'] = titleMatch[1];
    const iconMatch = metaString.match(/icon="([^"]+)"/);
    if (iconMatch) node.properties['data-icon'] = iconMatch[1];
    if (metaString.includes('lineNumbers')) {
      node.properties['data-line-numbers'] = 'true';
    }
  },
};

const docs = mdxCollection({
  dir: 'content/docs',
  frontmatter: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
  postprocess: {
    valueToExport: ['toc'],
  },
  options: () => ({
    remarkPlugins: [remarkGfm, remarkHeading, remarkImage],
    rehypePlugins: [
      [
        rehypeShiki,
        {
          themes: {
            light: 'github-light',
            dark: 'github-dark',
          },
          defaultColor: false,
          transformers: [
            transformerNotationDiff({ matchAlgorithm: 'v3' }),
            transformerNotationHighlight({ matchAlgorithm: 'v3' }),
            metaTransformer,
          ],
        },
      ],
    ],
  }),
});

export default defineConfig({
  collections: { docs },
});
