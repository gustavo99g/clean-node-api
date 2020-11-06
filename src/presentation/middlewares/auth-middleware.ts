import { Middleware } from '../protocols/middleware'
import { HttpRequest, HttpResponse } from '../protocols/http'
import { ok, forbidden } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors/access-denied-error'

export class AuthMiddleware implements Middleware {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.headers) {
      return forbidden(new AccessDeniedError())
    }

    return Promise.resolve(ok('ok'))
  }
}
