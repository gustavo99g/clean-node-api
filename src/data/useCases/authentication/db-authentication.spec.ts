import { DbAuthentication } from './db-authentication'
import { mockAuthData } from '../../../domain/test/mock-account'
import { FindByEmailRepoSpy, UpdateTokenRepoSpy } from '../../test/mock-db-account'
import { HashComparerSpy, TokenGenerateSpy } from '../../test/mock-cryto'

interface SutTypes {
  findByEmailRepoSpy: FindByEmailRepoSpy
  hashComparerSpy: HashComparerSpy
  tokenGenerateSpy: TokenGenerateSpy
  updateTokenrepoSpy: UpdateTokenRepoSpy
  sut: DbAuthentication
}

const makeSut = (): SutTypes => {
  const findByEmailRepoSpy = new FindByEmailRepoSpy()
  const hashComparerSpy = new HashComparerSpy()
  const tokenGenerateSpy = new TokenGenerateSpy()
  const updateTokenrepoSpy = new UpdateTokenRepoSpy()
  const sut = new DbAuthentication(findByEmailRepoSpy, hashComparerSpy, tokenGenerateSpy, updateTokenrepoSpy)

  return { sut, findByEmailRepoSpy, hashComparerSpy, tokenGenerateSpy, updateTokenrepoSpy }
}

describe('Dbauthentication useCase', () => {
  test('should call findByEmailRepo with correct email', async () => {
    const { sut, findByEmailRepoSpy } = makeSut()
    const loadSpy = jest.spyOn(findByEmailRepoSpy, 'findByEmail')
    await sut.auth(mockAuthData())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should throw if findByEmailRepo throws', async () => {
    const { sut, findByEmailRepoSpy } = makeSut()
    jest.spyOn(findByEmailRepoSpy, 'findByEmail').mockReturnValueOnce(Promise.reject(new Error()))
    const error = sut.auth(mockAuthData())
    await expect(error).rejects.toThrow()
  })
  test('should return null if findByEmailRepo returns null', async () => {
    const { sut, findByEmailRepoSpy } = makeSut()
    jest.spyOn(findByEmailRepoSpy, 'findByEmail').mockReturnValueOnce(Promise.resolve(null))
    const token = await sut.auth(mockAuthData())
    expect(token).toBeNull()
  })
  test('should call hashComparer with correct password', async () => {
    const { sut, hashComparerSpy } = makeSut()
    const compareSpy = jest.spyOn(hashComparerSpy, 'compare')
    await sut.auth(mockAuthData())
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })
  test('should throw if hashCompare throws', async () => {
    const { sut, hashComparerSpy } = makeSut()
    jest.spyOn(hashComparerSpy, 'compare').mockReturnValueOnce(Promise.reject(new Error()))
    const error = sut.auth(mockAuthData())
    await expect(error).rejects.toThrow()
  })
  test('should return null if hashCompare returns false', async () => {
    const { sut, hashComparerSpy } = makeSut()
    jest.spyOn(hashComparerSpy, 'compare').mockReturnValueOnce(Promise.resolve(false))
    const token = await sut.auth(mockAuthData())
    expect(token).toBeNull()
  })
  test('should call tokenGenerate with correct value', async () => {
    const { sut, tokenGenerateSpy } = makeSut()
    const compareSpy = jest.spyOn(tokenGenerateSpy, 'generate')
    await sut.auth(mockAuthData())
    expect(compareSpy).toHaveBeenCalledWith('any_id')
  })
  test('should throw if tokenGenerate throws', async () => {
    const { sut, tokenGenerateSpy } = makeSut()
    jest.spyOn(tokenGenerateSpy, 'generate').mockReturnValueOnce(Promise.reject(new Error()))
    const error = sut.auth(mockAuthData())
    await expect(error).rejects.toThrow()
  })
  test('should return a token on success', async () => {
    const { sut } = makeSut()
    const token = await sut.auth(mockAuthData())
    expect(token).toBe('any_token')
  })
  test('should call updateTokenrepoSpy with corrects values', async () => {
    const { sut, updateTokenrepoSpy } = makeSut()
    const compareSpy = jest.spyOn(updateTokenrepoSpy, 'updateAccessToken')
    await sut.auth(mockAuthData())
    expect(compareSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })
  test('should throw if updateTokenrepoSpy throws', async () => {
    const { sut, updateTokenrepoSpy } = makeSut()
    jest.spyOn(updateTokenrepoSpy, 'updateAccessToken').mockReturnValueOnce(Promise.reject(new Error()))
    const error = sut.auth(mockAuthData())
    await expect(error).rejects.toThrow()
  })
})
