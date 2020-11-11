import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http'
import { FindSurveyByID } from '../../../../domain/useCases/find-survey-by-id'
import { forbidden, ok, serverError } from '../../../helpers/http/http-helper'
import { InvalidParamError } from '../../../errors/invalid-param-error'
import { SaveSurveyResult } from '../../../../domain/useCases/save-survey-result'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly findSurveyById: FindSurveyByID,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const { answer } = httpRequest.body

      const id = surveyId as string
      const survey = await this.findSurveyById.findById(id)
      if (!survey) {
        return forbidden(new InvalidParamError('SurveyId'))
      }

      const validAnswer = survey.answers.find(a => a.answer === answer)

      if (!validAnswer) {
        return forbidden(new InvalidParamError('Answer'))
      }
      const data = {
        accountId: httpRequest.accountId,
        surveyId: id,
        answer,
        date: new Date()
      }

      const result = await this.saveSurveyResult.save(data)

      return ok(result)
    } catch (err) {
      console.log(err)
      return serverError(err)
    }
  }
}
