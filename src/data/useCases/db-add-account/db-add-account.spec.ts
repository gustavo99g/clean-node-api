import { DbAddAccount } from './db-add-account'
import { Encrypter } from '../../protocols/encrypter'

interface SutTypes {
  sut: DbAddAccount
  encrypterSub: Encrypter
}
const makeEncrypt = (): Encrypter => {
  class Encrypterstub {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new Encrypterstub()
}

const makeSut = (): SutTypes => {
  const encrypterSub = makeEncrypt()
  const sut = new DbAddAccount(encrypterSub)
  return { sut, encrypterSub }
}

describe('DbAddAccount use case', () => {
  test('Should call encrypter with correct password', async () => {
    const { sut, encrypterSub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterSub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
  test('Should throw if encrypter throws', async () => {
    const { sut, encrypterSub } = makeSut()
    jest.spyOn(encrypterSub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const result = sut.add(accountData)
    await expect(result).rejects.toThrow()
  })
})
