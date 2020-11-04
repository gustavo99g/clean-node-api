import { AddAccount, AddAccountModel } from '../../../domain/useCases/add-account'
import { AccountModel } from '../../../domain/models/account'
import { Encrypter } from '../../protocols/crypto/encrypter'
import { AddAccountRepo } from '../../protocols/db/add-account-repo'

export class DbAddAccount implements AddAccount {
  constructor (private readonly encrypter: Encrypter, private readonly addAccountRepo: AddAccountRepo) {}

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)

    const account = await this.addAccountRepo.add({
      ...accountData,
      password: hashedPassword
    })
    return account
  }
}
