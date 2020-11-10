import { SaveSurveyResultController } from './saveSurveyResult'
import { HttpRequest } from '../../../protocols/http'
import { FindSurveyByID } from '../../../../domain/useCases/find-survey-by-id'
import { SurveyModel } from '../../../../domain/models/survey'
import { forbidden } from '../../../helpers/http/http-helper'

interface SutTypes {
  sut: SaveSurveyResultController
  findByidSurveyStub: FindSurveyByID
}

const makeSut = (): SutTypes => {
  const findByidSurveyStub = makeFindByIdSurvey()
  const sut = new SaveSurveyResultController(findByidSurveyStub)

  return { sut, findByidSurveyStub }
}
const makeFindByIdSurvey = (): FindSurveyByID => {
  class FindByIdSurveyStub implements FindSurveyByID {
    async findById (id: string): Promise<SurveyModel | null> {
      return {
        id: 'any_id',
        question: 'any_question',
        answers: [
          {
            image: 'any_image',
            answer: 'any_answer'
          },
          { answer: 'other_answer' }
        ],
        date: new Date()
      }
    }
  }
  return new FindByIdSurveyStub()
}

const fakeRequest = (): HttpRequest => {
  return {
    params: {
      surveyId: 'any_surveyId'
    }
  }
}

describe('Save Survey Result controller', () => {
  test('should call findSurveyById with correct value', async () => {
    const { sut, findByidSurveyStub } = makeSut()
    const findSpy = jest.spyOn(findByidSurveyStub, 'findById')
    await sut.handle(fakeRequest())
    expect(findSpy).toHaveBeenCalledWith('any_surveyId')
  })

  test('should return 403 if surveyId is invalid', async () => {
    const { sut, findByidSurveyStub } = makeSut()
    jest.spyOn(findByidSurveyStub, 'findById').mockReturnValue(Promise.resolve(null))
    const res = await sut.handle(fakeRequest())
    expect(res).toEqual(forbidden(new Error()))
  })
})
