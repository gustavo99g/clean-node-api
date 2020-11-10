
import { FindSurveyByID } from '../../../domain/useCases/find-survey-by-id'
import { DbFindByIdSurvey } from '../../../data/useCases/find-survey-by-id/db-find-survey-by-id'
import { SurveyRepo } from '../../../infra/db/mongodb/surveyRepo/survey'

export const makeDbFindSurveyById = (): FindSurveyByID => {
  const surveyRepo = new SurveyRepo()
  return new DbFindByIdSurvey(surveyRepo)
}
