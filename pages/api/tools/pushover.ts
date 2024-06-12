import {
  type NextFetchEvent,
  type NextRequest,
  NextResponse,
} from 'next/server'
import { createEdgeRouter } from 'next-connect'
import * as boom from '@hapi/boom'

const router = createEdgeRouter<NextRequest, NextFetchEvent>()

export const config = {
  runtime: 'edge',
}

router.post(async (req) => {
  const body = await req.json()

  if (!body.token || !body.user || !body.message) {
    throw boom.badRequest('Missing required fields')
  }

  const data = new URLSearchParams(body)

  const response = await fetch('https://api.pushover.net/1/messages.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: data,
  })

  if (!response.ok) {
    throw new Error('Failed to send message')
  }

  return NextResponse.json(response.json())
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
