import { BcryptAdapter } from '../../../infra/crypt/bcrypt-adapter/bcrypt-adapter'
import { AccountRepo } from '../../../infra/db/mongodb/accountRepo/account'
import { DbAddAccount } from '../../../data/useCases/db-add-account/db-add-account'
import { AddAccount } from '../../../domain/useCases/add-account'

export const makeDbAddAccout = (): AddAccount => {
  const bcrypt = new BcryptAdapter()
  const accountRepo = new AccountRepo()
  const dbAddAccount = new DbAddAccount(bcrypt, accountRepo, accountRepo)
  return dbAddAccount
}
