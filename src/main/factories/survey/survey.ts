import { Controller } from '../../../presentation/protocols/controller'
import { makeSurveyValidator } from './survey-validation'

import { LogControllerDecorator } from '../../decorators/log'
import { AddSurveyController } from '../../../presentation/controllers/survey/addSurvey/addSurvey'
import { makeAddSurvey } from '../useCases/dbAddSurvey'
import { LogMongoRepo } from '../../../infra/db/mongodb/logRepo/log'

export const makeSurveyController = (): Controller => {
  const addSurveyController = new AddSurveyController(makeSurveyValidator(), makeAddSurvey())
  const logMongoRepo = new LogMongoRepo()
  return new LogControllerDecorator(addSurveyController, logMongoRepo)
}
