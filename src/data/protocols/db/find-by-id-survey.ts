import { SurveyModel } from '../../../domain/models/survey'

export interface FindByIdSurveyRepo{
  findById(id: string): Promise<SurveyModel>
}
