import { DbSaveSurveyResult } from './db-save-survey-result'
import { SaveSurveyResultModel } from '../../../domain/useCases/save-survey-result'
import MockDate from 'mockdate'
import { SurveyResultModel } from '../../../domain/models/survey-result'
import { SaveSurveyResultRepo } from '../../protocols/db/save-survey-result'

interface SutTypes {
  sut: DbSaveSurveyResult
  saveSurveyResultStub: SaveSurveyResultRepo
}

const makeSut = (): SutTypes => {
  const saveSurveyResultStub = makeSaveSurveyResultRepo()
  const sut = new DbSaveSurveyResult(saveSurveyResultStub)

  return { sut, saveSurveyResultStub }
}

const makeSaveSurveyResultRepo = (): SaveSurveyResultRepo => {
  class SaveSurveyResultRepoStub implements SaveSurveyResultRepo {
    async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return Promise.resolve(makeFakeSurveyResult())
    }
  }
  return new SaveSurveyResultRepoStub()
}

const makeFakeSurveyResult = (): SurveyResultModel => {
  return {
    id: 'any_id',
    accountId: 'any_accountId',
    surveyId: 'any_surveyId',
    answer: 'any_answer',
    date: new Date()

  }
}
const makeFakeSaveSurveyResult = (): SaveSurveyResultModel => {
  return {
    accountId: 'any_accountId',
    surveyId: 'any_surveyId',
    answer: 'any_answer',
    date: new Date()
  }
}

describe('DbAddSurvey useCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('should call SaveSurveyResultRepo with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    await sut.save(makeFakeSaveSurveyResult())
    expect(saveSpy).toHaveBeenCalledWith(makeFakeSaveSurveyResult())
  })
})
