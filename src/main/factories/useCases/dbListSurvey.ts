import { DbListSurvey } from '../../../data/useCases/list-survey/db-list-surveys'
import { SurveyRepo } from '../../../infra/db/mongodb/surveyRepo/survey'
import { ListSurveys } from '../../../domain/useCases/list-survey'

export const makeListSurvey = (): ListSurveys => {
  const surveyRepo = new SurveyRepo()
  const listSurvey = new DbListSurvey(surveyRepo)
  return listSurvey
}
