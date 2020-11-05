import { HttpRequest, HttpResponse } from '../../protocols/http'
import { badRequest, serverError, ok } from '../../helpers/http/http-helper'
import { Controller } from '../../protocols/controller'
import { AddAccount } from '../../../domain/useCases/add-account'
import { Validation } from '../../protocols/validation'
import { Authentication } from '../../../domain/useCases/authentication'

export class SignUpController implements Controller {
  constructor (

    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = httpRequest.body
      await this.addAccount.add({ name, password, email })
      const token = await this.authentication.auth({
        email,
        password
      })
      return ok({ token })
    } catch (err) {
      return serverError(err)
    }
  }
}
