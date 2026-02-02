/**
 * Gallery Utilities - Extract images from MDX content
 */

import { join } from 'path'
import { readFile } from 'fs/promises'
import { PostFrontmatterSchema } from '@/lib/mdx/frontmatter'

const CONTENT_DIR = join(process.cwd(), 'content')

/**
 * Extract image sources from MDX content
 * Parses <MDXImage src="..."> components
 */
export function extractGalleryImages(content: string): string[] {
  const regex = /<MDXImage\s+src="([^"]+)"/g
  const images: string[] = []
  let match

  while ((match = regex.exec(content)) !== null) {
    images.push(match[1])
  }

  return images
}

/**
 * Load and extract gallery images from a blog post MDX file
 */
export async function getGalleryImages(year: string, slug: string): Promise<string[]> {
  const mdxPath = join(CONTENT_DIR, 'blog', year, slug, 'page.mdx')

  try {
    const mdxModule = await import(`@/content/blog/${year}/${slug}/page.mdx`)
    const validated = PostFrontmatterSchema.parse(mdxModule.metadata)

    if (validated.galleryImages.length > 0) {
      return validated.galleryImages.map((src) => resolveGalleryImagePath(src, year, slug))
    }

    const content = await readFile(mdxPath, 'utf-8')
    return extractGalleryImages(content).map((src) => resolveGalleryImagePath(src, year, slug))
  } catch {
    return []
  }
}

/**
 * Resolve relative image path to absolute URL path
 */
export function resolveGalleryImagePath(src: string, year: string, slug: string): string {
  if (src.startsWith('./resources/')) {
    return `/blog/${year}/${slug}/${src.slice(2)}`
  }
  return src
}
