import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

interface SutTypes {
  sut: JwtAdapter
}

const makeSut = (): SutTypes => {
  const sut = new JwtAdapter('secret')

  return { sut }
}
describe('JWT adapter', () => {
  test('should ', async () => {
    const { sut } = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.generate('any_id')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
  })
})
