import { SurveyAnswer } from '../models/survey'

export interface AddSurveyModel{
  question: string
  answer: SurveyAnswer[]
  date: Date
}

export interface AddSurvey {
  add(survey: AddSurveyModel): Promise<void>
}
