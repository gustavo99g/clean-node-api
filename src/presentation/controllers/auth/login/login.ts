import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http'
import { badRequest, ok, serverError, unauthorized } from '../../../helpers/http/http-helper'
import { Authentication } from '../../../../domain/useCases/authentication'
import { Validation } from '../../../protocols/validation'

export class LoginController implements Controller {
  constructor (private readonly validation: Validation, private readonly authentication: Authentication) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body

      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const token = await this.authentication.auth({ email, password })

      if (!token) {
        return unauthorized()
      }

      return ok({ token })
    } catch (err) {
      return serverError(err)
    }
  }
}
