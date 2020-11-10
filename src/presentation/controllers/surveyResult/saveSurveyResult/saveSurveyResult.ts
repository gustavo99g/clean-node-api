import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http'
import { FindSurveyByID } from '../../../../domain/useCases/find-survey-by-id'
import { forbidden, ok } from '../../../helpers/http/http-helper'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly findSurveyById: FindSurveyByID) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { surveyId } = httpRequest.params
    const id = surveyId as string
    const survey = await this.findSurveyById.findById(id)
    if (!survey) {
      return forbidden(new Error())
    }

    return ok('ok')
  }
}
