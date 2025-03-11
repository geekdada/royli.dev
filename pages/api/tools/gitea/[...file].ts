import axios, { AxiosError } from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'
import { ResultAsync } from 'neverthrow'
import logger from '@/lib/utils/logger'

const giteaAPI = axios.create({
  baseURL: 'https://git.royli.dev/api/v1',
  headers: {
    Authorization: `token ${process.env.GITEA_API_KEY}`,
  },
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { file } = req.query

  if (!Array.isArray(file)) {
    return res.status(400)
  }

  const [owner, repo, ...rest] = file
  const response = await ResultAsync.fromPromise(
    giteaAPI.get(
      `/repos/${owner}/${repo}/contents/${encodeURIComponent(rest.join('/'))}`
    ),
    (e) => e as AxiosError
  )

  if (response.isErr()) {
    return res.status(response.error.response?.status ?? 500).send(undefined)
  }

  res
    .setHeader('Content-Type', 'text/plain')
    .send(
      Buffer.from(
        response.value.data.content,
        response.value.data.encoding
      ).toString('utf-8')
    )
}
