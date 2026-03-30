import { NextResponse } from 'next/server'
import { zenmuxManagementAPIKey } from '@/lib/config'

export const runtime = 'edge'

export async function GET() {
  try {
    const response = await fetch(
      'https://zenmux.ai/api/v1/management/subscription/detail',
      {
        headers: {
          Authorization: `Bearer ${zenmuxManagementAPIKey}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch subscription detail')
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 500 })
    }
    return new NextResponse('Unknown error', { status: 500 })
  }
}
