/**
 * Gallery Utilities - Extract images from MDX content
 */

import { readFile } from 'fs/promises'
import { join } from 'path'

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
    const content = await readFile(mdxPath, 'utf-8')
    return extractGalleryImages(content)
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
