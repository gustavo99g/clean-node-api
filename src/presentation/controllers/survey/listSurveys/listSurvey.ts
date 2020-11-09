import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http'
import { ok } from '../../../helpers/http/http-helper'
import { ListSurveys } from '../../../../domain/useCases/list-survey'

export class ListSurveysController implements Controller {
  constructor (private readonly listSurveys: ListSurveys) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.listSurveys.list()
    return Promise.resolve(ok('surveys'))
  }
}
