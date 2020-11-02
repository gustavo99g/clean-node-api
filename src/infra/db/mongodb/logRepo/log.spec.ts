import { MongoHelper } from '../helpers/mongo-helper'
import { Collection } from 'mongodb'
import { LogMongoRepo } from './log'

describe('Account mongo repository', () => {
  let errorCollections: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    errorCollections = await MongoHelper.getCollection('errors')
    await errorCollections.deleteMany({})
  })
  test('should create an error log on success ', async () => {
    const sut = new LogMongoRepo()
    await sut.logError('any_error')
    const count = await errorCollections.countDocuments()

    expect(count).toBe(1)
  })
})
