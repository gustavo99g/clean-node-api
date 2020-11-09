import { SurveyModel } from '../../../domain/models/survey'

export interface listSurveysRepo{
  list(): Promise<SurveyModel[]>
}
