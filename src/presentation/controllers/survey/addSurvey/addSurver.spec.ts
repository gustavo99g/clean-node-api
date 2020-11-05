import { AddSurveyController } from './addSurvey'
import { HttpRequest } from '../../../protocols/http'
import { Validation } from '../../../protocols/validation'
import { badRequest, serverError, noContent } from '../../../helpers/http/http-helper'
import { AddSurvey, AddSurveyModel } from '../../../../domain/useCases/add-survey'

interface SutTypes {
  sut: AddSurveyController
  validationStub: Validation
  addSurveyStub: AddSurvey
}
const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): any {
      return null
    }
  }
  return new ValidationStub()
}
const makeAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (survey: AddSurveyModel): Promise<void> {
      return Promise.resolve()
    }
  }
  return new AddSurveyStub()
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const addSurveyStub = makeAddSurvey()
  const sut = new AddSurveyController(validationStub, addSurveyStub)

  return { sut, validationStub, addSurveyStub }
}

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      question: 'any_question',
      answers: {
        image: 'any_image',
        answer: 'any_answer'
      }
    }
  }
}

describe('AddSurvey controller', () => {
  test('should call validate with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  test('should return 400 if validate fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpRequest = makeFakeRequest()
    const res = await sut.handle(httpRequest)
    expect(res).toEqual(badRequest(new Error()))
  })
  test('should call addSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()
    const addSurveySpy = jest.spyOn(addSurveyStub, 'add')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(addSurveySpy).toHaveBeenCalledWith(httpRequest.body.answer)
  })
  test('should return 500 if addSurvey fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = makeFakeRequest()
    const res = await sut.handle(httpRequest)
    expect(res).toEqual(serverError(new Error()))
  })
  test('should return 204 on success', async () => {
    const { sut } = makeSut()

    const httpRequest = makeFakeRequest()
    const res = await sut.handle(httpRequest)
    expect(res).toEqual(noContent())
  })
})
