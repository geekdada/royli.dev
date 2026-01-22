# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog built with Next.js 16 (App Router) and local MDX content files. Content was migrated from Notion CMS and is now stored as MDX files in the `content/` directory.

## Development Commands

```bash
pnpm dev          # Development server (http://localhost:3000)
pnpm build        # Production build
pnpm lint         # ESLint
pnpm test:types   # TypeScript type checking
```

## Architecture

### Content Structure

```
content/
├── blog/
│   └── {year}/
│       └── {slug}/
│           ├── page.mdx      # MDX content with JS metadata export
│           └── resources/    # Images and assets
├── pages/
│   └── {slug}/
│       └── page.mdx
└── tags/
    └── index.json            # Tag definitions with post counts
```

### MDX Frontmatter Format

MDX files use JS exports instead of YAML frontmatter:

```tsx
export const metadata = {
  id: 'uuid',
  title: 'Post Title',
  slug: 'post-slug',
  publishDate: '2024-01-01T00:00:00.000Z',
  publishYear: 2024,
  // ... other fields
}
```

Schemas are defined in `lib/mdx/frontmatter.ts` using Zod.

### Core Layers

- **Content Layer** (`lib/content/`): Loads MDX files via dynamic imports, validates frontmatter with Zod
- **MDX Processing** (`lib/mdx/`): Frontmatter schemas and parsing utilities
- **App Routes** (`app/`): Next.js App Router pages with ISR (24-hour revalidation)
- **Components** (`components/mdx/`): Custom MDX components (Callout, Details, Video, Embed, LinkPreview)

### Custom MDX Components

Available in MDX files via `mdx-components.tsx`:
- `<Callout icon="💡">` - Styled callout boxes
- `<Details summary="">` - Collapsible sections
- `<Video src="">` - YouTube/Vimeo embeds
- `<MDXImage src="">` - Image handling with relative path support

### Route Structure

- `/blog` - Blog listing with pagination
- `/blog/{year}/{slug}` - Individual blog posts
- `/blog/tags/{tagId}` - Posts filtered by tag
- `/page/{slug}` - Static pages

## Technology Notes

- **Styling**: Tailwind CSS v4 (syntax differs from v3)
- **Validation**: Zod
- **MDX**: @next/mdx with remark-gfm, rehype-slug, rehype-highlight
- **Package Manager**: pnpm (required)
- **Locale**: `zh-Hans` (Chinese)

## Path Aliases

`@/*` maps to project root (configured in `tsconfig.json`)
