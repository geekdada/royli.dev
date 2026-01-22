import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.token || !body.user || !body.message) {
      return new NextResponse('Missing required fields', { status: 400 })
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

    return NextResponse.json(await response.json())
  } catch (err) {
    console.error(err)
    if (err instanceof Error) {
      return new NextResponse(err.message, { status: 500 })
    }
    return new NextResponse('Unknown error', { status: 500 })
  }
}
