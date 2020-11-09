
import { SurveyResultModel } from '../models/survey-result'

export interface FindSurveyByID {
  findById(id: string): Promise<SurveyResultModel>
}
