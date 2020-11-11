import { SignUpController } from './signup'
import { MissingParamError } from '../../../errors/missing-param-error'
import { ServerError } from '../../../errors/server-error'
import { EmailInUseError } from '../../../errors/emailInUserError'
import { HttpRequest } from '../../../protocols/http'
import { ok, badRequest, serverError, forbidden } from '../../../helpers/http/http-helper'
import { AddAccountSpy, AuthSpy } from '../../../test/mock-account'
import { ValidationSpy } from '../../../test/mock-validation'

interface SubTypes {
  sut: SignUpController
  addAccountSpy: AddAccountSpy
  validationSpy: ValidationSpy
  authSpy: AuthSpy
}

const makeSut = (): SubTypes => {
  const addAccountSpy = new AddAccountSpy()
  const validationSpy = new ValidationSpy()
  const authSpy = new AuthSpy()
  const sut = new SignUpController(addAccountSpy, validationSpy, authSpy)

  return { sut, addAccountSpy, validationSpy, authSpy }
}

const fakeRequest = (): HttpRequest => ({
  body: {
    name: 'test',
    email: 'test@mail.com',
    password: '123',
    passwordConfirmation: '123'
  }
})

describe('SignUp Controller', () => {
  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountSpy } = makeSut()
    const addspy = jest.spyOn(addAccountSpy, 'add')

    await sut.handle(fakeRequest())
    expect(addspy).toHaveBeenCalledWith({
      name: 'test',
      email: 'test@mail.com',
      password: '123'

    })
  })
  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountSpy } = makeSut()
    jest.spyOn(addAccountSpy, 'add').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(fakeRequest())
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError('any'))
  })
  test('Should return 200 with token if valid data is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(fakeRequest())
    expect(httpResponse).toEqual(ok({ token: 'any_token' }))
  })
  test('Should return 403 with token if addAccount return null', async () => {
    const { sut, addAccountSpy } = makeSut()
    jest.spyOn(addAccountSpy, 'add').mockReturnValueOnce(Promise.resolve(null))

    const httpResponse = await sut.handle(fakeRequest())
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })
  test('Should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()
    const isValidSpy = jest.spyOn(validationSpy, 'validate')
    const httpRequest = fakeRequest()
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  test('Should return 400 if validator return a error', async () => {
    const { sut, validationSpy } = makeSut()
    jest.spyOn(validationSpy, 'validate').mockReturnValueOnce(new MissingParamError('any_value'))
    const httpResponse = await sut.handle(fakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_value')))
  })
  test('should call authentication with correct values', async () => {
    const { sut, authSpy } = makeSut()
    const authSpyJest = jest.spyOn(authSpy, 'auth')
    await sut.handle(fakeRequest())
    expect(authSpyJest).toHaveBeenCalledWith({ email: 'test@mail.com', password: '123' })
  })
  test('should returns 500 if auth throws', async () => {
    const { sut, authSpy } = makeSut()
    jest.spyOn(authSpy, 'auth').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(fakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
