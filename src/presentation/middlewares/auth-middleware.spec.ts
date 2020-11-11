import { AuthMiddleware } from './auth-middleware'
import { AccessDeniedError } from '../errors/access-denied-error'
import { forbidden, ok, serverError } from '../helpers/http/http-helper'
import { HttpRequest } from '../protocols/http'
import { FindByAccessTokenSpy } from '../test/mock-account'

interface SutTypes {
  sut: AuthMiddleware
  findByAccessTokenSpy: FindByAccessTokenSpy
}

const makeFakeRequest = (): HttpRequest => {
  return {
    headers: {
      'x-access-token': 'any_token'
    }
  }
}

const makeSut = (role?: string): SutTypes => {
  const findByAccessTokenSpy = new FindByAccessTokenSpy()

  const sut = new AuthMiddleware(findByAccessTokenSpy, role)

  return { sut, findByAccessTokenSpy }
}

describe('Auth Middleware', () => {
  test('should return 403 if token not provided', async () => {
    const { sut } = makeSut()
    const res = await sut.handle({})
    expect(res).toEqual(forbidden(new AccessDeniedError()))
  })
  test('should call findByAccessToken with correct token', async () => {
    const { sut, findByAccessTokenSpy } = makeSut('any_role')
    const findSpy = jest.spyOn(findByAccessTokenSpy, 'findByAccessToken')
    await sut.handle(makeFakeRequest())
    expect(findSpy).toHaveBeenCalledWith('any_token', 'any_role')
  })
  test('should return 403 if findByAccessToken returns null', async () => {
    const { sut, findByAccessTokenSpy } = makeSut()
    jest.spyOn(findByAccessTokenSpy, 'findByAccessToken').mockReturnValueOnce(Promise.resolve(null))
    const res = await sut.handle(makeFakeRequest())
    expect(res).toEqual(forbidden(new AccessDeniedError()))
  })
  test('should return 200 if findByAccessToken returns an account', async () => {
    const { sut } = makeSut()
    const res = await sut.handle(makeFakeRequest())
    expect(res).toEqual(ok({ accountId: 'any_id' }))
  })
  test('should return 500 if findByAccessToken throws', async () => {
    const { sut, findByAccessTokenSpy } = makeSut()
    jest.spyOn(findByAccessTokenSpy, 'findByAccessToken').mockReturnValueOnce(Promise.reject(serverError(new Error())))
    const res = await sut.handle(makeFakeRequest())
    expect(res).toEqual(serverError(new Error()))
  })
})
