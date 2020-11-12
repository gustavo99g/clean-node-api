
import { SaveSurveyResult } from '../../../domain/useCases/save-survey-result'
import { DbSaveSurveyResult } from '../../../data/useCases/save-survey-result/db-save-survey-result'
import { SurveyResultRepo } from '../../../infra/db/mongodb/surveyResultRepo/survey-result'

export const makeDbSaveSurveyReult = (): SaveSurveyResult => {
  const saveSurveyResultRepo = new SurveyResultRepo()
  const loadSurveyResultRepo = new SurveyResultRepo()
  return new DbSaveSurveyResult(saveSurveyResultRepo, loadSurveyResultRepo)
}
