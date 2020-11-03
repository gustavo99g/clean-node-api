import { Controller } from '../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../protocols/http'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { MissingParamError } from '../../errors/missing-param-error'
import { EmailValidator } from '../../protocols/email-validator'
import { InvalidParamError } from '../../errors/invalid-param-error'

export class LoginController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body

      if (!email) {
        return Promise.resolve(badRequest(new MissingParamError('Email not provided')))
      }

      if (!password) {
        return Promise.resolve(badRequest(new MissingParamError('Password not provided')))
      }

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return Promise.resolve(badRequest(new InvalidParamError('Email is not valid')))
      }

      return Promise.resolve(ok('success'))
    } catch (err) {
      return serverError(err)
    }
  }
}
