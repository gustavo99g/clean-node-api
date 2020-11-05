import { SignUpController } from './signup'
import { MissingParamError } from '../../../errors/missing-param-error'
import { ServerError } from '../../../errors/server-error'
import { EmailInUseError } from '../../../errors/emailInUserError'
import { AddAccount, AddAccountModel } from '../../../../domain/useCases/add-account'
import { AccountModel } from '../../../../domain/models/account'
import { HttpRequest } from '../../../protocols/http'
import { ok, badRequest, serverError, forbidden } from '../../../helpers/http/http-helper'
import { Validation } from '../../../protocols/validation'
import { Authentication, AuthenticateModel } from '../../../../domain/useCases/authentication'

interface SubTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
  authStub: Authentication
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(fakeAccount()))
    }
  }
  return new AddAccountStub()
}
const makeAuth = (): Authentication => {
  class AuthStub implements Authentication {
    async auth (authentication: AuthenticateModel): Promise<string> {
      return 'any_token'
    }
  }
  return new AuthStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): any {
      return null
    }
  }
  return new ValidationStub()
}

const makeSut = (): SubTypes => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const authStub = makeAuth()
  const sut = new SignUpController(addAccountStub, validationStub, authStub)

  return { sut, addAccountStub, validationStub, authStub }
}

const fakeRequest = (): HttpRequest => ({
  body: {
    name: 'test',
    email: 'test@mail.com',
    password: '123',
    passwordConfirmation: '123'
  }
})

const fakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password'
})

describe('SignUp Controller', () => {
  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addspy = jest.spyOn(addAccountStub, 'add')

    await sut.handle(fakeRequest())
    expect(addspy).toHaveBeenCalledWith({
      name: 'test',
      email: 'test@mail.com',
      password: '123'

    })
  })
  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
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
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(Promise.resolve(null))

    const httpResponse = await sut.handle(fakeRequest())
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })
  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const isValidSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = fakeRequest()
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  test('Should return 400 if validator return a error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_value'))
    const httpResponse = await sut.handle(fakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_value')))
  })
  test('should call authentication with correct values', async () => {
    const { sut, authStub } = makeSut()
    const authSpy = jest.spyOn(authStub, 'auth')
    await sut.handle(fakeRequest())
    expect(authSpy).toHaveBeenCalledWith({ email: 'test@mail.com', password: '123' })
  })
  test('should returns 500 if auth throws', async () => {
    const { sut, authStub } = makeSut()
    jest.spyOn(authStub, 'auth').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(fakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
