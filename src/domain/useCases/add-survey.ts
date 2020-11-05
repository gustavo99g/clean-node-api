import { SurveyModel } from '../models/survey'

export interface AddSurveyModel{
  answer: SurveyModel
}

export interface AddSurvey {
  add(survey: AddSurveyModel): Promise<void>
}
