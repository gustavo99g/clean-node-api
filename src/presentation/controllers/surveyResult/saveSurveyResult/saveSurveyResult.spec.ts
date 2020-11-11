import { SaveSurveyResultController } from './saveSurveyResult'
import { HttpRequest } from '../../../protocols/http'
import { forbidden, serverError, ok } from '../../../helpers/http/http-helper'
import { InvalidParamError } from '../../../errors/invalid-param-error'
import { SaveSurveyResultSpy } from '../../../test/mock-survey-result'
import { mockSurveyResultModel } from '../../../../domain/test/mock-survey-result'
import { FindByIdSurveySpy } from '../../../test/mock-survey'
import MockDate from 'mockdate'

interface SutTypes {
  sut: SaveSurveyResultController
  findByidSurveySpy: FindByIdSurveySpy
  saveSurveyResultSpy: SaveSurveyResultSpy
}

const makeSut = (): SutTypes => {
  const findByidSurveySpy = new FindByIdSurveySpy()
  const saveSurveyResultSpy = new SaveSurveyResultSpy()
  const sut = new SaveSurveyResultController(findByidSurveySpy, saveSurveyResultSpy)

  return { sut, findByidSurveySpy, saveSurveyResultSpy }
}

const fakeRequest = (): HttpRequest => {
  return {
    params: {
      surveyId: 'any_surveyId'
    },
    body: {
      answer: 'any_answer'
    },
    accountId: 'any_accountId'
  }
}

describe('Save Survey Result controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('should call findSurveyById with correct value', async () => {
    const { sut, findByidSurveySpy } = makeSut()
    const findSpy = jest.spyOn(findByidSurveySpy, 'findById')
    await sut.handle(fakeRequest())
    expect(findSpy).toHaveBeenCalledWith('any_surveyId')
  })

  test('should return 403 if surveyId is invalid', async () => {
    const { sut, findByidSurveySpy } = makeSut()
    jest.spyOn(findByidSurveySpy, 'findById').mockReturnValue(Promise.resolve(null))
    const res = await sut.handle(fakeRequest())
    expect(res).toEqual(forbidden(new InvalidParamError('SurveyId')))
  })
  test('should return 500 if FindById fails', async () => {
    const { sut, findByidSurveySpy } = makeSut()
    jest.spyOn(findByidSurveySpy, 'findById').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = fakeRequest()
    const res = await sut.handle(httpRequest)
    expect(res).toEqual(serverError(new Error()))
  })
  test('should return 403 if invalid answer provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      params: {
        surveyId: 'any_survey_id'
      },
      body: {
        answer: 'wrong_answer'
      }
    }
    const res = await sut.handle(httpRequest)
    expect(res).toEqual(forbidden(new InvalidParamError('Answer')))
  })
  test('should call saveSurveyResult with correct value', async () => {
    const { sut, saveSurveyResultSpy } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultSpy, 'save')
    await sut.handle(fakeRequest())
    expect(saveSpy).toHaveBeenCalledWith({
      surveyId: 'any_surveyId',
      accountId: 'any_accountId',
      date: new Date(),
      answer: 'any_answer'
    })
  })
  test('should return 500 if saveSurveyResult throw', async () => {
    const { sut, saveSurveyResultSpy } = makeSut()
    jest.spyOn(saveSurveyResultSpy, 'save').mockImplementationOnce(() => {
      throw new Error()
    })

    const res = await sut.handle({})
    expect(res).toEqual(serverError(new Error()))
  })
  test('should return 200 on success', async () => {
    const { sut } = makeSut()

    const res = await sut.handle(fakeRequest())
    expect(res).toEqual(ok(mockSurveyResultModel()))
  })
})
