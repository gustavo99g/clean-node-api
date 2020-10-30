import app from '../../app'
import request from 'supertest'
import { MongoHelper } from '../../../../infra/db/mongodb/helpers/mongo-helper'

describe('CORS', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    const accountCollections = MongoHelper.getCollection('accounts')
    await accountCollections.deleteMany({})
  })

  test('should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Gustavo',
        email: 'gustavo@gmail.com',
        password: '123',
        passwordConfirmation: '123'
      })
      .expect(200)
  })
})
