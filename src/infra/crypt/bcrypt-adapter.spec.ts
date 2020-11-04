import bcrypt from 'bcryptjs'
import { BcryptAdapter } from './bcrypt-adapter'
import { throwError } from '../../domain/test/test-helper'

jest.mock('bcryptjs', () => ({
  async hash (): Promise<string> {
    return new Promise(resolve => resolve('hash'))
  }
}))

describe('Bcrypt adapter', () => {
  test('should call bcrypt with correct values', async () => {
    const sut = new BcryptAdapter()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.Hash('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', 8)
  })
  test('should return a hash on success', async () => {
    const sut = new BcryptAdapter()
    const hash = await sut.Hash('any_value')
    expect(hash).toBe('hash')
  })
  test('should throw if bcryptAdapter throws', async () => {
    const sut = new BcryptAdapter()

    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(throwError)

    const result = sut.Hash('any_value')
    await expect(result).rejects.toThrow()
  })
})
