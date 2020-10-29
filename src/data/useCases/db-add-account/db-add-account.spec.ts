import { DbAddAccount } from './db-add-account'
import { Encrypter } from '../../protocols/encrypter'
import { AddAccountModel } from '../../../domain/useCases/add-account'
import { AccountModel } from '../../../domain/models/account'
import { AddAccountRepo } from '../../protocols/add-account-repo'

interface SutTypes {
  sut: DbAddAccount
  encrypterSub: Encrypter
  AddAccountRepoStub: AddAccountRepo
}
const makeEncrypt = (): Encrypter => {
  class Encrypterstub {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new Encrypterstub()
}
const makeAddAccountRepo = (): AddAccountRepo => {
  class AddAccountRepoStub implements AddAccountRepo {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'hashed_password'
      }
      return new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new AddAccountRepoStub()
}

const makeSut = (): SutTypes => {
  const encrypterSub = makeEncrypt()
  const AddAccountRepoStub = makeAddAccountRepo()
  const sut = new DbAddAccount(encrypterSub, AddAccountRepoStub)

  return { sut, encrypterSub, AddAccountRepoStub }
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
  test('Should call addAccountrepo with correct values', async () => {
    const { sut, AddAccountRepoStub } = makeSut()
    const addSpy = jest.spyOn(AddAccountRepoStub, 'add')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await sut.add(accountData)
    await expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })
  test('Should throw if addAccountRepo throws', async () => {
    const { sut, AddAccountRepoStub } = makeSut()
    jest.spyOn(AddAccountRepoStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const result = sut.add(accountData)
    await expect(result).rejects.toThrow()
  })
  test('Should return an account on success', async () => {
    const { sut } = makeSut()

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const account = await sut.add(accountData)
    await expect(account).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })
})
