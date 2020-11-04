import { SignUpController } from './signup'
import { MissingParamError } from '../../errors/missing-param-error'
import { ServerError } from '../../errors/server-error'
import { AddAccount, AddAccountModel } from '../../../domain/useCases/add-account'
import { AccountModel } from '../../../domain/models/account'
import { HttpRequest } from '../../protocols/http'
import { ok, badRequest } from '../../helpers/http/http-helper'
import { Validation } from '../../protocols/validation'

interface SubTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(fakeAccount()))
    }
  }
  return new AddAccountStub()
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
  const sut = new SignUpController(addAccountStub, validationStub)

  return { sut, addAccountStub, validationStub }
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
  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(fakeRequest())
    expect(httpResponse).toEqual(ok(fakeAccount()))
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
})
