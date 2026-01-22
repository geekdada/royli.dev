'use client'

import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { FiArrowUpRight } from 'react-icons/fi'

import type { Post } from '@/lib/content/posts'

dayjs.extend(localizedFormat)

interface PostItemProps {
  post: Post
  isGalleryView?: boolean
}

const PostItem = ({ post, isGalleryView = false }: PostItemProps) => {
  const formattedDate = dayjs(post.publishDate).format('MMM D, YYYY')

  if (isGalleryView) {
    return (
      <div className="group overflow-hidden rounded-xl border border-gray-200/60 bg-white/50 transition-all duration-200 hover:border-gray-300 hover:bg-white dark:border-white/10 dark:bg-white/2 dark:hover:border-white/20 dark:hover:bg-white/4">
        {post.coverImage && (
          <div
            className="aspect-video w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${post.coverImage})` }}
          />
        )}
        <div className="px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="flex items-center gap-1.5 text-base font-medium text-gray-900 dark:text-gray-100">
              {post.coverIcon && (
                <span className="shrink-0">{post.coverIcon}</span>
              )}
              <span className="group-hover:text-gray-700 dark:group-hover:text-white">
                {post.title}
              </span>
              <FiArrowUpRight className="h-3.5 w-3.5 shrink-0 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100" />
            </h2>
            <time
              dateTime={post.publishDate}
              className="shrink-0 font-mono text-xs text-gray-400 dark:text-gray-500"
            >
              {formattedDate}
            </time>
          </div>
          {post.excerpt && (
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              {post.excerpt}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="group rounded-lg border border-gray-200/60 bg-white/50 px-4 py-4 transition-all duration-200 hover:border-gray-300 hover:bg-white dark:border-white/10 dark:bg-white/2 dark:hover:border-white/20 dark:hover:bg-white/4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
        {post.coverImage && (
          <div
            className="aspect-video w-full shrink-0 rounded-md bg-cover bg-center sm:aspect-auto sm:h-32 sm:w-48"
            style={{ backgroundImage: `url(${post.coverImage})` }}
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <h2 className="flex min-w-0 items-center gap-1.5 text-[15px] font-medium text-gray-900 dark:text-gray-100">
              {post.coverIcon && (
                <span className="shrink-0">{post.coverIcon}</span>
              )}
              <span className="group-hover:text-gray-700 dark:group-hover:text-white">
                {post.title}
              </span>
              <FiArrowUpRight className="h-3.5 w-3.5 shrink-0 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100" />
            </h2>
            <time
              dateTime={post.publishDate}
              className="shrink-0 leading-6 font-mono text-xs text-gray-400 dark:text-gray-500 self-start"
            >
              {formattedDate}
            </time>
          </div>
          {post.excerpt && (
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              {post.excerpt}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default PostItem
