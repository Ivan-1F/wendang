# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Wendang** - a documentation site template/framework. It uses Bun as the package manager and provides a modern MDX-based documentation system with internationalization support.

**Important**: This is a docs TEMPLATE, not a real docs site.

## Commands

```bash
bun run dev           # Start dev server (localhost:3000)
bun run build         # Production build (runs build:search first)
bun run build:search  # Generate Orama search index to public/search-index.json
bun run lint          # Run linter (ESLint)
bun test              # Run tests using Bun's built-in test runner
bun test lib/slug.test.ts  # Run a single test file
```

## Architecture

### Key Technologies
- **Next.js 16** with App Router
- **MDX** via `fuma-content` for content processing
- **Shiki** for code syntax highlighting
- **Orama** for client-side full-text search
- **next-intl** for internationalization (cn/en/jp locales)
- **Tailwind CSS** + **shadcn/ui** components

### Routing

- `/[locale]/` - Homepage
- `/[locale]/docs/[[...slug]]` - Documentation pages (catch-all route)

The `lib/slug.ts` module handles path-to-slug conversion and page lookup. Key behaviors:
- **Route groups**: Parenthesized folders like `(core)` are stripped from slugs
- **Index pages**: `index.mdx` maps to the parent directory slug
- `matchSection()` recursively finds the deepest matching navigation section
- `flattenPages()` converts hierarchical nav to a flat list for prev/next navigation

### Key Configuration Files

- `docs.config.tsx` - **Site configuration entry point**: defines title, navigation structure (groups/sections/pages), and icon loader. This re-exports from a product-specific config file
- `content.config.ts` - MDX processing, Shiki highlighting, remark/rehype plugins. Content is sourced from `content/docs-1/`
- `lib/schema.ts` - Zod schemas for DocsConfig validation
- `lib/config.ts` - Runtime config resolution with i18n locale merging (uses `ts-deepmerge`)
- `biome.json` - Linter/formatter config (2-space indent, single quotes)

### DocsConfig Schema (`lib/schema.ts`)

Navigation uses a hierarchical structure:
- **Group**: Top-level nav items with `title`, `icon`, `link`, and optional `children`
- **Section**: Sub-sections within groups, with `title`, `icon`, optional `base` path, and `children`
- **Page**: Individual MDX pages (string path or section object)

Example in `docs.config.tsx`:
```tsx
groups: [
  {
    title: 'Guides',
    link: '/docs/guides',
    children: [
      { title: 'Getting Started', children: ['.', 'quick-start'] },  // '.' = index page
    ],
  },
]
```

### Context Providers and State

The app uses React Context for state management (no external state library):
- `DocsConfigProvider` / `useDocsConfig()` - Global docs config access
- `SearchModalProvider` / `useSearchModal()` - Search modal open/close state
- `ThemeProvider` (next-themes) - Dark/light theme

### Search System

Uses **Orama** for client-side full-text search:
- `scripts/generate-search-index.ts` builds the index at build time (`bun run build:search`)
- Index is written to `public/search-index.json` with page titles, sections, content, and locale
- Search is locale-aware: prioritizes current locale results, falls back to all
- MDX content is cleaned (imports, code blocks, JSX removed) before indexing
- Activated via `Cmd+K` keyboard shortcut

### MDX Code Block Enhancements

Code blocks support meta attributes parsed by `metaTransformer` in `content.config.ts`:
- `title="filename.ts"` - Displays a title bar above the code block
- `icon="react"` - Shows an icon next to the title
- `lineNumbers` - Enables line numbers
- Shiki transformers: `transformerNotationDiff` (diff highlighting), `transformerNotationHighlight` (line highlighting)

### AI / LLM Integration

- **AI Actions component** (`ai-actions.tsx`): Per-page dropdown offering "Open in ChatGPT/Claude/Perplexity/Grok", markdown view, and copy. Configured via `enabledActions` in docs config.
- **LLM route** (`/[locale]/llms.mdx/docs/[[...slug]]`): Serves raw markdown for each doc page, force-statically generated for all locale/page combinations.

## Routing / Rewrites / i18n Summary

### Routes
- Docs page route: `app/[locale]/docs/[[...slug]]/page.tsx`
- LLM raw Markdown route: `app/[locale]/llms.mdx/docs/[[...slug]]/route.ts`
  - Uses `getPage(slug, locale)` and `getMarkdown(page)` and returns `text/markdown`

### Rewrites (Next.js)
Config location: `next.config.mjs`

- Rewrites `.mdx` direct hits or `Accept`/`User-Agent`-matched requests to the LLM route:
  - `/:locale/docs/:path*.mdx` → `/:locale/llms.mdx/docs/:path*`
  - `/:locale/docs/:path*` + `Accept: text/markdown` → `/:locale/llms.mdx/docs/:path*`
  - `/:locale/docs/:path*` + AI-related UA → `/:locale/llms.mdx/docs/:path*`

### i18n Middleware
Config location: `proxy.ts`

- Uses `next-intl` `createMiddleware` for locale detection
- Matcher excludes internal/API paths and a static-extension blacklist:
  - `matcher: '/((?!api|trpc|_next|_vercel)(?!.*\\.(?:avif|bmp|css|gif|html|ico|jpe?g|js|json|map|mp4|pdf|png|svg|txt|webmanifest|webp|woff2?|xml|zip)$).*)'`
  - This keeps routes like `/changelog/v1.0.0-beta.4` in middleware, while skipping common static files

### i18n Config Resolution
- `i18n/routing.ts` dynamically generates routing config from `docsConfig.i18n.locales`
- `lib/config.ts` deep-merges locale-specific overrides onto the base config at runtime
- Translation namespaces: `on_this_page`, `page_navigation`, `page_actions`

### Request Flow (Simplified)
1. Request passes `proxy.ts` (`next-intl` middleware) for locale resolution
2. `next.config.mjs` rewrites route qualifying docs requests to `llms.mdx`
3. `llms.mdx` route returns raw Markdown (`text/markdown`)
