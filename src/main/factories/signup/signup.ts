import { SignUpController } from '../../../presentation/controllers/auth/signup/signup'
import { LogControllerDecorator } from '../../decorators/log'
import { Controller } from '../../../presentation/protocols/controller'
import { LogMongoRepo } from '../../../infra/db/mongodb/logRepo/log'
import { makeSignUpValidator } from './signup-validation'
import { makeDdAuthentication } from '../useCases/dbAuthentication'
import { makeDbAddAccout } from '../useCases/dbAddAccount'

export const makeSignUpController = (): Controller => {
  const signupController = new SignUpController(makeDbAddAccout(), makeSignUpValidator(), makeDdAuthentication())
  const logMongoRepo = new LogMongoRepo()
  return new LogControllerDecorator(signupController, logMongoRepo)
}
