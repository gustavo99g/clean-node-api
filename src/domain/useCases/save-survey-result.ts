import { SurveyResultModel } from '../models/survey-result'

export interface SaveSurveyResultModel{
  surveyId: string
  accountId: string
  answer: string
  date: Date
}

export interface SaveSurveyResult {
  save(data: SaveSurveyResultModel): Promise<SurveyResultModel>
}
