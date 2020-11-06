import { Router } from 'express'
import { adapterRoute } from '../adapters/express-routes'
import { adapterMiddleware } from '../adapters/express-middleware'
import { makeSurveyController } from '../factories/survey/survey'
import { makeAuthMiddleware } from '../factories/auth-middleware/auth-middleware-factory'

export default (router: Router): void => {
  const adminAuth = adapterMiddleware(makeAuthMiddleware('admin'))
  router.post('/survey', adminAuth, adapterRoute(makeSurveyController()))
}
