import { Controller } from '../../../protocols/controller'
import { ok } from '../../../helpers/http/http-helper'
import { HttpRequest, HttpResponse } from '../../../protocols/http'
import { Validation } from '../../../protocols/validation'

export class AddSurveyController implements Controller {
  constructor (private readonly validation: Validation) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(httpRequest.body)
    return ok('success')
  }
}
