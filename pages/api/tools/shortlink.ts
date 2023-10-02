import {
  type NextFetchEvent,
  type NextRequest,
  NextResponse,
} from 'next/server'
import { createEdgeRouter } from 'next-connect'
import boom from '@hapi/boom'
import * as Yup from 'yup'

const router = createEdgeRouter<NextRequest, NextFetchEvent>()
const schema = Yup.object().shape({
  destination: Yup.string().required(),
  slashtag: Yup.string(),
  title: Yup.string(),
  fullname: Yup.string(),
  apikey: Yup.string().required(),
})

export const config = {
  runtime: 'edge',
}

router.post(async (req) => {
  const body = await req.json()
  const payload = await schema.validate(body)
  const response = await fetch('https://api.rebrandly.com/v1/links', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      apikey: payload.apikey,
    },
    body: JSON.stringify({
      destination: payload.destination,
      slashtag: payload.slashtag,
      title: payload.title,
      domain: {
        fullName: payload.fullname || 'url.royli.dev',
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
    } else if (err instanceof Yup.ValidationError) {
      return new NextResponse(err.message, {
        status: 400,
      })
    } else if (err instanceof Error) {
      return new NextResponse(err.message, {
        status: 500,
      })
    }
  },
})
