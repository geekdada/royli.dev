import axios, { AxiosError } from 'axios'
import { NextResponse } from 'next/server'
import { ResultAsync } from 'neverthrow'
import { giteaAPIKey } from '@/lib/config'

const giteaAPI = axios.create({
  baseURL: 'https://git.royli.dev/api/v1',
  headers: {
    Authorization: `token ${giteaAPIKey}`,
  },
})

export async function GET(
  request: Request,
  { params }: { params: Promise<{ file: string[] }> }
) {
  const { file } = await params

  if (!Array.isArray(file)) {
    return new NextResponse(null, { status: 400 })
  }

  const [owner, repo, ...rest] = file
  const response = await ResultAsync.fromPromise(
    giteaAPI.get(
      `/repos/${owner}/${repo}/contents/${encodeURIComponent(rest.join('/'))}`
    ),
    (e) => e as AxiosError
  )

  if (response.isErr()) {
    return new NextResponse(null, {
      status: response.error.response?.status ?? 500,
    })
  }

  const content = Buffer.from(
    response.value.data.content,
    response.value.data.encoding
  ).toString('utf-8')

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
