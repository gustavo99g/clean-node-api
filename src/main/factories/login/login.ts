import { Controller } from '../../../presentation/protocols/controller'
import { LoginController } from '../../../presentation/controllers/login/login'
import { makeLoginValidator } from './login-validation'
import { DbAuthentication } from '../../../data/useCases/authentication/db-authentication'
import { LogMongoRepo } from '../../../infra/db/mongodb/logRepo/log'
import { LogControllerDecorator } from '../../decorators/log'
import { JwtAdapter } from '../../../infra/crypt/jwt-adapter/jwt-adapter'
import { BcryptAdapter } from '../../../infra/crypt/bcrypt-adapter/bcrypt-adapter'
import { AccountRepo } from '../../../infra/db/mongodb/accountRepo/account'

export const makeLoginController = (): Controller => {
  const jwtAdapter = new JwtAdapter('secret')
  const bcryptAdapter = new BcryptAdapter()
  const accountRepo = new AccountRepo()

  const authentication = new DbAuthentication(accountRepo, bcryptAdapter, jwtAdapter, accountRepo)
  const loginController = new LoginController(makeLoginValidator(), authentication)
  const logMongoRepo = new LogMongoRepo()
  return new LogControllerDecorator(loginController, logMongoRepo)
}
