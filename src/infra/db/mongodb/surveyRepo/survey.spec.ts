import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AddSurveyModel } from '../../../../domain/useCases/add-survey'
import { SurveyRepo } from './survey'

const makeFakeData = (): AddSurveyModel => {
  return {
    question: 'any_question',
    answers: [{
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
  test('should return all the surveys in DB', async () => {
    const sut = new SurveyRepo()
    await sut.add(makeFakeData())
    await sut.add(makeFakeData())
    const surveys = await sut.list()
    expect(surveys.length).toBe(2)
  })
  test('should return a empty array of theres no data in DB', async () => {
    const sut = new SurveyRepo()
    const surveys = await sut.list()
    expect(surveys.length).toBe(0)
  })
  test('should find a survey by Id on success', async () => {
    const sut = new SurveyRepo()
    const result = await surveyCollections.insertOne(makeFakeData())
    const id = result.ops[0]._id
    const surveys = await sut.findById(id)
    expect(surveys).toBeTruthy()
  })
})
