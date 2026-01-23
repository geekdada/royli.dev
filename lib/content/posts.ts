/**
 * Content Loading Utilities for Blog Posts
 */

import { readdir } from 'fs/promises'
import { join } from 'path'
import type { ComponentType } from 'react'
import { PostFrontmatterSchema, type PostFrontmatter } from '@/lib/mdx/frontmatter'

export type Post = PostFrontmatter & { slug: string; publishYear: string }

export interface PostWithContent extends Post {
  Content: ComponentType
}

const CONTENT_DIR = join(process.cwd(), 'content')
const POSTS_PER_PAGE = 10

function resolveCoverImage(coverImage: string | undefined, year: string, slug: string): string | undefined {
  if (coverImage?.startsWith('./resources/')) {
    return `/blog/${year}/${slug}/${coverImage.slice(2)}`
  }
  return coverImage
}

export async function getAllPosts(): Promise<Post[]> {
  const blogDir = join(CONTENT_DIR, 'blog')
  const years = await readdir(blogDir)
  const posts: Post[] = []

  for (const year of years) {
    const yearDir = join(blogDir, year)

    try {
      const slugDirs = await readdir(yearDir)

      for (const slug of slugDirs) {
        try {
          const mdxModule = await import(`@/content/blog/${year}/${slug}/page.mdx`)
          const validated = PostFrontmatterSchema.parse(mdxModule.metadata)
          const derivedYear = new Date(validated.publishDate).getUTCFullYear().toString()
          if (derivedYear !== year) {
            throw new Error(
              `Year mismatch in /blog/${year}/${slug}: publishDate year is ${derivedYear}`
            )
          }
          posts.push({
            ...validated,
            slug,
            publishYear: derivedYear,
            coverImage: resolveCoverImage(validated.coverImage, year, slug),
          })
        } catch {
          continue
        }
      }
    } catch {
      continue
    }
  }

  return posts.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
}

export async function getPostBySlug(slug: string, year: string): Promise<PostWithContent | null> {
  try {
    const mdxModule = await import(`@/content/blog/${year}/${slug}/page.mdx`)
    const validated = PostFrontmatterSchema.parse(mdxModule.metadata)
    const derivedYear = new Date(validated.publishDate).getUTCFullYear().toString()
    if (derivedYear !== year) {
      throw new Error(
        `Year mismatch in /blog/${year}/${slug}: publishDate year is ${derivedYear}`
      )
    }

    return {
      ...validated,
      slug,
      publishYear: derivedYear,
      coverImage: resolveCoverImage(validated.coverImage, year, slug),
      Content: mdxModule.default,
    }
  } catch {
    return null
  }
}

export async function getFeaturedPosts(): Promise<Post[]> {
  const posts = await getAllPosts()
  return posts.filter((p) => p.isFeatured)
}

export async function getPostsByTag(tagSlug: string): Promise<Post[]> {
  const posts = await getAllPosts()
  return posts.filter((p) => p.tags?.some((t) => t.slug === tagSlug))
}

export async function getYears(): Promise<string[]> {
  const blogDir = join(CONTENT_DIR, 'blog')
  const years = await readdir(blogDir)
  return years.sort((a, b) => b.localeCompare(a))
}

export async function getPostsByYear(year: string): Promise<Post[]> {
  const posts = await getAllPosts()
  return posts.filter((p) => p.publishYear === year)
}

export async function getTotalPostCount(): Promise<number> {
  const posts = await getAllPosts()
  return posts.length
}

export interface PaginatedPosts {
  posts: Post[]
  currentPage: number
  totalPages: number
}

export async function getPaginatedPosts(page: number): Promise<PaginatedPosts> {
  const posts = await getAllPosts()
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const start = (page - 1) * POSTS_PER_PAGE

  return {
    posts: posts.slice(start, start + POSTS_PER_PAGE),
    currentPage: page,
    totalPages,
  }
}
