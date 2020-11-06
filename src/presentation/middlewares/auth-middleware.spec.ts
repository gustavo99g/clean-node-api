import { AuthMiddleware } from './auth-middleware'
import { AccessDeniedError } from '../errors/access-denied-error'
import { forbidden } from '../helpers/http/http-helper'

const makeSut = (): any => {
  const sut = new AuthMiddleware()

  return { sut }
}

describe('Auth Middleware', () => {
  test('should return 403 if token not provided', async () => {
    const { sut } = makeSut()
    const res = await sut.handle({})
    expect(res).toEqual(forbidden(new AccessDeniedError()))
  })
})
