import { SurveyResultModel } from '../models/survey-result'

export interface SaveSurveyResult {
  load(surveyId: string): Promise<SurveyResultModel>
}
