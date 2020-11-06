import { Router } from 'express'
import { adapterRoute } from '../adapters/express-routes'
import { makeSurveyController } from '../factories/survey/survey'

export default (router: Router): void => {
  router.post('/survey', adapterRoute(makeSurveyController()))
}
