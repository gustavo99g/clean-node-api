import { Middleware } from '../protocols/middleware'
import { HttpRequest, HttpResponse } from '../protocols/http'
import { ok, forbidden } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors/access-denied-error'
import { findByAccessTokenRepo } from '../../data/protocols/db/find-by-access-token-repo'

export class AuthMiddleware implements Middleware {
  constructor (private readonly findByAccesTokenRepo: findByAccessTokenRepo) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token']

    if (!accessToken) {
      return forbidden(new AccessDeniedError())
    }
    await this.findByAccesTokenRepo.find(accessToken)

    return Promise.resolve(ok('ok'))
  }
}
