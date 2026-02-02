# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Wendang** - a documentation site template/framework built as a Turborepo monorepo. It uses Bun as the package manager and provides a modern MDX-based documentation system with internationalization support.

**Important**: This is a docs TEMPLATE, not a real docs site.

## Commands

```bash
# Development (from root)
bun run dev       # Start dev server (localhost:3000)
bun run build     # Build all workspaces
bun run lint      # Run linter (Biome)

# From apps/docs specifically
bun run dev       # Next.js dev server
bun run build     # Next.js production build
```

## Architecture

### Monorepo Structure
- `apps/docs/` - Main Next.js 16 documentation app
- `packages/wendang/` - Shared utility package (Bun module, see its own CLAUDE.md for Bun-specific guidance)

### Key Technologies
- **Next.js 16** with App Router
- **MDX** via `fuma-content` for content processing
- **Shiki** for code syntax highlighting
- **next-intl** for internationalization (cn/en/jp locales)
- **Tailwind CSS** + **shadcn/ui** components
- **Turborepo** for build orchestration

### Routing

- `/[locale]/` - Homepage
- `/[locale]/docs/[[...slug]]` - Documentation pages (catch-all route)

The `lib/slug.ts` module handles path-to-slug conversion and page lookup.

### Key Configuration Files

- `apps/docs/docs.config.tsx` - **Site configuration entry point**: defines title, navigation structure (groups/sections/pages), and icon loader. This re-exports from a product-specific config file
- `apps/docs/content.config.ts` - MDX processing, Shiki highlighting, remark/rehype plugins. Content is sourced from `content/docs-1/`
- `apps/docs/lib/schema.ts` - Zod schemas for DocsConfig validation
- `apps/docs/lib/config.ts` - Runtime config resolution with i18n locale merging
- `turbo.json` - Turborepo task pipelines
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
