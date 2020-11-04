import { MongoHelper } from '../helpers/mongo-helper'
import { AccountRepo } from './account'
import { AddAccountModel } from '../../../../domain/useCases/add-account'

describe('Account mongo repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    const accountCollections = await MongoHelper.getCollection('accounts')
    await accountCollections.deleteMany({})
  })

  const makeFakeAccount = (): AddAccountModel => {
    return {
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    }
  }

  test('should return an account on add success', async () => {
    const sut = new AccountRepo()
    const account = await sut.add(makeFakeAccount())
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@email.com')
    expect(account.password).toBe('any_password')
  })
  test('should return an account on findByEmail success', async () => {
    const sut = new AccountRepo()
    await sut.add(makeFakeAccount())
    const account = await sut.findByEmail('any_email@email.com')
    expect(account).toBeTruthy()
    expect(account?.id).toBeTruthy()
    expect(account?.name).toBe('any_name')
    expect(account?.email).toBe('any_email@email.com')
    expect(account?.password).toBe('any_password')
  })

  test('should return null if findByEmail dont find a account', async () => {
    const sut = new AccountRepo()

    const account = await sut.findByEmail('invalid_email@email.com')
    expect(account).toBeNull()
  })
})
