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

const translationsSchema = z.object({
  on_this_page: z.string().default('On this page'),
  page_navigation: z
    .object({
      next: z.string().default('Next'),
      previous: z.string().default('Previous'),
    })
    .prefault({}),
  page_actions: z
    .object({
      copy_markdown: z.string().default('Copy Markdown'),
      copy_page: z
        .object({
          title: z.string().default('Copy page'),
          description: z.string().default('Copy page as markdown for LLMs'),
        })
        .prefault({}),
      view_as_markdown: z
        .object({
          title: z.string().default('View as Markdown'),
          description: z.string().default('View this page as plain text'),
        })
        .prefault({}),
      open_in_chatgpt: z
        .object({
          title: z.string().default('Open in ChatGPT'),
          description: z.string().default('Ask questions about this page'),
        })
        .prefault({}),
      open_in_claude: z
        .object({
          title: z.string().default('Open in Claude'),
          description: z.string().default('Ask questions about this page'),
        })
        .prefault({}),
      open_in_perplexity: z
        .object({
          title: z.string().default('Open in Perplexity'),
          description: z.string().default('Ask questions about this page'),
        })
        .prefault({}),
      open_in_grok: z
        .object({
          title: z.string().default('Open in Grok'),
          description: z.string().default('Ask questions about this page'),
        })
        .prefault({}),
    })
    .prefault({}),
});

export type Translations = z.infer<typeof translationsSchema>;

const localesConfigSchema = z.record(
  z.string(),
  z.object({
    label: z.string(),
    translations: translationsSchema.prefault({}),
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
