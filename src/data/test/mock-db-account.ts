import { findByEmailRepo } from '../protocols/db/find-by_email-repo'
import { AccountModel } from '../../domain/models/account'
import { MockAccountModel } from '../../domain/test/mock-account'
import { UpdateTokenRepo } from '../protocols/db/update-token-repo'
import { AddAccountRepo } from '../protocols/db/add-account-repo'
import { AddAccountModel } from '../../domain/useCases/add-account'
import { findByAccessTokenRepo } from '../protocols/db/find-by-access-token-repo'

export class FindByEmailRepoSpy implements findByEmailRepo {
  accountModel: null | AccountModel = MockAccountModel()
  async findByEmail (email: string): Promise<AccountModel | null> {
    return Promise.resolve(this.accountModel)
  }
}

export class UpdateTokenRepoSpy implements UpdateTokenRepo {
  async updateAccessToken (id: string, token: string): Promise<void> {
    return Promise.resolve()
  }
}

export class AddAccountRepoSpy implements AddAccountRepo {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    return new Promise(resolve => resolve(MockAccountModel()))
  }
}

export class FindByAccessTokenSpy implements findByAccessTokenRepo {
  async findByAccessToken (token: string, role?: string): Promise<AccountModel | null> {
    return Promise.resolve(MockAccountModel())
  }
}
