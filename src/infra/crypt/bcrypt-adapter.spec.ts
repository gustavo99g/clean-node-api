import bcrypt from 'bcryptjs'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcryptjs', () => ({
  async hash (): Promise<string> {
    return new Promise(resolve => resolve('hash'))
  }
}))

describe('Bcrypt adapter', () => {
  test('should call bcrypt with correct values', async () => {
    const sut = new BcryptAdapter()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', 8)
  })

  test('should return a hash on success', async () => {
    const sut = new BcryptAdapter()

    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('hash')
  })
})
