import { z } from 'zod/v4'

const TagSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
})

export const PostFrontmatterSchema = z.object({
  title: z.string(),
  excerpt: z.string().optional(),
  publishDate: z.string().datetime(),
  lastEditDate: z.string().datetime().optional(),
  isFeatured: z.boolean().default(false),
  isGalleryView: z.boolean().default(false),
  galleryImages: z.array(z.string()).default([]),
  coverImage: z.string().optional(),
  coverIcon: z.string().optional(),
  tags: z.array(TagSchema).optional(),
})

export const PageFrontmatterSchema = z.object({
  title: z.string(),
  publishDate: z.string().datetime(),
  lastEditDate: z.string().datetime().optional(),
  coverImage: z.string().optional(),
})

export const TagIndexSchema = z.object({
  tags: z.array(
    z.object({
      id: z.uuid(),
      name: z.string(),
      slug: z.string(),
      description: z.string().optional(),
      postCount: z.number().int().nonnegative(),
    })
  ),
})

export type PostFrontmatter = z.infer<typeof PostFrontmatterSchema>
export type PageFrontmatter = z.infer<typeof PageFrontmatterSchema>
export type TagIndex = z.infer<typeof TagIndexSchema>
export type Tag = z.infer<typeof TagSchema>
