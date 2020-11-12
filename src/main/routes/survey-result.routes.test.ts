import app from '../config/app'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'

let surveyCollections: Collection
let accountCollections: Collection

const mockAccessToken = async (): Promise<string> => {
  const res = await accountCollections.insertOne({
    name: 'Gustavo',
    email: 'gustavo2@gmail.com',
    password: 'hashPassword'

  })

  const id = res.ops[0]._id
  const accessToken = sign({ id }, 'secret')

  await accountCollections.updateOne({ _id: id }, {
    $set: {
      accessToken
    }
  })
  return accessToken
}

const mockSurvey = async (): Promise<string> => {
  const res = await surveyCollections.insertOne({
    question: 'Qual a melhor linguagem',
    answers: [{
      image: 'any_image',
      answer: 'Javascript'
    },
    {
      image: 'any_image',
      answer: 'C sharp'
    }
    ],
    date: new Date()

  })
  return res.ops[0]._id
}

describe('SURVEY ROUTES', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    surveyCollections = await MongoHelper.getCollection('surveys')
    await surveyCollections.deleteMany({})
    accountCollections = await MongoHelper.getCollection('accounts')
    await accountCollections.deleteMany({})
  })
  describe('PUT /survey/:surveyId/results', () => {
    test('should return 403 on save survey result without access token', async () => {
      await request(app)
        .put('/api/survey/any_id/results')
        .send()
        .expect(403)
    })
    test('should return 200 on success with access token', async () => {
      const id = await mockSurvey()

      const accessToken = await mockAccessToken()
      await request(app)
        .put(`/api/survey/${id}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'C sharp'
        })
        .expect(200)
    })
  })
  describe('GET /survey/:surveyId/results', () => {
    test('should return 403 on save survey result without access token', async () => {
      await request(app)
        .get('/api/survey/any_id/results')
        .send()
        .expect(403)
    })
    test('should return 200 on success with access token', async () => {
      const id = await mockSurvey()

      const accessToken = await mockAccessToken()
      await request(app)
        .get(`/api/survey/${id}/results`)
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
