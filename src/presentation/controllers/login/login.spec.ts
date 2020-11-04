import { LoginController } from './login'
import { badRequest, serverError, unauthorized, ok } from '../../helpers/http/http-helper'
import { HttpRequest } from '../../protocols/http'
import { Authentication, AuthenticateModel } from '../../../domain/useCases/authentication'
import { Validation } from '../../protocols/validation'
import { MissingParamError } from '../../errors/missing-param-error'

interface SutTypes{
  sut: LoginController
  validationStub: Validation
  authStub: Authentication
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): any {
      return null
    }
  }
  return new ValidationStub()
}

const makeAuth = (): Authentication => {
  class AuthStub implements Authentication {
    async auth (authentication: AuthenticateModel): Promise<string> {
      return 'any_token'
    }
  }
  return new AuthStub()
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const authStub = makeAuth()
  const sut = new LoginController(validationStub, authStub)

  return {
    sut,
    validationStub,
    authStub
  }
}

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      email: 'any_email@mail.com',
      password: 'any_password'
    }
  }
}

describe('Login Controller', () => {
  test('should call authentication with correct values', async () => {
    const { sut, authStub } = makeSut()
    const authSpy = jest.spyOn(authStub, 'auth')
    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith({ email: 'any_email@mail.com', password: 'any_password' })
  })
  test('should return 401 if invalid credentials provided ', async () => {
    const { sut, authStub } = makeSut()
    jest.spyOn(authStub, 'auth').mockReturnValueOnce(Promise.resolve(null as unknown as string))

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(unauthorized())
  })
  test('should returns 500 if auth throws', async () => {
    const { sut, authStub } = makeSut()
    jest.spyOn(authStub, 'auth').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
  test('should return 200 on success', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ token: 'any_token' }))
  })
  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const isValidSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  test('Should return 400 if validator return a error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_value'))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_value')))
  })
})
