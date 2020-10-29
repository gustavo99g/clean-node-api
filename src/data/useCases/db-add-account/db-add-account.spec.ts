import { DbAddAccount } from './db-add-account'

const makeEncrypt = (): any => {
  class Encrypterstub {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new Encrypterstub()
}

const makeSut = (): any => {
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
})
