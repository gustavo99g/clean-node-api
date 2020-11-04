import { AccountModel } from '../../../domain/models/account'
import { findByEmailRepo } from '../../protocols/db/find-by_email-repo'
import { DbAuthentication } from './db-authentication'
import { AuthenticateModel } from '../../../domain/useCases/authentication'

const makeFakeAccout = (): AccountModel => {
  return {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
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

interface SutTypes {
  findByEmailRepoStub: findByEmailRepo
  sut: DbAuthentication
}

const makeSut = (): SutTypes => {
  const findByEmailRepoStub = makefindByEmailRepo()
  const sut = new DbAuthentication(findByEmailRepoStub)

  return { sut, findByEmailRepoStub }
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
    jest.spyOn(findByEmailRepoStub, 'find').mockReturnValueOnce(Promise.resolve(null))
    const token = await sut.auth(makeFakeAuth())
    expect(token).toBeNull()
  })
})
