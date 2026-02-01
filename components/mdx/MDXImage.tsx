'use client'

/**
 * MDXImage component - Next.js Image wrapper for MDX content
 */

import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Fragment, type ReactNode } from 'react'

function parseMarkdownLinks(text: string): ReactNode {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  const parts: ReactNode[] = []
  let lastIndex = 0
  let match

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    parts.push(
      <a
        key={match.index}
        href={match[2]}
        className="underline hover:text-gray-700"
        target="_blank"
        rel="noopener noreferrer"
      >
        {match[1]}
      </a>
    )
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length > 0
    ? parts.map((part, i) => <Fragment key={i}>{part}</Fragment>)
    : text
}

function resolveResourcePath(src: string, pathname: string): string {
  if (src.startsWith('./resources/')) {
    return `${pathname}/${src.slice(2)}`
  }
  return src
}

export function MDXImage({ src, alt }: { src: string; alt?: string }) {
  const pathname = usePathname()
  const isAbsoluteUrl = src.startsWith('http://') || src.startsWith('https://')

  // Resolve relative resource paths to absolute paths
  const resolvedSrc = isAbsoluteUrl
    ? src
    : resolveResourcePath(src, pathname ?? '')

  // Only use Next.js Image for absolute URLs that can be optimized
  // Local resources need regular img tags
  if (!isAbsoluteUrl) {
    return (
      <figure className="my-4">
        <img
          src={resolvedSrc}
          alt={alt || ''}
          className="rounded-lg w-full h-auto"
        />
        {alt && (
          <figcaption className="text-center text-sm text-gray-500 mt-2">
            {parseMarkdownLinks(alt)}
          </figcaption>
        )}
      </figure>
    )
  }

  return (
    <figure className="my-4">
      <Image
        src={src}
        alt={alt || ''}
        width={800}
        height={450}
        className="rounded-lg w-full h-auto"
        unoptimized
      />
      {alt && (
        <figcaption className="text-center text-sm text-gray-500 mt-2">
          {parseMarkdownLinks(alt)}
        </figcaption>
      )}
    </figure>
  )
}
