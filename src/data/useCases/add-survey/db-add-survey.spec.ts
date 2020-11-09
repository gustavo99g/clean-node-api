import { DbAddSurvey } from './db-add-survey'
import { AddSurveyModel } from '../../../domain/useCases/add-survey'
import { AddSurveyRepo } from '../../protocols/db/add-survey-repo'
import MockDate from 'mockdate'

interface SutTypes {
  sut: DbAddSurvey
  addSurveyStub: AddSurveyRepo
}

const makeSut = (): SutTypes => {
  const addSurveyStub = makeAddSurveyRepo()
  const sut = new DbAddSurvey(addSurveyStub)

  return { sut, addSurveyStub }
}

const makeAddSurveyRepo = (): AddSurveyRepo => {
  class AddSurveyRepoStub implements AddSurveyRepo {
    async add (survey: AddSurveyModel): Promise<void> {
      return Promise.resolve()
    }
  }
  return new AddSurveyRepoStub()
}

const makeFakeData = (): AddSurveyModel => {
  return {
    question: 'any_question',
    answer: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  }
}

describe('DbAddSurvey useCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('should call AddSurveyRepo with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyStub, 'add')
    await sut.add(makeFakeData())
    expect(addSpy).toHaveBeenCalledWith(makeFakeData())
  })
  test('should throw if AddSurveyRepo throws', async () => {
    const { sut, addSurveyStub } = makeSut()
    jest.spyOn(addSurveyStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))
    const error = sut.add(makeFakeData())
    await expect(error).rejects.toThrow()
  })
})
