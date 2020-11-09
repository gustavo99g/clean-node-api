import { SurveyModel } from '../../../domain/models/survey'
import { listSurveysRepo } from '../../protocols/db/list-survey-repo'
import { DbListSurvey } from './db-list-surveys'

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

const makeListSurveyRepo = (): listSurveysRepo => {
  class ListSurveyRepoStub implements listSurveysRepo {
    async list (): Promise<SurveyModel[]> {
      return Promise.resolve(makeFakeSurveys())
    }
  }
  return new ListSurveyRepoStub()
}

interface SutTypes {
  listSurveyRepoStub: listSurveysRepo
  sut: DbListSurvey
}
const makeSut = (): SutTypes => {
  const listSurveyRepoStub = makeListSurveyRepo()
  const sut = new DbListSurvey(listSurveyRepoStub)

  return { sut, listSurveyRepoStub }
}
describe('DbListSurvey', () => {
  test('should call listSurvey repo', async () => {
    const { listSurveyRepoStub, sut } = makeSut()
    const listSpy = jest.spyOn(listSurveyRepoStub, 'list')
    await sut.list()
    expect(listSpy).toHaveBeenCalled()
  })
  test('should return a list of surveys on success', async () => {
    const { sut } = makeSut()

    const result = await sut.list()
    expect(result).toEqual(makeFakeSurveys())
  })
})
