import { SurveyResultModel } from '../../../domain/models/survey-result'
import { mockSurveyResultModel } from '../../../domain/test/mock-survey-result'
import { LoadSurveyResultRepo } from '../../../data/protocols/db/load-survey-result-repo'
import { DbLoadSurveyResult } from './db-load-survey-result'

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
  test('should call loadSurveyResultRepo with correct values', async () => {
    const { sut, loadSurveyResultRepoSpy } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultRepoSpy, 'load')
    await sut.load('any_surveyId')
    expect(loadSpy).toHaveBeenCalledWith('any_surveyId')
  })
})
