import { Middleware } from '../protocols/middleware'
import { HttpRequest, HttpResponse } from '../protocols/http'
import { ok, forbidden, serverError } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors/access-denied-error'
import { findByAccessTokenRepo } from '../../data/protocols/db/find-by-access-token-repo'

export class AuthMiddleware implements Middleware {
  constructor (private readonly dbFindByAccesToken: findByAccessTokenRepo, private readonly role?: string) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']

      if (!accessToken) {
        return forbidden(new AccessDeniedError())
      }
      const account = await this.dbFindByAccesToken.findByAccessToken(accessToken, this.role)

      if (!account) {
        return forbidden(new AccessDeniedError())
      }

      return ok({ accountId: account.id })
    } catch (err) {
      return serverError(err)
    }
  }
}
