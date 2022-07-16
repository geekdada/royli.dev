import boom from '@hapi/boom'
import { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from 'next-connect'
import * as Yup from 'yup'

import { getCachedBlogPosts } from '../../../lib/notion'
import { authMiddleware } from '../../../lib/server-middlewares/auth'

const router = createRouter<NextApiRequest, NextApiResponse>()

router.post(authMiddleware, async (req, res) => {
  const schema = Yup.object().shape({
    type: Yup.string().required(),
    uri: Yup.string(),
  })
  const payload = await schema.validate(req.body)

  switch (payload.type) {
    case 'blog-posts':
      await Promise.all([
        res.revalidate('/'),
        res.revalidate('/blog'),
        getCachedBlogPosts.delete('[{"pageSize":10}]'), // RSS cache
        getCachedBlogPosts.delete('[]'), // Without pagination
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
    } else if (err instanceof Yup.ValidationError) {
      res.status(400).send(err.message)
      return
    } else if (err instanceof Error) {
      res.status(500).send(err.message)
      return
    }

    res.status(500).end()
  },
})
