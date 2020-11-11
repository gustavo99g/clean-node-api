import { Validation } from '../protocols/validation'

export class ValidationSpy implements Validation {
  validate (input: any): any {
    return null
  }
}
