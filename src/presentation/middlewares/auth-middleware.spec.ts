import { AuthMiddleware } from './auth-middleware'
import { AccessDeniedError } from '../errors/access-denied-error'
import { forbidden } from '../helpers/http/http-helper'
import { findByAccessTokenRepo } from '../../data/protocols/db/find-by-access-token-repo'
import { AccountModel } from '../../domain/models/account'
import { HttpRequest } from '../protocols/http'

const makeFindByAccessToken = (): findByAccessTokenRepo => {
  class FindByAccessTokenStub implements findByAccessTokenRepo {
    async find (token: string): Promise<AccountModel | null> {
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

const makeSut = (): SutTypes => {
  const findByAccessTokenStub = makeFindByAccessToken()

  const sut = new AuthMiddleware(findByAccessTokenStub)

  return { sut, findByAccessTokenStub }
}

describe('Auth Middleware', () => {
  test('should return 403 if token not provided', async () => {
    const { sut } = makeSut()
    const res = await sut.handle({})
    expect(res).toEqual(forbidden(new AccessDeniedError()))
  })
  test('should call findByAccessToken with correct token', async () => {
    const { sut, findByAccessTokenStub } = makeSut()
    const findSpy = jest.spyOn(findByAccessTokenStub, 'find')
    await sut.handle(makeFakeRequest())
    expect(findSpy).toHaveBeenCalledWith('any_token')
  })
  test('should return 403 if findByAccessToken returns null', async () => {
    const { sut, findByAccessTokenStub } = makeSut()
    jest.spyOn(findByAccessTokenStub, 'find').mockReturnValueOnce(Promise.resolve(null))
    const res = await sut.handle(makeFakeRequest())
    expect(res).toEqual(forbidden(new AccessDeniedError()))
  })
})
