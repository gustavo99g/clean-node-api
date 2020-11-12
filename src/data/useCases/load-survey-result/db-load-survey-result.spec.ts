import { SurveyResultModel } from '../../../domain/models/survey-result'
import { mockSurveyResultModel } from '../../../domain/test/mock-survey-result'
import { LoadSurveyResultRepo } from '../../../data/protocols/db/load-survey-result-repo'
import { DbLoadSurveyResult } from './db-load-survey-result'
import MockDate from 'mockdate'

const makeLoadSurveyResultRepo = (): LoadSurveyResultRepo => {
  class LoadSurveyResultRepoSpy implements LoadSurveyResultRepo {
    async load (surveyId: string): Promise<SurveyResultModel> {
      return Promise.resolve(mockSurveyResultModel())
    }
  }
  return new LoadSurveyResultRepoSpy()
}

const makeSut = (): any => {
  const loadSurveyResultRepoSpy = makeLoadSurveyResultRepo()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepoSpy)
  return { sut, loadSurveyResultRepoSpy }
}

describe('Load survey Result', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('should call loadSurveyResultRepo with correct values', async () => {
    const { sut, loadSurveyResultRepoSpy } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultRepoSpy, 'load')
    await sut.load('any_surveyId')
    expect(loadSpy).toHaveBeenCalledWith('any_surveyId')
  })
  test('should return a LoadSurveyResult on success', async () => {
    const { sut } = makeSut()
    const res = await sut.load('any_surveyId')
    expect(res).toEqual(mockSurveyResultModel())
  })
  test('should throw if LoadSurveyResultRepo throws', async () => {
    const { sut, loadSurveyResultRepoSpy } = makeSut()
    jest.spyOn(loadSurveyResultRepoSpy, 'load').mockReturnValueOnce(Promise.reject(new Error()))
    const res = sut.load('any_surveyId')
    await expect(res).rejects.toThrow()
  })
})
