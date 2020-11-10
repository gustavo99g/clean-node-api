import { SaveSurveyResultController } from './saveSurveyResult'
import { HttpRequest } from '../../../protocols/http'
import { FindSurveyByID } from '../../../../domain/useCases/find-survey-by-id'
import { SaveSurveyResult, SaveSurveyResultModel } from '../../../../domain/useCases/save-survey-result'
import { SurveyModel } from '../../../../domain/models/survey'
import { forbidden, serverError } from '../../../helpers/http/http-helper'
import { InvalidParamError } from '../../../errors/invalid-param-error'
import { SurveyResultModel } from '../../../../domain/models/survey-result'
import MockDate from 'mockdate'

interface SutTypes {
  sut: SaveSurveyResultController
  findByidSurveyStub: FindSurveyByID
  saveSurveyResultStub: SaveSurveyResult
}

const makeSut = (): SutTypes => {
  const findByidSurveyStub = makeFindByIdSurvey()
  const saveSurveyResultStub = makeSaveSurveyResult()
  const sut = new SaveSurveyResultController(findByidSurveyStub, saveSurveyResultStub)

  return { sut, findByidSurveyStub, saveSurveyResultStub }
}

const makeSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return {
        id: 'any_id',
        surveyId: 'any_surveyId',
        accountId: 'any_accountId',
        date: new Date(),
        answer: 'any_answer'
      }
    }
  }
  return new SaveSurveyResultStub()
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
    const { sut, findByidSurveyStub } = makeSut()
    const findSpy = jest.spyOn(findByidSurveyStub, 'findById')
    await sut.handle(fakeRequest())
    expect(findSpy).toHaveBeenCalledWith('any_surveyId')
  })

  test('should return 403 if surveyId is invalid', async () => {
    const { sut, findByidSurveyStub } = makeSut()
    jest.spyOn(findByidSurveyStub, 'findById').mockReturnValue(Promise.resolve(null))
    const res = await sut.handle(fakeRequest())
    expect(res).toEqual(forbidden(new InvalidParamError('SurveyId')))
  })
  test('should return 500 if FindById fails', async () => {
    const { sut, findByidSurveyStub } = makeSut()
    jest.spyOn(findByidSurveyStub, 'findById').mockImplementationOnce(() => {
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
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    await sut.handle(fakeRequest())
    expect(saveSpy).toHaveBeenCalledWith({
      surveyId: 'any_surveyId',
      accountId: 'any_accountId',
      date: new Date(),
      answer: 'any_answer'
    })
  })
  test('should return 500 if saveSurveyResult throw', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockImplementationOnce(() => {
      throw new Error()
    })

    const res = await sut.handle({})
    expect(res).toEqual(serverError(new Error()))
  })
})
