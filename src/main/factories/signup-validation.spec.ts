import { makeSignUpValidator } from './signup-validation'
import { ValidationComposite } from '../../presentation/helpers/validator/validation-composite'
import { RequiredFieldValidation } from '../../presentation/helpers/validator/required-field-validation'
import { Validation } from '../../presentation/helpers/validator/validation'
import { CompareFieldValidation } from '../../presentation/helpers/validator/compare-fields-validator'

jest.mock('../../presentation/helpers/validator/validation-composite')

describe('SignupValidation factory', () => {
  test('should call validationComposite with all validation', () => {
    makeSignUpValidator()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'confirmPassword']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldValidation('password', 'confirmPassword'))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
