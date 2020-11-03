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
  validationStub: Validation
}

const makeSut = (): SubTypes => {
  const validationStub = makeValidation()
  const sut = new ValidationComposite([validationStub])
  return { sut, validationStub }
}

describe('Validation composite', () => {
  test('should return an error if ant validation fails', () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
