import { Controller } from '../../../presentation/protocols/controller'
import { ListSurveysController } from '../../../presentation/controllers/survey/listSurveys/listSurvey'
import { makeListSurvey } from '../useCases/dbListSurvey'
import { LogMongoRepo } from '../../../infra/db/mongodb/logRepo/log'
import { LogControllerDecorator } from '../../decorators/log'

export const makeListsurveyController = (): Controller => {
  const listSurveryController = new ListSurveysController(makeListSurvey())
  const logMongoRepo = new LogMongoRepo()
  return new LogControllerDecorator(listSurveryController, logMongoRepo)
}
