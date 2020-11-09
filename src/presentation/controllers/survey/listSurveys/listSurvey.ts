import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http'
import { ok, serverError } from '../../../helpers/http/http-helper'
import { ListSurveys } from '../../../../domain/useCases/list-survey'

export class ListSurveysController implements Controller {
  constructor (private readonly listSurveys: ListSurveys) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.listSurveys.list()
      return Promise.resolve(ok(surveys))
    } catch (err) {
      return serverError(err)
    }
  }
}
