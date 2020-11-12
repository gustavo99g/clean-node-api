import { Controller } from '../../../presentation/protocols/controller'
import { LogControllerDecorator } from '../../decorators/log'
import { LoadSurveyController } from '../../../presentation/controllers/surveyResult/loadSurveyResult/loadSurveyResult'
import { LogMongoRepo } from '../../../infra/db/mongodb/logRepo/log'
import { makeDbFindSurveyById } from '../useCases/dbFindSurveyById'
import { makeDbLoadSurveyReult } from '../useCases/dbLoadSurveyResult'

export const makeLoadSurveyResultController = (): Controller => {
  const loadSurveyResultController = new LoadSurveyController(makeDbFindSurveyById(), makeDbLoadSurveyReult())
  const logMongoRepo = new LogMongoRepo()
  return new LogControllerDecorator(loadSurveyResultController, logMongoRepo)
}
