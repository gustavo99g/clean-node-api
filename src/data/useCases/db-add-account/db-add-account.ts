import { AddAccount, AddAccountModel } from '../../../domain/useCases/add-account'
import { AccountModel } from '../../../domain/models/account'
import { Hasher } from '../../protocols/crypto/hasher'
import { AddAccountRepo } from '../../protocols/db/add-account-repo'

export class DbAddAccount implements AddAccount {
  constructor (private readonly hasher: Hasher, private readonly addAccountRepo: AddAccountRepo) {}

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.Hash(accountData.password)

    const account = await this.addAccountRepo.add({
      ...accountData,
      password: hashedPassword
    })
    return account
  }
}
