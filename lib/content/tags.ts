/**
 * Content Loading Utilities for Tags
 */

import { readFile } from 'fs/promises'
import { join } from 'path'
import { TagIndexSchema, type TagIndex } from '@/lib/mdx/frontmatter'

const CONTENT_DIR = join(process.cwd(), 'content')

export interface Tag {
  id: string
  name: string
  slug: string
  description?: string
  postCount: number
}

export async function getAllTags(): Promise<Tag[]> {
  try {
    const content = await readFile(join(CONTENT_DIR, 'tags', 'index.json'), 'utf-8')
    const data = JSON.parse(content)
    const validated = TagIndexSchema.parse(data)

    return validated.tags
  } catch {
    return []
  }
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  const tags = await getAllTags()
  return tags.find((t) => t.slug === slug) || null
}
