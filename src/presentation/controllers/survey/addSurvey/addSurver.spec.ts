import { AddSurveyController } from './addSurvey'
import { HttpRequest } from '../../../protocols/http'
import { badRequest, serverError, noContent } from '../../../helpers/http/http-helper'
import { ValidationSpy } from '../../../test/mock-validation'
import { AddSurveySpy } from '../../../test/mock-survey'
import MockDate from 'mockdate'

interface SutTypes {
  sut: AddSurveyController
  validationSpy: ValidationSpy
  addSurveySpy: AddSurveySpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const addSurveySpy = new AddSurveySpy()
  const sut = new AddSurveyController(validationSpy, addSurveySpy)

  return { sut, validationSpy, addSurveySpy }
}

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }],
      date: new Date()

    }
  }
}

describe('AddSurvey controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('should call validate with correct values', async () => {
    const { sut, validationSpy } = makeSut()
    const validateSpy = jest.spyOn(validationSpy, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  test('should return 400 if validate fails', async () => {
    const { sut, validationSpy } = makeSut()
    jest.spyOn(validationSpy, 'validate').mockReturnValueOnce(new Error())
    const httpRequest = makeFakeRequest()
    const res = await sut.handle(httpRequest)
    expect(res).toEqual(badRequest(new Error()))
  })
  test('should call addSurvey with correct values', async () => {
    const { sut, addSurveySpy } = makeSut()
    const addSpy = jest.spyOn(addSurveySpy, 'add')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  test('should return 500 if addSurvey fails', async () => {
    const { sut, validationSpy } = makeSut()
    jest.spyOn(validationSpy, 'validate').mockImplementationOnce(() => {
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
