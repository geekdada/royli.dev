import { NextResponse } from 'next/server'
import { z } from 'zod/v4'
import ky from 'ky'
import { karakeepAPIKey } from '@/lib/config'

export const runtime = 'edge'

const bodySchema = z.object({
  url: z.url().optional().nullable(),
  summary: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  source_url: z.url().optional().nullable(),
  image_url: z.url().optional().nullable(),
  title: z.string().optional().nullable(),
})

export async function POST(request: Request) {
  try {
    const text = await request.text()

    if (!text) {
      return new NextResponse(null, { status: 204 })
    }

    const body = JSON.parse(text)
    const parsedBody = bodySchema.safeParse(body)

    if (!parsedBody.success) {
      return new NextResponse(parsedBody.error.message, { status: 400 })
    }

    // https://docs.readwise.io/readwise/docs/webhooks
    const { url, summary, content, source_url, title } = parsedBody.data

    if (!source_url) {
      return new NextResponse(null, { status: 204 })
    }

    if (source_url.startsWith('http')) {
      await ky.post('https://hoarder.royli.dev/api/v1/bookmarks', {
        headers: {
          Authorization: `Bearer ${karakeepAPIKey}`,
        },
        json: {
          type: 'link',
          title: title || '',
          url: source_url,
          summary: summary || '',
          source: 'api',
        },
      })
    } else {
      await ky.post('https://hoarder.royli.dev/api/v1/bookmarks', {
        headers: {
          Authorization: `Bearer ${karakeepAPIKey}`,
        },
        json: {
          type: 'text',
          text: content || '',
          title: title || '',
          summary: summary || '',
          sourceUrl: url,
          source: 'api',
        },
      })
    }

    return new NextResponse(null, { status: 201 })
  } catch (err) {
    console.error(err)
    if (err instanceof Error) {
      return new NextResponse(err.message, { status: 500 })
    }
    return new NextResponse('Unknown error', { status: 500 })
  }
}
