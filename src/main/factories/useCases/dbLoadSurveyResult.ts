
import { SurveyResultRepo } from '../../../infra/db/mongodb/surveyResultRepo/survey-result'
import { LoadSurveyResult } from '../../../domain/useCases/load-survey-result'
import { DbLoadSurveyResult } from '../../../data/useCases/load-survey-result/db-load-survey-result'

export const makeDbLoadSurveyReult = (): LoadSurveyResult => {
  const loadSurveyResultRepo = new SurveyResultRepo()
  return new DbLoadSurveyResult(loadSurveyResultRepo)
}
