import { SurveyResultModel } from '../models/survey-result'
import { SaveSurveyResultModel } from '../useCases/save-survey-result'

export const mockSurveyResultModel = (): SurveyResultModel => {
  return {
    surveyId: 'any_surveyId',
    question: 'any_question',
    answers: [{
      answer: 'any_answer',
      count: 1,
      percent: 20
    }, {
      answer: 'other_answer',
      image: 'any_image',
      count: 5,
      percent: 70
    }],
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
