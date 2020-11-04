import { SignUpController } from '../../../presentation/controllers/signup/signup'

import { BcryptAdapter } from '../../../infra/crypt/bcrypt-adapter'
import { AccountRepo } from '../../../infra/db/mongodb/accountRepo/account'
import { DbAddAccount } from '../../../data/useCases/db-add-account/db-add-account'
import { LogControllerDecorator } from '../../decorators/log'
import { Controller } from '../../../presentation/protocols/controller'
import { LogMongoRepo } from '../../../infra/db/mongodb/logRepo/log'
import { makeSignUpValidator } from './signup-validation'

export const makeSignUpController = (): Controller => {
  const bcrypt = new BcryptAdapter()
  const accountRepo = new AccountRepo()
  const dbAddAccount = new DbAddAccount(bcrypt, accountRepo)
  const signupController = new SignUpController(dbAddAccount, makeSignUpValidator())
  const logMongoRepo = new LogMongoRepo()
  return new LogControllerDecorator(signupController, logMongoRepo)
}
