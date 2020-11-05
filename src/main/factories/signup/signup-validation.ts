
import { ValidationComposite } from '../../../validation/validator/validation-composite'
import { RequiredFieldValidation } from '../../../validation/validator/required-field-validation'
import { Validation } from '../../../presentation/protocols/validation'
import { CompareFieldValidation } from '../../../validation/validator/compare-fields-validator'
import { EmailValidation } from '../../../infra/validator/email-validation'
import { EmailValidatorAdapter } from '../../../utils/email-validator/EmailValidator'

export const makeSignUpValidator = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldValidation('password', 'passwordConfirmation'))
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
