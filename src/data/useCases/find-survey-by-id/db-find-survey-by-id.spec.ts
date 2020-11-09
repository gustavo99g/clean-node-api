import { SurveyModel } from '../../../domain/models/survey'
import { FindByIdSurveyRepo } from '../../protocols/db/find-by-id-survey'
import { DbFindByIdSurvey } from './db-find-survey-by-id'

const makeSurveyData = (): SurveyModel => {
  return {
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
}

const makeFindByIdSurverRepo = (): FindByIdSurveyRepo => {
  class FindByIdSurveyRepoStub implements FindByIdSurveyRepo {
    async findById (id: string): Promise<SurveyModel> {
      return Promise.resolve(makeSurveyData())
    }
  }
  return new FindByIdSurveyRepoStub()
}

interface SutTypes {
  findByIdSurveyRepoStub: FindByIdSurveyRepo
  sut: DbFindByIdSurvey
}

const makeSut = (): SutTypes => {
  const findByIdSurveyRepoStub = makeFindByIdSurverRepo()
  const sut = new DbFindByIdSurvey(findByIdSurveyRepoStub)

  return { sut, findByIdSurveyRepoStub }
}
describe('Db find by id survey', () => {
  test('should call findBy Id repo with correct value', async () => {
    const { findByIdSurveyRepoStub, sut } = makeSut()
    const findSpy = jest.spyOn(findByIdSurveyRepoStub, 'findById')
    await sut.findById('any_id')
    expect(findSpy).toHaveBeenCalledWith('any_id')
  })
  test('should return a survey on success', async () => {
    const { sut } = makeSut()
    const result = await sut.findById('any_id')
    expect(result).toEqual(makeSurveyData())
  })
  test('should throw if findByIdSurveyRepo throws', async () => {
    const { sut, findByIdSurveyRepoStub } = makeSut()
    jest.spyOn(findByIdSurveyRepoStub, 'findById').mockReturnValueOnce(Promise.reject(new Error()))
    const res = sut.findById('any_id')
    await expect(res).rejects.toThrow()
  })
})
