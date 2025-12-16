import {
  type NextFetchEvent,
  type NextRequest,
  NextResponse,
} from 'next/server'
import { createEdgeRouter } from 'next-connect'
import { z } from 'zod/v4'
import * as boom from '@hapi/boom'
import ky from 'ky'
import { karakeepAPIKey } from '@/lib/config'

export const config = {
  runtime: 'edge',
}

const router = createEdgeRouter<NextRequest, NextFetchEvent>()

const bodySchema = z.object({
  url: z.url().optional(),
  summary: z.string().optional(),
  content: z.string().optional(),
  source_url: z.url().optional(),
  image_url: z.url().optional(),
  title: z.string().optional(),
})

router.post(async (req) => {
  const body = await req.json()
  const parsedBody = bodySchema.safeParse(body)

  if (!parsedBody.success) {
    throw boom.badRequest(parsedBody.error.message)
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
})

export default router.handler({
  onError: (err) => {
    console.error(err)

    if (boom.isBoom(err)) {
      return new NextResponse(err.message, {
        status: err.output.statusCode,
      })
    } else if (err instanceof Error) {
      return new NextResponse(err.message, {
        status: 500,
      })
    }
  },
})
