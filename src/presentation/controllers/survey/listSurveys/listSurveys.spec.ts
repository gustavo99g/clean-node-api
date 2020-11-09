import { SurveyModel } from '../../../../domain/models/survey'
import { ListSurveysController } from './listSurvey'
import { ListSurveys } from '../../../../domain/useCases/list-survey'

const makeFakeSurveys = (): SurveyModel[] => {
  const surveys = [{
    id: 'any_id',
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }
    ]
  },
  {
    id: 'any_id',
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }
    ]
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

const makeSut = (): any => {
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
})
