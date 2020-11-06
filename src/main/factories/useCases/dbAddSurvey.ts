import { AddSurvey } from '../../../domain/useCases/add-survey'
import { SurveyRepo } from '../../../infra/db/mongodb/surveyRepo/survey'
import { DbAddSurvey } from '../../../data/useCases/add-survey/db-add-survey'

export const makeAddSurvey = (): AddSurvey => {
  const surveyRepo = new SurveyRepo()
  const dbAddSurvey = new DbAddSurvey(surveyRepo)

  return dbAddSurvey
}
