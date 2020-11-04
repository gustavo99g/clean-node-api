import { DbAddAccount } from './db-add-account'
import { Hasher } from '../../protocols/crypto/hasher'
import { AddAccountModel } from '../../../domain/useCases/add-account'
import { AccountModel } from '../../../domain/models/account'
import { AddAccountRepo } from '../../protocols/db/add-account-repo'

interface SutTypes {
  sut: DbAddAccount
  hasherSub: Hasher
  AddAccountRepoStub: AddAccountRepo
}
const makehash = (): Hasher => {
  class Hasherstub implements Hasher {
    async Hash (value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new Hasherstub()
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
  const hasherSub = makehash()
  const AddAccountRepoStub = makeAddAccountRepo()
  const sut = new DbAddAccount(hasherSub, AddAccountRepoStub)

  return { sut, hasherSub, AddAccountRepoStub }
}

describe('DbAddAccount use case', () => {
  test('Should call hasher with correct password', async () => {
    const { sut, hasherSub } = makeSut()
    const hashSpy = jest.spyOn(hasherSub, 'Hash')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(hashSpy).toHaveBeenCalledWith('valid_password')
  })
  test('Should throw if hasher throws', async () => {
    const { sut, hasherSub } = makeSut()
    jest.spyOn(hasherSub, 'Hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
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
