import { Validation } from '../../../presentation/protocols/validation'
import { RequiredFieldValidation } from '../../../validation/validator/required-field-validation'
import { ValidationComposite } from '../../../validation/validator/validation-composite'
import { makeSurveyValidator } from './survey-validation'

jest.mock('../../../validation/validator/validation-composite')

describe('surveyValidation factory', () => {
  test('should call validation composite with correct values', () => {
    makeSurveyValidator()
    const validations: Validation[] = []
    for (const field of ['question', 'answer']) {
      validations.push(new RequiredFieldValidation(field))
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
