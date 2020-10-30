import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../utils/email-validator/EmailValidator'
import { BcryptAdapter } from '../../infra/crypt/bcrypt-adapter'
import { AccountRepo } from '../../infra/db/mongodb/accountRepo/account'
import { DbAddAccount } from '../../data/useCases/db-add-account/db-add-account'

export const makeSignUpController = (): SignUpController => {
  const emailValidator = new EmailValidatorAdapter()
  const bcrypt = new BcryptAdapter()
  const accountRepo = new AccountRepo()
  const dbAddAccount = new DbAddAccount(bcrypt, accountRepo)
  const signupController = new SignUpController(emailValidator, dbAddAccount)
  return signupController
}
