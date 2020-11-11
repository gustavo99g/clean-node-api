import { DbListSurvey } from './db-list-surveys'
import { mockSurveyModels } from '../../../domain/test/mock-survey'
import { ListSurveyRepoSpy } from '../../test/mock-db-Survey'
import MockDate from 'mockdate'

interface SutTypes {
  listSurveyRepoSpy: ListSurveyRepoSpy
  sut: DbListSurvey
}
const makeSut = (): SutTypes => {
  const listSurveyRepoSpy = new ListSurveyRepoSpy()
  const sut = new DbListSurvey(listSurveyRepoSpy)

  return { sut, listSurveyRepoSpy }
}
describe('DbListSurvey', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('should call listSurvey repo', async () => {
    const { listSurveyRepoSpy, sut } = makeSut()
    const listSpy = jest.spyOn(listSurveyRepoSpy, 'list')
    await sut.list()
    expect(listSpy).toHaveBeenCalled()
  })
  test('should return a list of surveys on success', async () => {
    const { sut } = makeSut()
    const result = await sut.list()
    expect(result).toEqual(mockSurveyModels())
  })
  test('should throw if listSurvey throws', async () => {
    const { sut, listSurveyRepoSpy } = makeSut()
    jest.spyOn(listSurveyRepoSpy, 'list').mockReturnValueOnce(Promise.reject(new Error()))
    const res = sut.list()
    await expect(res).rejects.toThrow()
  })
})
