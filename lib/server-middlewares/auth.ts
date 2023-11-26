import { getSession } from '@auth0/nextjs-auth0'
import boom from '@hapi/boom'

import { siteAdminUserId } from '@/config'
import { Middleware } from '@/types/server'

export const authMiddleware: Middleware = async (req, res, next) => {
  const session = getSession(req, res)

  if (!session || session.user.sub !== siteAdminUserId) {
    throw boom.unauthorized()
  } else {
    return next()
  }
}
