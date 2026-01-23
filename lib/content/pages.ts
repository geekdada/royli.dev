/**
 * Content Loading Utilities for Static Pages
 */

import { readdir } from 'fs/promises'
import { join } from 'path'
import type { ComponentType } from 'react'
import { PageFrontmatterSchema, type PageFrontmatter } from '@/lib/mdx/frontmatter'

export type Page = PageFrontmatter & { slug: string }

export interface PageWithContent extends Page {
  Content: ComponentType
}

const CONTENT_DIR = join(process.cwd(), 'content')

export async function getAllPages(): Promise<Page[]> {
  const pagesDir = join(CONTENT_DIR, 'pages')
  const pages: Page[] = []

  try {
    const slugDirs = await readdir(pagesDir)

    for (const slug of slugDirs) {
      try {
        const mdxModule = await import(`@/content/pages/${slug}/page.mdx`)
        const validated = PageFrontmatterSchema.parse(mdxModule.metadata)
        pages.push({ ...validated, slug })
      } catch {
        continue
      }
    }
  } catch {
    return []
  }

  return pages
}

export async function getPageBySlug(slug: string): Promise<PageWithContent | null> {
  try {
    const mdxModule = await import(`@/content/pages/${slug}/page.mdx`)
    const validated = PageFrontmatterSchema.parse(mdxModule.metadata)

    return {
      ...validated,
      slug,
      Content: mdxModule.default,
    }
  } catch {
    return null
  }
}
