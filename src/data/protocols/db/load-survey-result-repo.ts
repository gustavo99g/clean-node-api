import { SurveyResultModel } from '../../../domain/models/survey-result'

export interface LoadSurveyResultRepo {
  load(surveyId: string): Promise<SurveyResultModel>
}
