import { AddAccountRepo } from '../../../../data/protocols/db/add-account-repo'
import { AddAccountModel } from '../../../../domain/useCases/add-account'
import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'
import { findByEmailRepo } from '../../../../data/protocols/db/find-by_email-repo'
import { UpdateTokenRepo } from '../../../../data/protocols/db/update-token-repo'
import { findByAccessTokenRepo } from '../../../../data/protocols/db/find-by-access-token-repo'

export class AccountRepo implements AddAccountRepo, findByEmailRepo, UpdateTokenRepo, findByAccessTokenRepo {
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

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountColletion = await MongoHelper.getCollection('accounts')
    await accountColletion.updateOne({ _id: id }, { $set: { accessToken: token } })
  }

  async findByAccessToken (token: string, role?: string): Promise<AccountModel | null> {
    const accountColletion = await MongoHelper.getCollection('accounts')
    const result = await accountColletion.findOne({ accessToken: token, role })
    if (!result) {
      return null
    }
    const account = MongoHelper.map(result)

    return account
  }
}
