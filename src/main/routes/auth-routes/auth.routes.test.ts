import app from '../../config/app'
import request from 'supertest'
import { MongoHelper } from '../../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import bcrypt from 'bcryptjs'

let accountCollections: Collection

describe('Auth Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    accountCollections = await MongoHelper.getCollection('accounts')
    await accountCollections.deleteMany({})
  })
  describe('POST /SIGNUP', () => {
    test('should return 200 on success', async () => {
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

  describe('POST /LOGIN', () => {
    test('should return 200 on success', async () => {
      const hashPassword = await bcrypt.hash('123', 8)
      await accountCollections.insertOne({
        name: 'Gustavo',
        email: 'gustavo@gmail.com',
        password: hashPassword
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'gustavo@gmail.com',
          password: '123'
        })
        .expect(200)
    })
    test('should return 401 if invalid credentials provided ', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'gustavo@gmail.com',
          password: '123'
        })
        .expect(401)
    })
  })
})
