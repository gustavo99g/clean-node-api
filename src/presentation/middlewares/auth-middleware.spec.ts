import { AuthMiddleware } from './auth-middleware'
import { AccessDeniedError } from '../errors/access-denied-error'
import { forbidden, ok, serverError } from '../helpers/http/http-helper'
import { findByAccessTokenRepo } from '../../data/protocols/db/find-by-access-token-repo'
import { AccountModel } from '../../domain/models/account'
import { HttpRequest } from '../protocols/http'

const makeFindByAccessToken = (): findByAccessTokenRepo => {
  class FindByAccessTokenStub implements findByAccessTokenRepo {
    async findByAccessToken (token: string): Promise<AccountModel | null> {
      return Promise.resolve({
        id: 'any_id',
        email: 'any_email',
        name: 'any_name',
        password: 'any_password'
      })
    }
  }
  return new FindByAccessTokenStub()
}

interface SutTypes {
  sut: AuthMiddleware
  findByAccessTokenStub: findByAccessTokenRepo
}

const makeFakeRequest = (): HttpRequest => {
  return {
    headers: {
      'x-access-token': 'any_token'
    }
  }
}

const makeSut = (role?: string): SutTypes => {
  const findByAccessTokenStub = makeFindByAccessToken()

  const sut = new AuthMiddleware(findByAccessTokenStub, role)

  return { sut, findByAccessTokenStub }
}

describe('Auth Middleware', () => {
  test('should return 403 if token not provided', async () => {
    const { sut } = makeSut()
    const res = await sut.handle({})
    expect(res).toEqual(forbidden(new AccessDeniedError()))
  })
  test('should call findByAccessToken with correct token', async () => {
    const { sut, findByAccessTokenStub } = makeSut('any_role')
    const findSpy = jest.spyOn(findByAccessTokenStub, 'findByAccessToken')
    await sut.handle(makeFakeRequest())
    expect(findSpy).toHaveBeenCalledWith('any_token', 'any_role')
  })
  test('should return 403 if findByAccessToken returns null', async () => {
    const { sut, findByAccessTokenStub } = makeSut()
    jest.spyOn(findByAccessTokenStub, 'findByAccessToken').mockReturnValueOnce(Promise.resolve(null))
    const res = await sut.handle(makeFakeRequest())
    expect(res).toEqual(forbidden(new AccessDeniedError()))
  })
  test('should return 200 if findByAccessToken returns an account', async () => {
    const { sut } = makeSut()
    const res = await sut.handle(makeFakeRequest())
    expect(res).toEqual(ok({ accountId: 'any_id' }))
  })
  test('should return 500 if findByAccessToken throws', async () => {
    const { sut, findByAccessTokenStub } = makeSut()
    jest.spyOn(findByAccessTokenStub, 'findByAccessToken').mockReturnValueOnce(Promise.reject(serverError(new Error())))
    const res = await sut.handle(makeFakeRequest())
    expect(res).toEqual(serverError(new Error()))
  })
})
