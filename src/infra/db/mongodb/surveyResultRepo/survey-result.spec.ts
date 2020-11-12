import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyResultRepo } from './survey-result'
import { SurveyModel } from '../../../../domain/models/survey'
import { AccountModel } from '../../../../domain/models/account'

let surveyCollections: Collection
let surveyResultCollections: Collection
let accountCollections: Collection

const makeSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollections.insertOne({
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }, { answer: 'other_answer' }
    ],
    date: new Date()
  })

  return MongoHelper.map(res.ops[0])
}

const makeAccount = async (): Promise<AccountModel> => {
  const res = await accountCollections.insertOne({
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password'
  })
  return MongoHelper.map(res.ops[0])
}

describe('Survey Result Repo', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    surveyCollections = await MongoHelper.getCollection('surveys')
    await surveyCollections.deleteMany({})
    surveyResultCollections = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollections.deleteMany({})
    accountCollections = await MongoHelper.getCollection('accounts')
    await accountCollections.deleteMany({})
  })
  describe('Save', () => {
    test('should create a survey result if its new ', async () => {
      const sut = new SurveyResultRepo()
      const survey = await makeSurvey()
      const account = await makeAccount()
      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(survey.id)
      expect(surveyResult.answers[0].count).toBe(1)
      expect(surveyResult.answers[0].percent).toBe(100)
    })
    test('should update a survey result if its not new ', async () => {
      const sut = new SurveyResultRepo()
      const survey = await makeSurvey()
      const account = await makeAccount()
      await surveyResultCollections.insertOne({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        date: new Date()
      })

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.answers[0].count).toBe(1)
      expect(surveyResult.answers[0].percent).toBe(100)
    })
  })
  describe('LoadBySurveyId', () => {
    test('should load a surveyResult', async () => {
      const sut = new SurveyResultRepo()
      const survey = await makeSurvey()
      const account = await makeAccount()
      await surveyResultCollections.insertMany([{
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      }, {
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        date: new Date()
      }])
      const surveyResult = await sut.load(survey.id)

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.answers[0].count).toBe(1)
      expect(surveyResult.answers[0].percent).toBe(50)
      expect(surveyResult.answers[1].count).toBe(1)
      expect(surveyResult.answers[1].percent).toBe(50)
    })
  })
})
