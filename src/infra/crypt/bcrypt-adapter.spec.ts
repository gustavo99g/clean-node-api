import bcrypt from 'bcryptjs'
import { BcryptAdapter } from './bcrypt-adapter'

describe('Bcrypt adapter', () => {
  test('should call bcrypt with correct values', async () => {
    const sut = new BcryptAdapter()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', 8)
  })
})
