import { DbAddAccount } from './db-add-account'
import { Hasher } from '../../protocols/crypto/hasher'
import { AddAccountModel } from '../../../domain/useCases/add-account'
import { AccountModel } from '../../../domain/models/account'
import { AddAccountRepo } from '../../protocols/db/add-account-repo'
import { findByEmailRepo } from '../../protocols/db/find-by_email-repo'

interface SutTypes {
  sut: DbAddAccount
  hasherSub: Hasher
  AddAccountRepoStub: AddAccountRepo
  findByEmailRepoStub: findByEmailRepo
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
const makefindByEmailRepo = (): findByEmailRepo => {
  class FindByEmailRepoStub implements findByEmailRepo {
    async findByEmail (email: string): Promise<AccountModel> {
      const account = {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'hashed_password'
      }
      return Promise.resolve(account)
    }
  }
  return new FindByEmailRepoStub()
}

const makeSut = (): SutTypes => {
  const hasherSub = makehash()
  const AddAccountRepoStub = makeAddAccountRepo()
  const findByEmailRepoStub = makefindByEmailRepo()
  const sut = new DbAddAccount(hasherSub, AddAccountRepoStub, findByEmailRepoStub)

  return { sut, hasherSub, AddAccountRepoStub, findByEmailRepoStub }
}
const makeFakeData = (): AddAccountModel => {
  return {

    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  }
}

describe('DbAddAccount use case', () => {
  test('should call findByEmailRepo with correct email', async () => {
    const { sut, findByEmailRepoStub } = makeSut()
    const loadSpy = jest.spyOn(findByEmailRepoStub, 'findByEmail')
    await sut.add(makeFakeData())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
  test('Should call hasher with correct password', async () => {
    const { sut, hasherSub } = makeSut()
    const hashSpy = jest.spyOn(hasherSub, 'Hash')

    await sut.add(makeFakeData())
    expect(hashSpy).toHaveBeenCalledWith('any_password')
  })
  test('Should throw if hasher throws', async () => {
    const { sut, hasherSub } = makeSut()
    jest.spyOn(hasherSub, 'Hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const result = sut.add(makeFakeData())
    await expect(result).rejects.toThrow()
  })
  test('Should call addAccountrepo with correct values', async () => {
    const { sut, AddAccountRepoStub } = makeSut()
    const addSpy = jest.spyOn(AddAccountRepoStub, 'add')

    await sut.add(makeFakeData())
    await expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password'
    })
  })
  test('Should throw if addAccountRepo throws', async () => {
    const { sut, AddAccountRepoStub } = makeSut()
    jest.spyOn(AddAccountRepoStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const result = sut.add(makeFakeData())
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
