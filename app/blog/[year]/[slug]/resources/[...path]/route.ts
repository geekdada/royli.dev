import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const CONTENT_DIR = join(process.cwd(), 'content', 'blog')

const MIME_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
}

interface RouteParams {
  params: Promise<{ year: string; slug: string; path: string[] }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { year, slug, path } = await params
  const filePath = join(CONTENT_DIR, year, slug, 'resources', ...path)

  // Security: ensure path doesn't escape content directory
  if (!filePath.startsWith(CONTENT_DIR)) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  if (!existsSync(filePath)) {
    return new NextResponse('Not Found', { status: 404 })
  }

  const file = await readFile(filePath)
  const ext = '.' + path[path.length - 1].split('.').pop()?.toLowerCase()
  const contentType = MIME_TYPES[ext] || 'application/octet-stream'

  return new NextResponse(file, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
