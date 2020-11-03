import { Controller } from '../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../protocols/http'
import { badRequest } from '../../helpers/http-helper'
import { MissingParamError } from '../../errors/missing-param-error'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return Promise.resolve(badRequest(new MissingParamError('Email not provided')))
    }

    return Promise.resolve(badRequest(new MissingParamError('Password not provided')))
  }
}
