import Link from 'next/link'
import PostItem from '@/components/PostItem'
import { Pagination } from '@/components/Pagination'
import type { Post } from '@/lib/content/posts'

interface BlogPostListProps {
  posts: Post[]
  currentPage: number
  totalPages: number
}

export function BlogPostList({
  posts,
  currentPage,
  totalPages,
}: BlogPostListProps) {
  return (
    <div className="mx-auto max-w-3xl container px-6">
      <h1 className="heading-text mb-8 text-4xl font-bold font-title">Blog</h1>

      <div className="flex flex-col gap-2 lg:gap-4">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.publishYear}/${post.slug}`}>
            <PostItem post={post} isGalleryView={post.isGalleryView} />
          </Link>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/blog"
      />
    </div>
  )
}
