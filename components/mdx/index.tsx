'use client'

/**
 * MDX Components for rendering custom elements
 */

import { useState, useEffect, useMemo } from 'react'
import type { LinkMetadata } from '@/app/api/link-metadata/route'

function decodeHtmlEntities(text: string): string {
  if (typeof document === 'undefined') return text
  const textarea = document.createElement('textarea')
  textarea.innerHTML = text
  return textarea.value
}

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

export { Embed } from './Embed'

export function LinkPreview({ url }: { url: string }) {
  const [metadata, setMetadata] = useState<LinkMetadata | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const title = useMemo(
    () => (metadata?.title ? decodeHtmlEntities(metadata.title) : ''),
    [metadata?.title]
  )
  const description = useMemo(
    () =>
      metadata?.description ? decodeHtmlEntities(metadata.description) : '',
    [metadata?.description]
  )

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
      className="not-prose relative grid grid-cols-10 my-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50/50 hover:bg-gray-100/80 dark:bg-gray-800/30 dark:hover:bg-gray-800/60 transition-colors"
    >
      <div
        className="pointer-events-none absolute inset-0 z-10"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(168,85,247,0.03) 40%, transparent 70%)',
        }}
      />
      <div
        className={`p-4 min-w-0 flex flex-col justify-between ${metadata.image ? 'col-span-5' : 'col-span-10'}`}
      >
        <div>
          {title && (
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-1 text-sm lg:text-base leading-snug">
              {title}
            </h4>
          )}
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
              {description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 mt-2">
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
        <div className="col-span-5 bg-gray-100 dark:bg-gray-800">
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
