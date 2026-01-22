import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      destination?: string
      slashtag?: string
      title?: string
      fullname?: string
      apikey?: string
    }

    if (!body.destination) {
      return new NextResponse('Missing destination', { status: 400 })
    }
    if (!body.apikey) {
      return new NextResponse('Missing apikey', { status: 400 })
    }

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
  } catch (err) {
    console.error(err)
    if (err instanceof Error) {
      return new NextResponse(err.message, { status: 500 })
    }
    return new NextResponse('Unknown error', { status: 500 })
  }
}
