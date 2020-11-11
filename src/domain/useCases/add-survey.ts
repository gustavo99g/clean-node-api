import { SurveyAnswer } from '../models/survey'

export interface AddSurveyModel{
  question: string
  answers: SurveyAnswer[]
  date: Date
}

export interface AddSurvey {
  add(survey: AddSurveyModel): Promise<void>
}
