import { Controller } from '../../presentation/protocols/controller'
import { HttpRequest, HttpResponse } from '../../presentation/protocols/http'
import { LogErrorRepo } from '../../data/protocols/db/log-error-repo'

export class LogControllerDecorator implements Controller {
  constructor (private readonly controller: Controller, private readonly logErrorRepo: LogErrorRepo) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const HttpResponse = await this.controller.handle(httpRequest)
    if (HttpResponse.statusCode === 500) {
      await this.logErrorRepo.logError(HttpResponse.body.stack)
    }
    return HttpResponse
  }
}
