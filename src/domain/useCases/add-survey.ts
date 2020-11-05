import { SurveyAnswer } from '../models/survey'

export interface AddSurveyModel{
  question: string
  answer: SurveyAnswer[]
}

export interface AddSurvey {
  add(survey: AddSurveyModel): Promise<void>
}
