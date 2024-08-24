import dayjs from 'dayjs'
import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from 'next-connect'
import boom from '@hapi/boom'
import { getPageProperty } from 'notion-utils'

import { getPrivatePageRecordMapByPageId } from '@/lib/notion'

const router = createRouter<NextApiRequest, NextApiResponse>()

router.get(async (req, res) => {
  const { pageId } = req.query

  if (!pageId) {
    throw boom.notFound()
  }

  const post = await getPrivatePageRecordMapByPageId(pageId as string)
  const blockId = Object.keys(post.block)[0]
  const block = post.block[blockId]
  const slug = getPageProperty<string>('Slug', block.value, post)
  const publishDate = getPageProperty<string | null>(
    'Publish Date',
    block.value,
    post
  )
  const createdTime = block.value.created_time
  const publishYear = dayjs(publishDate || createdTime).format('YYYY')

  res.status(301).redirect(`/blog/${publishYear}/${slug}`)
})

export default router.handler({
  onError: (err, req, res) => {
    console.error(err)

    if (boom.isBoom(err)) {
      res.status(err.output.statusCode).send(err.message)
      return
    } else if (err instanceof Error) {
      if (err.message.includes('invalid notion pageId')) {
        res.status(404).send(err.message)
      } else {
        res.status(500).send(err.message)
      }
      return
    }

    res.status(500).end()
  },
})
