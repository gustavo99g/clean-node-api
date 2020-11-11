import { DbFindByIdSurvey } from './db-find-survey-by-id'
import { mockSurveyModel } from '../../../domain/test/mock-survey'
import { FindByIdSurveyRepoSpy } from '../../test/mock-db-Survey'
import MockDate from 'mockdate'

interface SutTypes {
  findByIdSurveyRepoSpy: FindByIdSurveyRepoSpy
  sut: DbFindByIdSurvey
}

const makeSut = (): SutTypes => {
  const findByIdSurveyRepoSpy = new FindByIdSurveyRepoSpy()
  const sut = new DbFindByIdSurvey(findByIdSurveyRepoSpy)

  return { sut, findByIdSurveyRepoSpy }
}
describe('Db find by id survey', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('should call findBy Id repo with correct value', async () => {
    const { findByIdSurveyRepoSpy, sut } = makeSut()
    const findSpy = jest.spyOn(findByIdSurveyRepoSpy, 'findById')
    await sut.findById('any_id')
    expect(findSpy).toHaveBeenCalledWith('any_id')
  })
  test('should return a survey on success', async () => {
    const { sut } = makeSut()
    const result = await sut.findById('any_id')
    expect(result).toEqual(mockSurveyModel())
  })
  test('should throw if findByIdSurveyRepo throws', async () => {
    const { sut, findByIdSurveyRepoSpy } = makeSut()
    jest.spyOn(findByIdSurveyRepoSpy, 'findById').mockReturnValueOnce(Promise.reject(new Error()))
    const res = sut.findById('any_id')
    await expect(res).rejects.toThrow()
  })
})
