import { AccountModel } from '../../../domain/models/account'
import { findByEmailRepo } from '../../protocols/find-by_email-repo'
import { DbAuthentication } from './db-authentication'

const makefindByEmailRepo = (): findByEmailRepo => {
  class FindByEmailRepoStub implements findByEmailRepo {
    async find (email: string): Promise<AccountModel> {
      const account: AccountModel = {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
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
    await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
