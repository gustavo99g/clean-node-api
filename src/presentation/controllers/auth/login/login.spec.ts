import { LoginController } from './login'
import { badRequest, serverError, unauthorized, ok } from '../../../helpers/http/http-helper'
import { HttpRequest } from '../../../protocols/http'
import { MissingParamError } from '../../../errors/missing-param-error'
import { ValidationSpy } from '../../../test/mock-validation'
import { AuthSpy } from '../../../test/mock-account'

interface SutTypes{
  sut: LoginController
  validationSpy: ValidationSpy
  authSpy: AuthSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const authSpy = new AuthSpy()
  const sut = new LoginController(validationSpy, authSpy)

  return {
    sut,
    validationSpy,
    authSpy
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
    const { sut, authSpy } = makeSut()
    const authSpyJest = jest.spyOn(authSpy, 'auth')
    await sut.handle(makeFakeRequest())
    expect(authSpyJest).toHaveBeenCalledWith({ email: 'any_email@mail.com', password: 'any_password' })
  })
  test('should return 401 if invalid credentials provided ', async () => {
    const { sut, authSpy } = makeSut()
    jest.spyOn(authSpy, 'auth').mockReturnValueOnce(Promise.resolve(null as unknown as string))

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(unauthorized())
  })
  test('should returns 500 if auth throws', async () => {
    const { sut, authSpy } = makeSut()
    jest.spyOn(authSpy, 'auth').mockImplementationOnce(() => {
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
    const { sut, validationSpy } = makeSut()
    const isValidSpy = jest.spyOn(validationSpy, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  test('Should return 400 if validator return a error', async () => {
    const { sut, validationSpy } = makeSut()
    jest.spyOn(validationSpy, 'validate').mockReturnValueOnce(new MissingParamError('any_value'))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_value')))
  })
})
