import { ListSurveysController } from './listSurvey'
import { ok, serverError } from '../../../helpers/http/http-helper'
import { mockSurveyModels } from '../../../../domain/test/mock-survey'
import { ListSurveysSpy } from '../../../test/mock-survey'
import MockDate from 'mockdate'

interface SutTypes {
  listSurveySpy: ListSurveysSpy
  sut: ListSurveysController
}

const makeSut = (): SutTypes => {
  const listSurveySpy = new ListSurveysSpy()
  const sut = new ListSurveysController(listSurveySpy)
  return { sut, listSurveySpy }
}

describe('List surveys', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('should call list surveys', async () => {
    const { sut, listSurveySpy } = makeSut()
    const listSpy = jest.spyOn(listSurveySpy, 'list')
    await sut.handle({})
    expect(listSpy).toHaveBeenCalled()
  })
  test('should return a list of surveys on success', async () => {
    const { sut } = makeSut()
    const result = await sut.handle({})
    expect(result).toEqual(ok(mockSurveyModels()))
  })
  test('should return 500 if listSurvey fails', async () => {
    const { sut, listSurveySpy } = makeSut()
    jest.spyOn(listSurveySpy, 'list').mockImplementationOnce(() => {
      throw new Error()
    })

    const res = await sut.handle({})
    expect(res).toEqual(serverError(new Error()))
  })
})
