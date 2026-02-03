import type { ReactNode } from 'react';
import z from 'zod';

const reactNodeSchema = z.custom<ReactNode>();

const iconLoaderSchema = z.function({
  input: [z.string()],
  output: reactNodeSchema,
});

const stringOrElementSchema = z.union([z.string(), reactNodeSchema]);
export type StringOrElement = z.input<typeof stringOrElementSchema>;

const sectionSchema = z.object({
  title: z.string(),
  icon: stringOrElementSchema.optional(),
  base: z.string().optional(),
  get children() {
    return pageSchema.array();
  },
});

const pageSchema = z.union([z.string(), sectionSchema]);
export type Page = z.infer<typeof pageSchema>;

const groupSchema = z.object({
  title: z.string(),
  icon: stringOrElementSchema.optional(),
  link: z.string(),
  external: z.boolean().default(false),
  align: z.enum(['leading', 'trailing']).default('leading'),

  children: pageSchema.array().default([]),
});
export type Group = z.infer<typeof groupSchema>;

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

const navigationConfigSchema = z.object({
  group: z.union([groupConfigSchema, singleGroupConfigSchema]),
});

const localesConfigSchema = z.record(
  z.string(),
  z.object({
    label: z.string(),
    get config() {
      return docsConfigSchema.omit({ i18n: true }).partial().optional();
    },
  }),
);

const i18nConfigSchema = z.object({
  locales: localesConfigSchema,
  defaultLocale: z.string(),
});

const pageActionConfigSchema = z.object({
  enabled: z.boolean().default(true),
  actions: z
    .enum(['copy', 'view', 'chatgpt', 'claude', 'perplexity', 'grok'])
    .array()
    .default(['copy', 'view', 'chatgpt', 'claude']),
});

export const docsConfigSchema = z.object({
  title: stringOrElementSchema.default('My App'),
  navigation: navigationConfigSchema,
  pageAction: pageActionConfigSchema.prefault({}),
  iconLoader: iconLoaderSchema.optional(),

  i18n: i18nConfigSchema.optional(),
});

export type DocsConfig = z.infer<typeof docsConfigSchema>;

export const defineConfig = (config: z.input<typeof docsConfigSchema>) => {
  return docsConfigSchema.parse(config);
};
