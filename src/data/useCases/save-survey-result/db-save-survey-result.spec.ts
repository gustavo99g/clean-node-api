import { DbSaveSurveyResult } from './db-save-survey-result'
import { mockSurverResultData, mockSurveyResultModel } from '../../../domain/test/mock-survey-result'
import { SaveSurveyResultRepoSpy, LoadSurveyResultSpy } from '../../test/mock-db-survey-result'

import MockDate from 'mockdate'

interface SutTypes {
  sut: DbSaveSurveyResult
  saveSurveyResultSpy: SaveSurveyResultRepoSpy
  loadSurveyResultByIdSpy: LoadSurveyResultSpy
}

const makeSut = (): SutTypes => {
  const saveSurveyResultSpy = new SaveSurveyResultRepoSpy()
  const loadSurveyResultByIdSpy = new LoadSurveyResultSpy()
  const sut = new DbSaveSurveyResult(saveSurveyResultSpy, loadSurveyResultByIdSpy)

  return { sut, saveSurveyResultSpy, loadSurveyResultByIdSpy }
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
  test('should call LoadSurveyResultByIdRepo with correct values', async () => {
    const { sut, loadSurveyResultByIdSpy } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultByIdSpy, 'load')
    await sut.save(mockSurverResultData())
    expect(loadSpy).toHaveBeenCalledWith('any_surveyId')
  })
  test('should return a survey on success', async () => {
    const { sut } = makeSut()
    const result = await sut.save(mockSurverResultData())
    expect(result).toEqual(mockSurveyResultModel())
  })
  test('should throw if saveSurveyRepo throws', async () => {
    const { sut, saveSurveyResultSpy } = makeSut()
    jest.spyOn(saveSurveyResultSpy, 'save').mockReturnValueOnce(Promise.reject(new Error()))
    const res = sut.save(mockSurverResultData())
    await expect(res).rejects.toThrow()
  })
})
