import { DbAddSurvey } from './db-add-survey'
import { AddSurveyRepoSpy } from '../../test/mock-db-Survey'
import { mockSurveyData } from '../../../domain/test/mock-survey'
import MockDate from 'mockdate'

interface SutTypes {
  sut: DbAddSurvey
  addSurveySpy: AddSurveyRepoSpy
}

const makeSut = (): SutTypes => {
  const addSurveySpy = new AddSurveyRepoSpy()
  const sut = new DbAddSurvey(addSurveySpy)

  return { sut, addSurveySpy }
}

describe('DbAddSurvey useCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('should call AddSurveyRepo with correct values', async () => {
    const { sut, addSurveySpy } = makeSut()
    const addSpy = jest.spyOn(addSurveySpy, 'add')
    await sut.add(mockSurveyData())
    expect(addSpy).toHaveBeenCalledWith(mockSurveyData())
  })
  test('should throw if AddSurveyRepo throws', async () => {
    const { sut, addSurveySpy } = makeSut()
    jest.spyOn(addSurveySpy, 'add').mockReturnValueOnce(Promise.reject(new Error()))
    const error = sut.add(mockSurveyData())
    await expect(error).rejects.toThrow()
  })
})
