import app from '../config/app'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'

describe('SURVEY ROUTES', () => {
  let surveyCollections: Collection
  let accountCollections: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    surveyCollections = await MongoHelper.getCollection('accounts')
    await surveyCollections.deleteMany({})
    accountCollections = await MongoHelper.getCollection('accounts')
    await accountCollections.deleteMany({})
  })
  test('should return 403 if user without access token', async () => {
    await request(app)
      .post('/api/survey')
      .send({
        question: 'Qual a melhor linguagem',
        answer: [{
          image: 'any_image',
          answers: 'Javascript'
        },
        {
          image: 'any_image',
          answers: 'C sharp'
        }
        ]
      })
      .expect(403)
  })
  test('should return 204 with  valid access token', async () => {
    const res = await accountCollections.insertOne({
      name: 'Gustavo',
      email: 'gustavo2@gmail.com',
      password: 'hashPassword',
      role: 'admin'

    })

    const id = res.ops[0]._id
    const accessToken = sign({ id }, 'secret')

    await accountCollections.updateOne({ _id: id }, {
      $set: {
        accessToken
      }
    })

    await request(app)
      .post('/api/survey')
      .set('x-access-token', accessToken)
      .send({
        question: 'Qual a melhor linguagem',
        answer: [{
          image: 'any_image',
          answers: 'Javascript'
        },
        {
          image: 'any_image',
          answers: 'C sharp'
        }
        ]

      })
      .expect(204)
  })
})
