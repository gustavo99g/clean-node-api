import { SurveyModel } from '../../../../domain/models/survey'
import { ListSurveysController } from './listSurvey'
import { ListSurveys } from '../../../../domain/useCases/list-survey'
import { ok, serverError } from '../../../helpers/http/http-helper'

const makeFakeSurveys = (): SurveyModel[] => {
  const surveys = [{
    id: 'any_id',
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }
    ],
    date: new Date()
  },
  {
    id: 'any_id',
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }
    ],
    date: new Date()
  }
  ]
  return surveys
}

const makeListSurveys = (): ListSurveys => {
  class ListSurveysStub implements ListSurveys {
    async list (): Promise<SurveyModel[]> {
      return Promise.resolve(makeFakeSurveys())
    }
  }
  return new ListSurveysStub()
}

interface SutTypes {
  listSurveyStub: ListSurveys
  sut: ListSurveysController
}

const makeSut = (): SutTypes => {
  const listSurveyStub = makeListSurveys()
  const sut = new ListSurveysController(listSurveyStub)
  return { sut, listSurveyStub }
}

describe('List surveys', () => {
  test('should call list surveys', async () => {
    const { sut, listSurveyStub } = makeSut()
    const listSpy = jest.spyOn(listSurveyStub, 'list')
    await sut.handle({})
    expect(listSpy).toHaveBeenCalled()
  })
  test('should return a list of surveys on success', async () => {
    const { sut } = makeSut()
    const result = await sut.handle({})
    expect(result).toEqual(ok(makeFakeSurveys()))
  })
  test('should return 500 if listSurvey fails', async () => {
    const { sut, listSurveyStub } = makeSut()
    jest.spyOn(listSurveyStub, 'list').mockImplementationOnce(() => {
      throw new Error()
    })

    const res = await sut.handle({})
    expect(res).toEqual(serverError(new Error()))
  })
})
