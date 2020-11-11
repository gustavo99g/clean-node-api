import { DbFindByAccessToken } from './db-find-by-accessToken'
import { MockAccountModel } from '../../../domain/test/mock-account'
import { DecrypterSpy } from '../../test/mock-cryto'
import { FindByAccessTokenSpy } from '../../test/mock-db-account'

interface SutTypes {
  sut: DbFindByAccessToken
  findByAccessTokenSpy: FindByAccessTokenSpy
  descrypterSpy: DecrypterSpy
}

const makeSut = (): SutTypes => {
  const descrypterSpy = new DecrypterSpy()
  const findByAccessTokenSpy = new FindByAccessTokenSpy()
  const sut = new DbFindByAccessToken(descrypterSpy, findByAccessTokenSpy)
  return { sut, findByAccessTokenSpy, descrypterSpy }
}

describe('find By email Use Case', () => {
  test('should call decrypter with correct value', async () => {
    const { sut, descrypterSpy } = makeSut()
    const decryptSpy = jest.spyOn(descrypterSpy, 'decrypt')
    await sut.findByAccessToken('any_token')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })
  test('should return null if decrypter returns null', async () => {
    const { sut, descrypterSpy } = makeSut()
    jest.spyOn(descrypterSpy, 'decrypt').mockReturnValueOnce(Promise.resolve(null))
    const res = await sut.findByAccessToken('any_token')
    expect(res).toBeNull()
  })
  test('should throw if decrypter throws', async () => {
    const { sut, descrypterSpy } = makeSut()
    jest.spyOn(descrypterSpy, 'decrypt').mockReturnValueOnce(Promise.reject(new Error()))
    const res = sut.findByAccessToken('any_token')
    await expect(res).rejects.toThrow()
  })
  test('should call findByAccessToken with correct value', async () => {
    const { sut, findByAccessTokenSpy } = makeSut()
    const findSpy = jest.spyOn(findByAccessTokenSpy, 'findByAccessToken')
    await sut.findByAccessToken('any_token', 'any_role')
    expect(findSpy).toHaveBeenCalledWith('any_token', 'any_role')
  })
  test('should return null if findByAccessToken returns null', async () => {
    const { sut, findByAccessTokenSpy } = makeSut()
    jest.spyOn(findByAccessTokenSpy, 'findByAccessToken').mockReturnValueOnce(Promise.resolve(null))
    const res = await sut.findByAccessToken('any_token', 'any_role')
    expect(res).toBeNull()
  })
  test('should throw if findByAccessToken throws', async () => {
    const { sut, findByAccessTokenSpy } = makeSut()
    jest.spyOn(findByAccessTokenSpy, 'findByAccessToken').mockReturnValueOnce(Promise.reject(new Error()))
    const res = sut.findByAccessToken('any_token', 'any_role')
    await expect(res).rejects.toThrow()
  })
  test('should return an account on findByAccessToken succeeds', async () => {
    const { sut } = makeSut()

    const res = await sut.findByAccessToken('any_token', 'any_role')
    expect(res).toEqual(MockAccountModel())
  })
})
