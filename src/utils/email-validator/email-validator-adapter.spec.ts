import { EmailValidatorAdapter } from './EmailValidator'

describe('EmailValidator adapter', () => {
  test('Should return false if validator fails', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('invalid@mail.com')
    expect(isValid).toBe(false)
  })
})
