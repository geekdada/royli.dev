import boom from '@hapi/boom'
import { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from 'next-connect'
import { z } from 'zod'

import { getCachedBlogPosts } from '@/lib/notion'
import { authMiddleware } from '@/lib/server-middlewares/auth'

const router = createRouter<NextApiRequest, NextApiResponse>()
const schema = z.object({
  type: z.string(),
  uri: z.string().optional(),
})

router.post(authMiddleware, async (req, res) => {
  const payload = schema.parse(req.body)

  switch (payload.type) {
    case 'blog-posts':
      await Promise.all([
        res.revalidate('/'),
        res.revalidate('/blog'),
        getCachedBlogPosts.clear(),
      ])
      break
    case 'uri':
      await res.revalidate(payload.uri as string)
      break
    default:
      throw boom.badRequest('Invalid type')
  }

  res.status(200).json({
    ok: true,
  })
})

export default router.handler({
  onError: (err, req, res) => {
    console.error(err)

    if (boom.isBoom(err)) {
      res.status(err.output.statusCode).send(err.message)
      return
    } else if (err instanceof z.ZodError) {
      res.status(400).send(err.issues[0]?.message ?? 'Validation error')
      return
    } else if (err instanceof Error) {
      res.status(500).send(err.message)
      return
    }

    res.status(500).end()
  },
})
