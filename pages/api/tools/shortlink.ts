import {
  type NextFetchEvent,
  type NextRequest,
  NextResponse,
} from 'next/server'
import { createEdgeRouter } from 'next-connect'
import boom from '@hapi/boom'

const router = createEdgeRouter<NextRequest, NextFetchEvent>()

export const config = {
  runtime: 'edge',
}

router.post(async (req) => {
  const body = (await req.json()) as {
    destination?: string
    slashtag?: string
    title?: string
    fullname?: string
    apikey?: string
  }

  if (!body.destination) throw boom.badRequest('Missing destination')
  if (!body.apikey) throw boom.badRequest('Missing apikey')

  const response = await fetch('https://api.rebrandly.com/v1/links', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      apikey: body.apikey,
    },
    body: JSON.stringify({
      destination: body.destination,
      slashtag: body.slashtag,
      title: body.title,
      domain: {
        fullName: body.fullname || 'url.royli.dev',
      },
    }),
  }).then(
    (res) =>
      res.json() as Promise<{
        shortUrl: string
      }>
  )

  return NextResponse.json({
    shorturl: `https://${response.shortUrl}`,
  })
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
