import { HttpRequest } from '../../../protocols/http'
import { LoadSurveyController } from './loadSurveyResult'
import { FindByIdSurveySpy } from '../../../test/mock-survey'

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
  test('should call loadSurveyById with correct values', async () => {
    const { sut, findSurveyByIdSpy } = makeSut()
    const findSpy = jest.spyOn(findSurveyByIdSpy, 'findById')
    await sut.handle(fakeRequest())
    expect(findSpy).toHaveBeenCalledWith('any_surveyId')
  })
})
