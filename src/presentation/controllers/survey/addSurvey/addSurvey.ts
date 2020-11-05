import { Controller } from '../../../protocols/controller'
import { noContent, badRequest, serverError } from '../../../helpers/http/http-helper'
import { HttpRequest, HttpResponse } from '../../../protocols/http'
import { Validation } from '../../../protocols/validation'
import { AddSurvey } from '../../../../domain/useCases/add-survey'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { survey } = httpRequest.body
      await this.addSurvey.add(survey)
      return noContent()
    } catch (err) {
      return serverError(err)
    }
  }
}
