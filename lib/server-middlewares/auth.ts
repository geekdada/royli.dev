import { getSession } from '@auth0/nextjs-auth0'
import boom from '@hapi/boom'

import { siteAdminUserId } from '@/lib/config'
import { Middleware } from '@/lib/types/server'

export const authMiddleware: Middleware = async (req, res, next) => {
  const session = await getSession(req, res)

  if (!session || session.user.sub !== siteAdminUserId) {
    throw boom.unauthorized()
  } else {
    return next()
  }
}
