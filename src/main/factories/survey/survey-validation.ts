import { ValidationComposite } from '../../../validation/validator/validation-composite'
import { Validation } from '../../../presentation/protocols/validation'
import { RequiredFieldValidation } from '../../../validation/validator/required-field-validation'

export const makeSurveyValidator = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['question', 'answer']) {
    validations.push(new RequiredFieldValidation(field))
  }

  return new ValidationComposite(validations)
}
