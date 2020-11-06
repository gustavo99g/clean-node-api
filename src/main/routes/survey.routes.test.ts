import app from '../config/app'

import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

describe('SURVEY ROUTES', () => {
  let surveyCollections
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    surveyCollections = await MongoHelper.getCollection('survey')
    await surveyCollections.deleteMany({})
  })
  test('should return 403 if user is not admin', async () => {
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
})
