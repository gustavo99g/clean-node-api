
import { ValidationComposite } from '../../../presentation/helpers/validator/validation-composite'
import { RequiredFieldValidation } from '../../../presentation/helpers/validator/required-field-validation'
import { Validation } from '../../../presentation/helpers/validator/validation'

import { EmailValidation } from '../../../presentation/helpers/validator/email-validation'
import { EmailValidatorAdapter } from '../../../utils/email-validator/EmailValidator'

export const makeLoginValidator = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
