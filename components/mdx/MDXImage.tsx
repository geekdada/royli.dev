'use client'

/**
 * MDXImage component - Next.js Image wrapper for MDX content
 */

import Image from 'next/image'
import { usePathname } from 'next/navigation'

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
  const resolvedSrc = isAbsoluteUrl ? src : resolveResourcePath(src, pathname ?? '')

  // Only use Next.js Image for absolute URLs that can be optimized
  // Local resources need regular img tags
  if (!isAbsoluteUrl) {
    return (
      <figure className="my-4">
        <img src={resolvedSrc} alt={alt || ''} className="rounded-lg w-full h-auto" />
        {alt && (
          <figcaption className="text-center text-sm text-gray-500 mt-2">{alt}</figcaption>
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
        <figcaption className="text-center text-sm text-gray-500 mt-2">{alt}</figcaption>
      )}
    </figure>
  )
}
