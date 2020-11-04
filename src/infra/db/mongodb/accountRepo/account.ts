import { AddAccountRepo } from '../../../../data/protocols/db/add-account-repo'
import { AddAccountModel } from '../../../../domain/useCases/add-account'
import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'
import { findByEmailRepo } from '../../../../data/protocols/db/find-by_email-repo'

export class AccountRepo implements AddAccountRepo, findByEmailRepo {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountColletion = await MongoHelper.getCollection('accounts')
    const result = await accountColletion.insertOne(accountData)
    const account = MongoHelper.map(result.ops[0])

    return account
  }

  async findByEmail (email: string): Promise<AccountModel | null> {
    const accountColletion = await MongoHelper.getCollection('accounts')
    const result = await accountColletion.findOne({ email })
    if (!result) {
      return null
    }
    const account = MongoHelper.map(result)

    return account
  }
}
