import { Controller } from '../../../presentation/protocols/controller'
import { LogControllerDecorator } from '../../decorators/log'
import { SaveSurveyResultController } from '../../../presentation/controllers/surveyResult/saveSurveyResult/saveSurveyResult'
import { LogMongoRepo } from '../../../infra/db/mongodb/logRepo/log'
import { makeDbFindSurveyById } from '../useCases/dbFindSurveyById'
import { makeDbSaveSurveyReult } from '../useCases/dbSaveSurveyResult'

export const makeSaveSurveyResultController = (): Controller => {
  const saveSurveyResultController = new SaveSurveyResultController(makeDbFindSurveyById(), makeDbSaveSurveyReult())
  const logMongoRepo = new LogMongoRepo()
  return new LogControllerDecorator(saveSurveyResultController, logMongoRepo)
}
