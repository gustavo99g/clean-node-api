import { SaveSurveyResultModel } from '../../../domain/useCases/save-survey-result'

export interface SaveSurveyResultRepo {
  save(data: SaveSurveyResultModel): Promise<void>
}
