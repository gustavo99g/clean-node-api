import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return Promise.resolve('any_token')
  },
  async verify (): Promise<string> {
    return Promise.resolve('any_data')
  }
}))

interface SutTypes {
  sut: JwtAdapter
}

const makeSut = (): SutTypes => {
  const sut = new JwtAdapter('secret')

  return { sut }
}
describe('JWT adapter', () => {
  test('should call sign with correc values ', async () => {
    const { sut } = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.generate('any_id')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
  })
  test('should return a token on sign success', async () => {
    const { sut } = makeSut()
    const token = await sut.generate('any_id')
    expect(token).toBe('any_token')
  })
  test('should throw if sign throws ', async () => {
    const { sut } = makeSut()
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error()
    })
    const result = sut.generate('any_id')
    await expect(result).rejects.toThrow()
  })
  test('should call verify with correct values ', async () => {
    const { sut } = makeSut()
    const signSpy = jest.spyOn(jwt, 'verify')
    await sut.decrypt('token')
    expect(signSpy).toHaveBeenCalledWith('token', 'secret')
  })
})
