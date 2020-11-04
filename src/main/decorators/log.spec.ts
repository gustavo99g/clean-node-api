import { Controller } from '../../presentation/protocols/controller'
import { HttpRequest, HttpResponse } from '../../presentation/protocols/http'
import { LogControllerDecorator } from './log'
import { serverError } from '../../presentation/helpers/http/http-helper'
import { LogErrorRepo } from '../../data/protocols/db/log-error-repo'

interface sutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepo
}

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          name: 'gustavo'
        }
      }
      return Promise.resolve(httpResponse)
    }
  }
  return new ControllerStub()
}
const makeErrorRepository = (): LogErrorRepo => {
  class LogErrorRepositoryStub implements LogErrorRepo {
    async logError (stack: string): Promise<void> {
      return Promise.resolve(undefined)
    }
  }

  return new LogErrorRepositoryStub()
}

const makeSut = (): sutTypes => {
  const controllerStub = makeControllerStub()
  const logErrorRepositoryStub = makeErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('LogController decorator', () => {
  test('should call controller handle', async () => {
    const { controllerStub, sut } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest = {
      body: {
        email: 'any_mail@mail.com',
        name: 'any_name',
        password: '123',
        passwordConfirmation: '123'
      }
    }
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('should call loggerErrorRepository if controller return a server error', async () => {
    const { controllerStub, sut, logErrorRepositoryStub } = makeSut()
    const fakeErro = new Error()
    fakeErro.stack = 'any_value'
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(serverError(fakeErro)))
    const httpRequest = {
      body: {
        email: 'any_mail@mail.com',
        name: 'any_name',
        password: '123',
        passwordConfirmation: '123'
      }
    }
    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('any_value')
  })
})
