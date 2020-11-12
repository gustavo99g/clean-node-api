import { HttpRequest } from '../../../protocols/http'
import { LoadSurveyController } from './loadSurveyResult'
import { FindByIdSurveySpy } from '../../../test/mock-survey'
import { forbidden, serverError, ok } from '../../../helpers/http/http-helper'
import { InvalidParamError } from '../../../errors/invalid-param-error'
import { LoadSurveyResultSpy } from '../../../test/mock-survey-result'
import { mockSurveyResultModel } from '../../../../domain/test/mock-survey-result'

interface SutTypes {
  sut: LoadSurveyController
  findSurveyByIdSpy: FindByIdSurveySpy
  loadSurveyResultSpy: LoadSurveyResultSpy
}

const makeSut = (): SutTypes => {
  const findSurveyByIdSpy = new FindByIdSurveySpy()
  const loadSurveyResultSpy = new LoadSurveyResultSpy()
  const sut = new LoadSurveyController(findSurveyByIdSpy, loadSurveyResultSpy)

  return { sut, findSurveyByIdSpy, loadSurveyResultSpy }
}

const fakeRequest = (): HttpRequest => {
  return {
    params: {
      surveyId: 'any_surveyId'
    }
  }
}
describe('load Survey Controller', () => {
  test('should call findSurveyById with correct values', async () => {
    const { sut, findSurveyByIdSpy } = makeSut()
    const findSpy = jest.spyOn(findSurveyByIdSpy, 'findById')
    await sut.handle(fakeRequest())
    expect(findSpy).toHaveBeenCalledWith('any_surveyId')
  })
  test('should return 403 if surveyId is invalid', async () => {
    const { sut, findSurveyByIdSpy } = makeSut()
    jest.spyOn(findSurveyByIdSpy, 'findById').mockReturnValue(Promise.resolve(null))
    const res = await sut.handle(fakeRequest())
    expect(res).toEqual(forbidden(new InvalidParamError('SurveyId')))
  })
  test('should throw if findSurveyById throws', async () => {
    const { sut, findSurveyByIdSpy } = makeSut()
    jest.spyOn(findSurveyByIdSpy, 'findById').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = fakeRequest()
    const res = await sut.handle(httpRequest)
    expect(res).toEqual(serverError(new Error()))
  })
  test('should call loadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultSpy } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultSpy, 'load')
    await sut.handle(fakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_surveyId')
  })
  test('should throw if loadSurveyResult throws', async () => {
    const { sut, loadSurveyResultSpy } = makeSut()
    jest.spyOn(loadSurveyResultSpy, 'load').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = fakeRequest()
    const res = await sut.handle(httpRequest)
    expect(res).toEqual(serverError(new Error()))
  })
  test('should 200 on success', async () => {
    const { sut } = makeSut()
    const res = await sut.handle(fakeRequest())
    expect(res).toEqual(ok(mockSurveyResultModel()))
  })
})
