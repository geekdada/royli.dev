'use client'

/**
 * MDX Components for rendering custom elements
 */

import { useState, useEffect, useRef } from 'react'
import type { LinkMetadata } from '@/app/api/link-metadata/route'

export function Callout({
  icon = '💡',
  children,
}: {
  icon?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-3 p-4 my-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg">
      <span className="text-xl shrink-0">{icon}</span>
      <div className="flex-1">{children}</div>
    </div>
  )
}

export function Details({
  summary,
  children,
}: {
  summary: string
  children: React.ReactNode
}) {
  return (
    <details className="my-4 border border-gray-200 dark:border-gray-700 rounded-lg [&_summary]:cursor-pointer">
      <summary className="px-4 py-2 bg-gray-50 dark:bg-gray-800 font-medium rounded-t-lg">
        {summary}
      </summary>
      <div className="px-4 py-2">{children}</div>
    </details>
  )
}

function extractYouTubeId(url: string): string | null {
  const regex =
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

export function Video({ src }: { src: string }) {
  // Handle YouTube, Vimeo, etc.
  if (src.includes('youtube.com') || src.includes('youtu.be')) {
    const videoId = extractYouTubeId(src)
    if (!videoId) return null

    return (
      <iframe
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full aspect-video rounded-lg my-4"
      />
    )
  }

  if (src.includes('vimeo.com')) {
    const videoId = src.split('/').pop()
    return (
      <iframe
        src={`https://player.vimeo.com/video/${videoId}`}
        className="w-full aspect-video rounded-lg my-4"
        allowFullScreen
      />
    )
  }

  return <video src={src} controls className="w-full rounded-lg my-4" />
}

function extractTweetId(url: string): string | null {
  // Match twitter.com/user/status/123 or x.com/user/status/123
  const regex = /(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/
  const match = url.match(regex)
  return match ? match[1] : null
}

function TwitterEmbed({
  tweetId,
  caption,
}: {
  tweetId: string
  caption?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load Twitter widget script if not already loaded
    const loadTwitterScript = () => {
      return new Promise<void>((resolve) => {
        if ((window as unknown as { twttr?: TwitterWidgets }).twttr) {
          resolve()
          return
        }

        const script = document.createElement('script')
        script.src = 'https://platform.twitter.com/widgets.js'
        script.async = true
        script.onload = () => resolve()
        document.body.appendChild(script)
      })
    }

    const renderTweet = async () => {
      await loadTwitterScript()

      const twttr = (window as unknown as { twttr?: TwitterWidgets }).twttr
      if (twttr && containerRef.current) {
        // Clear container before rendering
        containerRef.current.innerHTML = ''

        await twttr.widgets.createTweet(tweetId, containerRef.current, {
          theme: document.documentElement.classList.contains('dark')
            ? 'dark'
            : 'light',
          dnt: true,
        })
        setIsLoading(false)
      }
    }

    renderTweet()
  }, [tweetId])

  return (
    <figure className="my-4">
      {isLoading && (
        <div className="flex items-center justify-center p-8 border border-gray-200 dark:border-gray-700 rounded-lg">
          <span className="text-gray-500 dark:text-gray-400">
            Loading tweet...
          </span>
        </div>
      )}
      <div ref={containerRef} className="flex justify-center" />
      {caption && (
        <figcaption className="text-center text-sm text-gray-500 mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

interface TwitterWidgets {
  widgets: {
    createTweet: (
      tweetId: string,
      container: HTMLElement,
      options?: { theme?: 'light' | 'dark'; dnt?: boolean }
    ) => Promise<HTMLElement>
  }
}

export function Embed({ url, caption }: { url: string; caption?: string }) {
  // Handle Twitter/X embeds
  if (url.includes('twitter.com') || url.includes('x.com')) {
    const tweetId = extractTweetId(url)
    if (tweetId) {
      return <TwitterEmbed tweetId={tweetId} caption={caption} />
    }
  }

  return (
    <figure className="my-4">
      <iframe
        src={url}
        className="w-full aspect-video rounded-lg border border-gray-200 dark:border-gray-700"
        allowFullScreen
      />
      {caption && (
        <figcaption className="text-center text-sm text-gray-500 mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

export function LinkPreview({ url }: { url: string }) {
  const [metadata, setMetadata] = useState<LinkMetadata | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(
          `/api/link-metadata?url=${encodeURIComponent(url)}`
        )
        if (!response.ok) throw new Error('Failed to fetch')
        const data = await response.json()
        setMetadata(data)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchMetadata()
  }, [url])

  // Fallback UI while loading or on error
  if (loading || error || !metadata) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block my-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        {loading ? (
          <span className="text-gray-500 dark:text-gray-400">
            Loading preview...
          </span>
        ) : (
          <span className="text-blue-600 dark:text-blue-400 underline break-all">
            {url}
          </span>
        )}
      </a>
    )
  }

  const hostname = new URL(url).hostname

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="not-prose grid grid-cols-10 my-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
    >
      {/* Text content */}
      <div
        className={`p-4 min-w-0 ${metadata.image ? 'col-span-6' : 'col-span-10'}`}
      >
        {metadata.title && (
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-1 text-sm lg:text-base leading-snug">
            {metadata.title}
          </h4>
        )}
        {metadata.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
            {metadata.description}
          </p>
        )}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
          {metadata.favicon && (
            <img
              src={metadata.favicon}
              alt=""
              className="w-4 h-4"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          )}
          <span className="truncate">{metadata.siteName || hostname}</span>
        </div>
      </div>

      {/* Image */}
      {metadata.image && (
        <div className="col-span-4 bg-gray-100 dark:bg-gray-800">
          <img
            src={metadata.image}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.parentElement!.style.display = 'none'
            }}
          />
        </div>
      )}
    </a>
  )
}

export { default as TableOfContents } from './TableOfContents'
