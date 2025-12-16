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
  items: z.array(
    z.object({
      title: z.string().optional().nullable(),
      canonical: z.array(
        z.object({
          href: z.url(),
        })
      ),
    })
  ),
})

router.post(async (req) => {
  const body = await req.json()
  const parsedBody = bodySchema.safeParse(body)

  if (!parsedBody.success) {
    throw boom.badRequest(parsedBody.error.message)
  }

  // https://www.inoreader.com/blog/2019/03/introducing-a-new-rule-action-webhooks.html
  const { items } = parsedBody.data

  for (const item of items) {
    const { title, canonical } = item

    if (canonical.length === 0) {
      continue
    }

    const url = canonical[0].href

    await ky.post('https://hoarder.royli.dev/api/v1/bookmarks', {
      headers: {
        Authorization: `Bearer ${karakeepAPIKey}`,
      },
      json: {
        type: 'link',
        title: title || '',
        url,
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
