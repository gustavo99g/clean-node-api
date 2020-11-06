import { Middleware } from '../../../presentation/protocols/middleware'
import { AuthMiddleware } from '../../../presentation/middlewares/auth-middleware'
import { makeDbFindByAccessToken } from '../useCases/dbFindByAccessToken'

export const makeAuthMiddleware = (role?: string): Middleware => {
  return new AuthMiddleware(makeDbFindByAccessToken(), role)
}
