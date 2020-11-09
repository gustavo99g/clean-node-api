import { SurveyModel } from '../models/survey'

export interface FindSurveyByID {
  findById(id: string): Promise<SurveyModel>
}
