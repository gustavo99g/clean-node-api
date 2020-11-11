import { DbSaveSurveyResult } from './db-save-survey-result'
import { mockSurverResultData, mockSurveyModel } from '../../../domain/test/mock-survey-result'
import { SaveSurveyResultRepoSpy } from '../../test/mock-db-survey-result'
import MockDate from 'mockdate'

interface SutTypes {
  sut: DbSaveSurveyResult
  saveSurveyResultSpy: SaveSurveyResultRepoSpy
}

const makeSut = (): SutTypes => {
  const saveSurveyResultSpy = new SaveSurveyResultRepoSpy()
  const sut = new DbSaveSurveyResult(saveSurveyResultSpy)

  return { sut, saveSurveyResultSpy }
}

describe('DbAddSurvey useCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('should call SaveSurveyResultRepo with correct values', async () => {
    const { sut, saveSurveyResultSpy } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultSpy, 'save')
    await sut.save(mockSurverResultData())
    expect(saveSpy).toHaveBeenCalledWith(mockSurverResultData())
  })
  test('should return a survey on success', async () => {
    const { sut } = makeSut()
    const result = await sut.save(mockSurverResultData())
    expect(result).toEqual(mockSurveyModel())
  })
  test('should throw if saveSurveyRepo throws', async () => {
    const { sut, saveSurveyResultSpy } = makeSut()
    jest.spyOn(saveSurveyResultSpy, 'save').mockReturnValueOnce(Promise.reject(new Error()))
    const res = sut.save(mockSurverResultData())
    await expect(res).rejects.toThrow()
  })
})
