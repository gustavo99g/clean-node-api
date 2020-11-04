import { AccountModel } from '../../../domain/models/account'
import { findByEmailRepo } from '../../protocols/db/find-by_email-repo'
import { DbAuthentication } from './db-authentication'
import { AuthenticateModel } from '../../../domain/useCases/authentication'
import { HashComparer } from '../../protocols/crypto/hash-comparer'
import { TokenGenerate } from '../../protocols/crypto/token-generator'
import { UpdateTokenRepo } from '../../protocols/db/update-token-repo'

const makeFakeAccout = (): AccountModel => {
  return {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'hashed_password'
  }
}
const makeFakeAuth = (): AuthenticateModel => {
  return {

    email: 'any_email@mail.com',
    password: 'any_password'
  }
}

const makefindByEmailRepo = (): findByEmailRepo => {
  class FindByEmailRepoStub implements findByEmailRepo {
    async find (email: string): Promise<AccountModel> {
      const account = makeFakeAccout()
      return Promise.resolve(account)
    }
  }
  return new FindByEmailRepoStub()
}
const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new HashComparerStub()
}

interface SutTypes {
  findByEmailRepoStub: findByEmailRepo
  hashComparerStub: HashComparer
  tokenGenerateStub: TokenGenerate
  updateTokenrepo: UpdateTokenRepo
  sut: DbAuthentication
}
const makeTokengenerate = (): TokenGenerate => {
  class TokenGenerateStub implements TokenGenerate {
    async generate (id: string): Promise<string> {
      return Promise.resolve('any_token')
    }
  }
  return new TokenGenerateStub()
}

const makeUpdateTokenRepo = (): UpdateTokenRepo => {
  class UpdateTokenRepoStub implements UpdateTokenRepo {
    async update (id: string, token: string): Promise<void> {
      return Promise.resolve()
    }
  }
  return new UpdateTokenRepoStub()
}

const makeSut = (): SutTypes => {
  const findByEmailRepoStub = makefindByEmailRepo()
  const hashComparerStub = makeHashComparer()
  const tokenGenerateStub = makeTokengenerate()
  const updateTokenrepo = makeUpdateTokenRepo()
  const sut = new DbAuthentication(findByEmailRepoStub, hashComparerStub, tokenGenerateStub, updateTokenrepo)

  return { sut, findByEmailRepoStub, hashComparerStub, tokenGenerateStub, updateTokenrepo }
}

describe('Dbauthentication useCase', () => {
  test('should call findByEmailRepo with correct email', async () => {
    const { sut, findByEmailRepoStub } = makeSut()
    const loadSpy = jest.spyOn(findByEmailRepoStub, 'find')
    await sut.auth(makeFakeAuth())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should throw if findByEmailRepo throws', async () => {
    const { sut, findByEmailRepoStub } = makeSut()
    jest.spyOn(findByEmailRepoStub, 'find').mockReturnValueOnce(Promise.reject(new Error()))
    const error = sut.auth(makeFakeAuth())
    await expect(error).rejects.toThrow()
  })
  test('should return null if findByEmailRepo returns null', async () => {
    const { sut, findByEmailRepoStub } = makeSut()
    jest.spyOn(findByEmailRepoStub, 'find').mockReturnValueOnce(Promise.resolve(null as unknown as AccountModel))
    const token = await sut.auth(makeFakeAuth())
    expect(token).toBeNull()
  })
  test('should call hashComparer with correct password', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(makeFakeAuth())
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })
  test('should throw if hashCompare throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.reject(new Error()))
    const error = sut.auth(makeFakeAuth())
    await expect(error).rejects.toThrow()
  })
  test('should return null if hashCompare returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.resolve(false))
    const token = await sut.auth(makeFakeAuth())
    expect(token).toBeNull()
  })
  test('should call tokenGenerate with correct value', async () => {
    const { sut, tokenGenerateStub } = makeSut()
    const compareSpy = jest.spyOn(tokenGenerateStub, 'generate')
    await sut.auth(makeFakeAuth())
    expect(compareSpy).toHaveBeenCalledWith('any_id')
  })
  test('should throw if tokenGenerate throws', async () => {
    const { sut, tokenGenerateStub } = makeSut()
    jest.spyOn(tokenGenerateStub, 'generate').mockReturnValueOnce(Promise.reject(new Error()))
    const error = sut.auth(makeFakeAuth())
    await expect(error).rejects.toThrow()
  })
  test('should return a token on success', async () => {
    const { sut } = makeSut()
    const token = await sut.auth(makeFakeAuth())
    expect(token).toBe('any_token')
  })
  test('should call updateTokenrepo with corrects values', async () => {
    const { sut, updateTokenrepo } = makeSut()
    const compareSpy = jest.spyOn(updateTokenrepo, 'update')
    await sut.auth(makeFakeAuth())
    expect(compareSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })
  test('should throw if updateTokenrepo throws', async () => {
    const { sut, updateTokenrepo } = makeSut()
    jest.spyOn(updateTokenrepo, 'update').mockReturnValueOnce(Promise.reject(new Error()))
    const error = sut.auth(makeFakeAuth())
    await expect(error).rejects.toThrow()
  })
})
