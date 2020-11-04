import { HttpRequest, HttpResponse } from '../../protocols/http'
import { badRequest, serverError, ok } from '../../helpers/http/http-helper'
import { Controller } from '../../protocols/controller'
import { AddAccount } from '../../../domain/useCases/add-account'
import { Validation } from '../../protocols/validation'

export class SignUpController implements Controller {
  constructor (

    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = httpRequest.body
      const account = await this.addAccount.add({ name, password, email })

      return ok(account)
    } catch (err) {
      return serverError(err)
    }
  }
}
