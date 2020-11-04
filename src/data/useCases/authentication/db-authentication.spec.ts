import { AccountModel } from '../../../domain/models/account'
import { findByEmailRepo } from '../../protocols/db/find-by_email-repo'
import { DbAuthentication } from './db-authentication'
import { AuthenticateModel } from '../../../domain/useCases/authentication'
import { HashComparer } from '../../protocols/crypto/hash-comparer'

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
  sut: DbAuthentication
}

const makeSut = (): SutTypes => {
  const findByEmailRepoStub = makefindByEmailRepo()
  const hashComparerStub = makeHashComparer()
  const sut = new DbAuthentication(findByEmailRepoStub, hashComparerStub)

  return { sut, findByEmailRepoStub, hashComparerStub }
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
})
