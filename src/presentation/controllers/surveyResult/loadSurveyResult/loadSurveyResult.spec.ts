import { HttpRequest } from '../../../protocols/http'
import { LoadSurveyController } from './loadSurveyResult'
import { FindByIdSurveySpy } from '../../../test/mock-survey'
import { forbidden, serverError } from '../../../helpers/http/http-helper'
import { InvalidParamError } from '../../../errors/invalid-param-error'

interface SutTypes {
  sut: LoadSurveyController
  findSurveyByIdSpy: FindByIdSurveySpy
}

const makeSut = (): SutTypes => {
  const findSurveyByIdSpy = new FindByIdSurveySpy()
  const sut = new LoadSurveyController(findSurveyByIdSpy)

  return { sut, findSurveyByIdSpy }
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
})
