import { Controller } from '../../../presentation/protocols/controller'
import { LoginController } from '../../../presentation/controllers/login/login'
import { makeLoginValidator } from './login-validation'

import { LogMongoRepo } from '../../../infra/db/mongodb/logRepo/log'
import { LogControllerDecorator } from '../../decorators/log'
import { makeDdAuthentication } from '../useCases/dbAuthentication'

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(makeLoginValidator(), makeDdAuthentication())
  const logMongoRepo = new LogMongoRepo()
  return new LogControllerDecorator(loginController, logMongoRepo)
}
