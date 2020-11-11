import { SurveyResultModel } from '../models/survey-result'
import { SaveSurveyResultModel } from '../useCases/save-survey-result'

export const mockSurveyResultModel = (): SurveyResultModel => {
  return {
    id: 'any_id',
    accountId: 'any_accountId',
    surveyId: 'any_surveyId',
    answer: 'any_answer',
    date: new Date()

  }
}
export const mockSurverResultData = (): SaveSurveyResultModel => {
  return {
    accountId: 'any_accountId',
    surveyId: 'any_surveyId',
    answer: 'any_answer',
    date: new Date()
  }
}
