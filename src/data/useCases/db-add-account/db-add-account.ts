import { AddAccount, AddAccountModel } from '../../../domain/useCases/add-account'
import { AccountModel } from '../../../domain/models/account'
import { Hasher } from '../../protocols/crypto/hasher'
import { AddAccountRepo } from '../../protocols/db/add-account-repo'
import { findByEmailRepo } from '../../protocols/db/find-by_email-repo'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepo: AddAccountRepo,
    private readonly findByEmailRepo: findByEmailRepo
  ) {}

  async add (accountData: AddAccountModel): Promise<AccountModel | null> {
    const accountFound = await this.findByEmailRepo.findByEmail(accountData.email)

    if (accountFound) {
      return null
    }

    const hashedPassword = await this.hasher.Hash(accountData.password)

    const account = await this.addAccountRepo.add({
      ...accountData,
      password: hashedPassword
    })
    return account
  }
}
