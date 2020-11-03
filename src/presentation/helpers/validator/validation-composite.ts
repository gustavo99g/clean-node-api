import { Validation } from './validation'

export class ValidationComposite implements Validation {
  constructor (private readonly validations: Validation[]) {}
  validate (input: any): any {
    this.validations.forEach(validate => {
      const error = validate.validate(input)
      if (error) {
        return error
      }
    })
  }
}
