import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http'
import { ok } from '../../../helpers/http/http-helper'
import { FindSurveyByID } from '../../../../domain/useCases/find-survey-by-id'

export class LoadSurveyController implements Controller {
  constructor (private readonly findSurveyById: FindSurveyByID) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { surveyId } = httpRequest.params
    await this.findSurveyById.findById(surveyId)
    return ok('ok')
  }
}
