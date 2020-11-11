import { SaveSurveyResultRepo } from '../protocols/db/save-survey-result'
import { SaveSurveyResultModel } from '../../domain/useCases/save-survey-result'
import { SurveyResultModel } from '../../domain/models/survey-result'
import { mockSurveyModel } from '../../domain/test/mock-survey-result'

export class SaveSurveyResultRepoSpy implements SaveSurveyResultRepo {
  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    return Promise.resolve(mockSurveyModel())
  }
}
