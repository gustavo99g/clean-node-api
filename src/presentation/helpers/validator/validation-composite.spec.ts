import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'
import { MissingParamError } from '../../errors/missing-param-error'

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): any {
      return null
    }
  }
  return new ValidationStub()
}
interface SubTypes {
  sut: ValidationComposite
  validationStubs: Validation[]
}

const makeSut = (): SubTypes => {
  const validationStubs = [makeValidation(), makeValidation()]
  const sut = new ValidationComposite(validationStubs)
  return { sut, validationStubs }
}

describe('Validation composite', () => {
  test('should return an error if ant validation fails', () => {
    const { sut, validationStubs } = makeSut()

    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('field'))

    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })
  test('should return the first error if more then one valisation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error(''))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
