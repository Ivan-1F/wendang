import type { ReactNode } from 'react';
import z from 'zod';

const reactNodeSchema = z.custom<ReactNode>();

const iconLoaderSchema = z.function({
  input: [z.string()],
  output: reactNodeSchema,
});

const sectionSchema = z.object({
  title: z.string(),
  icon: reactNodeSchema.optional(),
  base: z.string().optional(),
  get children() {
    return pageSchema.array();
  },
});

const pageSchema = z.union([z.string(), sectionSchema]);

const groupSchema = z.object({
  title: z.string(),
  icon: reactNodeSchema.optional(),
  link: z.string(),
  external: z.boolean().default(false),
  align: z.enum(['leading', 'trailing']).default('leading'),

  children: sectionSchema.array().default([]),
});

const groupConfigSchema = z
  .object({
    style: z.enum(['navbar', 'dropdown']).default('navbar'),
    groups: groupSchema.array(),
  })
  .strict();

const singleGroupConfigSchema = z
  .object({
    children: sectionSchema.array().default([]),
  })
  .strict();

const docsConfigSchema = z.object({
  group: z.union([groupConfigSchema, singleGroupConfigSchema]),
  iconLoader: iconLoaderSchema.optional(),
});

export type DocsConfig = z.infer<typeof docsConfigSchema>;

export const defineConfig = (config: z.input<typeof docsConfigSchema>) => {
  return docsConfigSchema.parse(config);
};
