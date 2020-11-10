import { Router } from 'express'
import { adapterRoute } from '../adapters/express-routes'
import { adapterMiddleware } from '../adapters/express-middleware'
import { makeAuthMiddleware } from '../factories/auth-middleware/auth-middleware-factory'
import { makeSaveSurveyResultController } from '../factories/save-survey-result/save-survey-result'

export default (router: Router): void => {
  const auth = adapterMiddleware(makeAuthMiddleware())

  router.put('/survey/:surveyId/results', auth, adapterRoute(makeSaveSurveyResultController()))
}
