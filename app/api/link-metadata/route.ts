import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

import { isProd, siteURL } from '@/lib/config'

export const runtime = 'edge'

const redis = Redis.fromEnv()
const CACHE_TTL = 604800 // 7 days in seconds

function getCacheKey(url: string): string {
  return `link-metadata:${url}`
}

function isAllowedOrigin(request: Request): boolean {
  const referer = request.headers.get('referer')
  const origin = request.headers.get('origin')

  const checkUrl = referer || origin
  if (!checkUrl) {
    return false
  }

  try {
    const requestOrigin = new URL(checkUrl).origin
    const allowedOrigin = new URL(siteURL).origin

    if (requestOrigin === allowedOrigin) {
      return true
    }

    // Allow localhost in development
    if (!isProd && requestOrigin.includes('localhost')) {
      return true
    }

    return false
  } catch {
    return false
  }
}

export interface LinkMetadata {
  url: string
  title?: string
  description?: string
  image?: string
  siteName?: string
  favicon?: string
}

function extractMetaContent(
  html: string,
  property: string
): string | undefined {
  // Try og: prefix first
  const ogPattern = new RegExp(
    `<meta[^>]+(?:property|name)=["'](?:og:)?${property}["'][^>]+content=["']([^"']+)["']`,
    'i'
  )
  const ogMatch = html.match(ogPattern)
  if (ogMatch) return ogMatch[1]

  // Try reverse order (content before property)
  const reversePattern = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:)?${property}["']`,
    'i'
  )
  const reverseMatch = html.match(reversePattern)
  if (reverseMatch) return reverseMatch[1]

  return undefined
}

function extractTitle(html: string): string | undefined {
  // Try og:title first
  const ogTitle = extractMetaContent(html, 'title')
  if (ogTitle) return ogTitle

  // Fall back to <title> tag
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  return titleMatch ? titleMatch[1].trim() : undefined
}

function extractFavicon(html: string, baseUrl: string): string | undefined {
  // Try to find favicon link
  const iconPatterns = [
    /<link[^>]+rel=["'](?:shortcut )?icon["'][^>]+\shref=["']([^"']+)["']/i,
    /<link[^>]+\shref=["']([^"']+)["'][^>]+rel=["'](?:shortcut )?icon["']/i,
    /<link[^>]+rel=["']apple-touch-icon["'][^>]+\shref=["']([^"']+)["']/i,
  ]

  for (const pattern of iconPatterns) {
    const match = html.match(pattern)
    if (match) {
      const iconUrl = match[1]
      // Convert relative URL to absolute
      if (iconUrl.startsWith('//')) {
        return `https:${iconUrl}`
      } else if (iconUrl.startsWith('/')) {
        const url = new URL(baseUrl)
        return `${url.origin}${iconUrl}`
      } else if (!iconUrl.startsWith('http')) {
        const url = new URL(baseUrl)
        return `${url.origin}/${iconUrl}`
      }
      return iconUrl
    }
  }

  // Default to /favicon.ico
  try {
    const url = new URL(baseUrl)
    return `${url.origin}/favicon.ico`
  } catch {
    return undefined
  }
}

function resolveUrl(
  src: string | undefined,
  baseUrl: string
): string | undefined {
  if (!src) return undefined

  if (src.startsWith('//')) {
    return `https:${src}`
  } else if (src.startsWith('/')) {
    const url = new URL(baseUrl)
    return `${url.origin}${src}`
  } else if (!src.startsWith('http')) {
    const url = new URL(baseUrl)
    return `${url.origin}/${src}`
  }
  return src
}

async function fetchLinkMetadata(url: string): Promise<LinkMetadata> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 5000)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`)
    }

    const html = await response.text()

    const metadata: LinkMetadata = {
      url,
      title: extractTitle(html),
      description:
        extractMetaContent(html, 'description') ||
        extractMetaContent(html, 'og:description'),
      image: resolveUrl(
        extractMetaContent(html, 'image') ||
          extractMetaContent(html, 'og:image'),
        url
      ),
      siteName: extractMetaContent(html, 'site_name'),
      favicon: extractFavicon(html, url),
    }

    return metadata
  } finally {
    clearTimeout(timeoutId)
  }
}

export async function GET(request: Request) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json(
      { error: 'Missing url parameter' },
      { status: 400 }
    )
  }

  // Validate URL
  try {
    new URL(url)
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
  }

  const cacheKey = getCacheKey(url)

  // Try to get cached metadata
  try {
    if (isProd) {
      const cached = await redis.get<LinkMetadata>(cacheKey)
      if (cached) {
        return NextResponse.json(cached, {
          headers: {
            'Cache-Control':
              'public, max-age=86400, stale-while-revalidate=604800',
            'X-Cache': 'HIT',
          },
        })
      }
    }
  } catch (err) {
    console.error('Redis get error:', err)
  }

  // Fetch metadata if not cached
  try {
    const metadata = await fetchLinkMetadata(url)

    // Store in cache (fire-and-forget, don't block response)
    if (isProd) {
      redis.set(cacheKey, metadata, { ex: CACHE_TTL }).catch((err) => {
        console.error('Redis set error:', err)
      })
    }

    return NextResponse.json(metadata, {
      headers: {
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        'X-Cache': 'MISS',
      },
    })
  } catch (err) {
    console.error(err)
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 })
  }
}
