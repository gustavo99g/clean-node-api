
import { ValidationComposite } from '../../../validation/validator/validation-composite'
import { RequiredFieldValidation } from '../../../validation/validator/required-field-validation'
import { Validation } from '../../../presentation/protocols/validation'

import { EmailValidation } from '../../../infra/validator/email-validation'
import { EmailValidatorAdapter } from '../../../utils/email-validator/EmailValidator'

export const makeLoginValidator = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
