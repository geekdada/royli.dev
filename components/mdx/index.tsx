'use client'

/**
 * MDX Components for rendering custom elements
 */

import { useState, useEffect } from 'react'
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

export function Embed({ url, caption }: { url: string; caption?: string }) {
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
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-1">
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
