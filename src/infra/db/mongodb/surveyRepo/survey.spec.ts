import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AddSurveyModel } from '../../../../domain/useCases/add-survey'
import { SurveyRepo } from './survey'

const makeFakeData = (): AddSurveyModel => {
  return {
    question: 'any_question',
    answer: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  }
}

describe('Survey Repo', () => {
  let surveyCollections: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    surveyCollections = await MongoHelper.getCollection('surveys')
    await surveyCollections.deleteMany({})
  })
  test('should create a survey ', async () => {
    const sut = new SurveyRepo()
    await sut.add(makeFakeData())
    const count = await surveyCollections.countDocuments()
    expect(count).toBe(1)
  })
})
