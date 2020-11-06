import { DbFindByAccessToken } from './db-find-by-accessToken'
import { findByAccessTokenRepo } from '../../protocols/db/find-by-access-token-repo'
import { AccountModel } from '../../../domain/models/account'
import { Decrypter } from '../../protocols/crypto/token-decrypter'

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (token: string): Promise<string> {
      return Promise.resolve('any_id')
    }
  }
  return new DecrypterStub()
}

const makefindAccessTokenRepo = (): findByAccessTokenRepo => {
  class FindByAccessTokenStub implements findByAccessTokenRepo {
    async find (token: string, role?: string): Promise<AccountModel | null> {
      return Promise.resolve({
        id: 'any_id',
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      })
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
  const sut = new DbFindByAccessToken(descrypterStub)
  return { sut, findByAccessTokenStub, descrypterStub }
}

describe('find By email Use Case', () => {
  test('should call decrypter with correct value', async () => {
    const { sut, descrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(descrypterStub, 'decrypt')
    await sut.find('any_token')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })
})
