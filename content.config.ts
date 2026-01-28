import { mdxCollection } from 'fuma-content/collections/mdx';
import { defineConfig } from 'fuma-content/config';
import z from 'zod';

const docs = mdxCollection({
  dir: 'content/docs',
  frontmatter: z.object({
    title: z.string(),
  }),
});

export default defineConfig({
  collections: { docs },
});
