import app from '../config/app'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

describe('SURVEY ROUTES', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('PUT /survey/:surveyId/results', () => {
    test('should return 403 on save survey result without access token', async () => {
      await request(app)
        .put('/api/survey/any_id/results')
        .send()
        .expect(403)
    })
  })
})
