import { LoginController } from './login'
import { badRequest, serverError, unauthorized } from '../../helpers/http-helper'
import { MissingParamError } from '../../errors/missing-param-error'
import { EmailValidator } from '../../protocols/email-validator'
import { InvalidParamError } from '../../errors/invalid-param-error'
import { HttpRequest } from '../../protocols/http'
import { Authentication } from '../../../domain/useCases/authentication'

interface SutTypes{
  sut: LoginController
  emailStub: EmailValidator
  authStub: Authentication
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAuth = (): Authentication => {
  class AuthStub implements Authentication {
    async auth (email: string, password: string): Promise<string> {
      return 'any_token'
    }
  }
  return new AuthStub()
}

const makeSut = (): SutTypes => {
  const emailStub = makeEmailValidator()
  const authStub = makeAuth()
  const sut = new LoginController(emailStub, authStub)

  return {
    sut,
    emailStub,
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
  test('should returns 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email not provided')))
  })
  test('should returns 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password not provided')))
  })
  test('should returns 400 if invalid email is provided', async () => {
    const { sut, emailStub } = makeSut()
    jest.spyOn(emailStub, 'isValid').mockReturnValueOnce(false)

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('Email is not valid')))
  })
  test('should call EmailValidator with correct email', async () => {
    const { sut, emailStub } = makeSut()
    const isValidSpy = jest.spyOn(emailStub, 'isValid')
    await sut.handle(makeFakeRequest())
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
  test('should returns 500 if emailValidator throws', async () => {
    const { sut, emailStub } = makeSut()
    jest.spyOn(emailStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
  test('should call authentication with correct values', async () => {
    const { sut, authStub } = makeSut()
    const authSpy = jest.spyOn(authStub, 'auth')
    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith('any_email@mail.com', 'any_password')
  })
  test('should return 401 if invalid credentials provided ', async () => {
    const { sut, authStub } = makeSut()
    jest.spyOn(authStub, 'auth').mockReturnValueOnce(Promise.resolve(null as unknown as string))

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(unauthorized())
  })
})
