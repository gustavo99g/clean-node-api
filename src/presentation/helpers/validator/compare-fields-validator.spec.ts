import { CompareFieldValidation } from './compare-fields-validator'
import { InvalidParamError } from '../../errors/invalid-param-error'

describe('Compare field validation', () => {
  test('should return a missingParamError if fails', () => {
    const sut = new CompareFieldValidation('field', 'name')
    const error = sut.validate({ field: 'any_field', name: 'any_value' })
    expect(error).toEqual(new InvalidParamError('name'))
  })
  test('should not return if validation success', () => {
    const sut = new CompareFieldValidation('field', 'name')
    const error = sut.validate({ field: 'any_field', name: 'any_field' })
    expect(error).toBeFalsy()
  })
})
