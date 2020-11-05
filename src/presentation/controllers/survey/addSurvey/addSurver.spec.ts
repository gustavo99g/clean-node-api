
import { AddSurveyController } from './addSurvey'
import { HttpRequest } from '../../../protocols/http'
import { Validation } from '../../../protocols/validation'
import { MissingParamError } from '../../../errors/missing-param-error'
import { badRequest } from '../../../helpers/http/http-helper'

interface SutTypes {
  sut: AddSurveyController
  validationStub: Validation
}
const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): any {
      return null
    }
  }
  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const sut = new AddSurveyController(validationStub)

  return { sut, validationStub }
}

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      question: 'any_question',
      answer: {
        image: 'any_image',
        answer: 'any_answer'
      }
    }
  }
}

describe('AddSurvey controller', () => {
  test('should vall validate with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  test('should return 400 if validate fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_value'))
    const httpRequest = makeFakeRequest()
    const res = await sut.handle(httpRequest)
    expect(res).toEqual(badRequest(new MissingParamError('any_value')))
  })
})
