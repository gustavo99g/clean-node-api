import { Router } from 'express'
import { adapterRoute } from '../../adapters/express-routes'
import { makeSignUpController } from '../../factories/signup/signup'
import { makeLoginController } from '../../factories/login/login'

export default (router: Router): void => {
  router.post('/signup', adapterRoute(makeSignUpController()))
  router.post('/login', adapterRoute(makeLoginController()))
}
