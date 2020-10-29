import { AddAccountRepo } from '../../../../data/protocols/add-account-repo'
import { AddAccountModel } from '../../../../domain/useCases/add-account'
import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountRepo implements AddAccountRepo {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountColletion = MongoHelper.getCollection('accounts')
    const result = await accountColletion.insertOne(accountData)
    const account = MongoHelper.map(result)

    return account
  }
}
