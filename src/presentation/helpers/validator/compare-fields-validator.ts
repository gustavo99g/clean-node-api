import { Validation } from './validation'
import { InvalidParamError } from '../../errors/invalid-param-error'

export class CompareFieldValidation implements Validation {
  constructor (private readonly fieldName: string, private readonly fieldToCompareName: string) {}

  validate (input: any): any {
    if (input[this.fieldName] !== input[this.fieldToCompareName]) {
      return new InvalidParamError(this.fieldToCompareName)
    }
  }
}
