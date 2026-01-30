/**
 * Paginated Blog Listing Page
 */

import { redirect, notFound } from 'next/navigation'
import { getPaginatedPosts, getTotalPostCount } from '@/lib/content/posts'
import { BlogPostList } from '@/components/BlogPostList'
import type { Metadata } from 'next'

const POSTS_PER_PAGE = 10

interface PageProps {
  params: Promise<{ page: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { page } = await params
  return {
    title: `Roy Li's Blog - Page ${page}`,
    description:
      'Articles and thoughts on software development, design, and more.',
  }
}

export const revalidate = 86400

export async function generateStaticParams() {
  const totalPosts = await getTotalPostCount()
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE)

  // Generate params for pages 2 and above (page 1 is handled by /blog)
  return Array.from({ length: totalPages - 1 }, (_, i) => ({
    page: String(i + 2),
  }))
}

export default async function PaginatedBlogPage({ params }: PageProps) {
  const { page: pageParam } = await params
  const page = parseInt(pageParam, 10)

  // Redirect page 1 to /blog
  if (page === 1) {
    redirect('/blog')
  }

  // Handle invalid page numbers
  if (isNaN(page) || page < 1) {
    notFound()
  }

  const { posts, currentPage, totalPages } = await getPaginatedPosts(page)

  // Handle page out of range
  if (page > totalPages) {
    notFound()
  }

  return (
    <BlogPostList
      posts={posts}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  )
}
