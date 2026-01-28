import { mdxCollection } from 'fuma-content/collections/mdx';
import { defineConfig } from 'fuma-content/config';
import remarkGfm from 'remark-gfm';
import z from 'zod';

const docs = mdxCollection({
  dir: 'content/docs',
  frontmatter: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),

  options: () => ({
    remarkPlugins: [remarkGfm],
  }),
});

export default defineConfig({
  collections: { docs },
});
