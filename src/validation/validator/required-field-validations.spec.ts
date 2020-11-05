import { RequiredFieldValidation } from './required-field-validation'
import { MissingParamError } from '../../presentation/errors/missing-param-error'

describe('Required field validation', () => {
  test('should return a missinParamError if fails', () => {
    const sut = new RequiredFieldValidation('field')
    const error = sut.validate({ name: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })
  test('should not return if validation success', () => {
    const sut = new RequiredFieldValidation('field')
    const error = sut.validate({ field: 'any_value' })
    expect(error).toBeFalsy()
  })
})
