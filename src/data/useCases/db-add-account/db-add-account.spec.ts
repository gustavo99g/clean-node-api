import { DbAddAccount } from './db-add-account'
import { AddAccountRepo } from '../../protocols/db/add-account-repo'
import { mockAccountData, MockAccountModel } from '../../../domain/test/mock-account'
import { HasherSpy } from '../../test/mock-cryto'
import { FindByEmailRepoSpy, AddAccountRepoSpy } from '../../test/mock-db-account'

interface SutTypes {
  sut: DbAddAccount
  hasherSpy: HasherSpy
  addAccountRepoSpy: AddAccountRepo
  findByEmailRepoSpy: FindByEmailRepoSpy

}

const makeSut = (): SutTypes => {
  const hasherSpy = new HasherSpy()
  const addAccountRepoSpy = new AddAccountRepoSpy()
  const findByEmailRepoSpy = new FindByEmailRepoSpy()
  findByEmailRepoSpy.accountModel = null
  const sut = new DbAddAccount(hasherSpy, addAccountRepoSpy, findByEmailRepoSpy)

  return { sut, hasherSpy, addAccountRepoSpy, findByEmailRepoSpy }
}

describe('DbAddAccount use case', () => {
  test('should call findByEmailRepo with correct email', async () => {
    const { sut, findByEmailRepoSpy } = makeSut()
    const loadSpy = jest.spyOn(findByEmailRepoSpy, 'findByEmail')
    await sut.add(mockAccountData())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
  test('should throw if findByEmailRepo throws', async () => {
    const { sut, findByEmailRepoSpy } = makeSut()
    jest.spyOn(findByEmailRepoSpy, 'findByEmail').mockReturnValueOnce(Promise.reject(new Error()))
    const error = sut.add(mockAccountData())
    await expect(error).rejects.toThrow()
  })
  test('should return null if findByEmail do not return null', async () => {
    const { sut, findByEmailRepoSpy } = makeSut()
    jest.spyOn(findByEmailRepoSpy, 'findByEmail').mockReturnValueOnce(Promise.resolve({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    }))
    const res = await sut.add(mockAccountData())
    expect(res).toBeNull()
  })

  test('Should call hasher with correct password', async () => {
    const { sut, hasherSpy } = makeSut()
    const hashSpy = jest.spyOn(hasherSpy, 'Hash')

    await sut.add(mockAccountData())
    expect(hashSpy).toHaveBeenCalledWith('any_password')
  })
  test('Should throw if hasher throws', async () => {
    const { sut, hasherSpy } = makeSut()
    jest.spyOn(hasherSpy, 'Hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const result = sut.add(mockAccountData())
    await expect(result).rejects.toThrow()
  })
  test('Should call addAccountrepo with correct values', async () => {
    const { sut, addAccountRepoSpy } = makeSut()
    const addSpy = jest.spyOn(addAccountRepoSpy, 'add')

    await sut.add(mockAccountData())
    await expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password'
    })
  })
  test('Should throw if addAccountRepo throws', async () => {
    const { sut, addAccountRepoSpy } = makeSut()
    jest.spyOn(addAccountRepoSpy, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const result = sut.add(mockAccountData())
    await expect(result).rejects.toThrow()
  })
  test('Should return an account on success', async () => {
    const { sut } = makeSut()

    const account = await sut.add(mockAccountData())

    await expect(account).toEqual(MockAccountModel())
  })
})
