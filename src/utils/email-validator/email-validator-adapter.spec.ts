import { EmailValidatorAdapter } from './EmailValidator'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): Boolean {
    return true
  }
}))
const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('EmailValidator adapter', () => {
  test('Should return false if validator fails', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid@mail.com')
    expect(isValid).toBe(false)
  })

  test('Should return true if valid emailprovided', () => {
    const sut = makeSut()
    const isValid = sut.isValid('valid@mail.com')
    expect(isValid).toBe(true)
  })
  test('Should call validator with correct email', () => {
    const sut = makeSut()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    sut.isValid('valid@mail.com')
    expect(isEmailSpy).toHaveBeenCalledWith('valid@mail.com')
  })
})
