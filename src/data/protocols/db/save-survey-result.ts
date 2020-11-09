import { SaveSurveyResultModel } from '../../../domain/useCases/save-survey-result'
import { SurveyResultModel } from '../../../domain/models/survey-result'

export interface SaveSurveyResultRepo {
  save(data: SaveSurveyResultModel): Promise<SurveyResultModel>
}
