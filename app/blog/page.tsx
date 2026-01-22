/**
 * Blog Listing Page
 */

import Link from 'next/link'
import { getAllPosts } from '@/lib/content/posts'
import PostItem from '@/components/PostItem'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Roy Li's Blog",
  description: 'Articles and thoughts on software development, design, and more.',
}

export const revalidate = 86400

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <div className="mx-auto max-w-3xl container px-6">
      <h1 className="heading-text mb-8 text-4xl font-bold font-title">Blog</h1>

      <div className="space-y-5">
        {posts.map((post) => (
          <div key={post.id}>
            <Link href={`/blog/${post.publishYear}/${post.slug}`}>
              <PostItem post={post} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
