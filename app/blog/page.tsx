/**
 * Blog Listing Page
 */

import Link from 'next/link'
import { getPaginatedPosts } from '@/lib/content/posts'
import PostItem from '@/components/PostItem'
import { Pagination } from '@/components/Pagination'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Roy Li's Blog",
  description: 'Articles and thoughts on software development, design, and more.',
}

export const revalidate = 86400

export default async function BlogPage() {
  const { posts, currentPage, totalPages } = await getPaginatedPosts(1)

  return (
    <div className="mx-auto max-w-3xl container px-6">
      <h1 className="heading-text mb-8 text-4xl font-bold font-title">Blog</h1>

      <div className="flex flex-col gap-2">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.publishYear}/${post.slug}`}>
            <PostItem post={post} isGalleryView={post.isGallaryView} />
          </Link>
        ))}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/blog" />
    </div>
  )
}
