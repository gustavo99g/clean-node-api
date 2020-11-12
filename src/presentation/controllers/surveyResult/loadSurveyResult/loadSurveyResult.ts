import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http'
import { ok, forbidden, serverError } from '../../../helpers/http/http-helper'
import { FindSurveyByID } from '../../../../domain/useCases/find-survey-by-id'
import { InvalidParamError } from '../../../errors/invalid-param-error'

export class LoadSurveyController implements Controller {
  constructor (private readonly findSurveyById: FindSurveyByID) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const survey = await this.findSurveyById.findById(surveyId)
      if (!survey) {
        return forbidden(new InvalidParamError('SurveyId'))
      }
      return ok('ok')
    } catch (err) {
      return serverError(err)
    }
  }
}
