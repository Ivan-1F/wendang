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
- `packages/wendang/` - Shared utility package (Bun module)

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

### Configuration Files

- `apps/docs/content.config.ts` - MDX processing, Shiki highlighting, remark/rehype plugins
- `turbo.json` - Turborepo task pipelines
- `biome.json` - Linter/formatter config (2-space indent, single quotes)

### DocsConfig Schema (`lib/schema.ts`)

Navigation uses a hierarchical structure:
- **Group**: Top-level nav items with optional dropdowns
- **Section**: Sub-sections within groups
- **Page**: Individual MDX pages (referenced by file path)
