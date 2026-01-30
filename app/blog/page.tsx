/**
 * Blog Listing Page
 */

import { getPaginatedPosts } from '@/lib/content/posts'
import { BlogPostList } from '@/components/BlogPostList'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Roy Li's Blog",
  description:
    'Articles and thoughts on software development, design, and more.',
}

export const revalidate = 86400

export default async function BlogPage() {
  const { posts, currentPage, totalPages } = await getPaginatedPosts(1)

  return (
    <BlogPostList
      posts={posts}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  )
}
