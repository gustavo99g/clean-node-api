import { DbFindByAccessToken } from './db-find-by-accessToken'
import { findByAccessTokenRepo } from '../../protocols/db/find-by-access-token-repo'
import { AccountModel } from '../../../domain/models/account'
import { Decrypter } from '../../protocols/crypto/token-decrypter'

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (token: string): Promise<string | null> {
      return Promise.resolve('any_id')
    }
  }
  return new DecrypterStub()
}

const makeFakeAccount = (): AccountModel => {
  return {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email',
    password: 'any_password'
  }
}

const makefindAccessTokenRepo = (): findByAccessTokenRepo => {
  class FindByAccessTokenStub implements findByAccessTokenRepo {
    async find (token: string, role?: string): Promise<AccountModel | null> {
      return Promise.resolve(makeFakeAccount())
    }
  }
  return new FindByAccessTokenStub()
}

interface SutTypes {
  sut: DbFindByAccessToken
  findByAccessTokenStub: findByAccessTokenRepo
  descrypterStub: Decrypter
}

const makeSut = (): SutTypes => {
  const descrypterStub = makeDecrypter()
  const findByAccessTokenStub = makefindAccessTokenRepo()
  const sut = new DbFindByAccessToken(descrypterStub, findByAccessTokenStub)
  return { sut, findByAccessTokenStub, descrypterStub }
}

describe('find By email Use Case', () => {
  test('should call decrypter with correct value', async () => {
    const { sut, descrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(descrypterStub, 'decrypt')
    await sut.find('any_token')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })
  test('should return null if decrypter returns null', async () => {
    const { sut, descrypterStub } = makeSut()
    jest.spyOn(descrypterStub, 'decrypt').mockReturnValueOnce(Promise.resolve(null))
    const res = await sut.find('any_token')
    expect(res).toBeNull()
  })
  test('should throw if decrypter throws', async () => {
    const { sut, descrypterStub } = makeSut()
    jest.spyOn(descrypterStub, 'decrypt').mockReturnValueOnce(Promise.reject(new Error()))
    const res = sut.find('any_token')
    await expect(res).rejects.toThrow()
  })
  test('should call findByAccessToken with correct value', async () => {
    const { sut, findByAccessTokenStub } = makeSut()
    const findSpy = jest.spyOn(findByAccessTokenStub, 'find')
    await sut.find('any_token')
    expect(findSpy).toHaveBeenCalledWith('any_token')
  })
  test('should return null if findByAccessToken returns null', async () => {
    const { sut, findByAccessTokenStub } = makeSut()
    jest.spyOn(findByAccessTokenStub, 'find').mockReturnValueOnce(Promise.resolve(null))
    const res = await sut.find('any_token')
    expect(res).toBeNull()
  })
  test('should return an account on findByAccessToken succeeds', async () => {
    const { sut } = makeSut()

    const res = await sut.find('any_token')
    expect(res).toEqual(makeFakeAccount())
  })
})
