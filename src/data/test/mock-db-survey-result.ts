import { SaveSurveyResultRepo } from '../protocols/db/save-survey-result'
import { SaveSurveyResultModel } from '../../domain/useCases/save-survey-result'
import { LoadSurveyResult } from '../../domain/useCases/load-survey-result'
import { SurveyResultModel } from '../../domain/models/survey-result'
import { mockSurveyResultModel } from '../../domain/test/mock-survey-result'

export class SaveSurveyResultRepoSpy implements SaveSurveyResultRepo {
  async save (data: SaveSurveyResultModel): Promise<void> {
    return Promise.resolve()
  }
}

export class LoadSurveyResultSpy implements LoadSurveyResult {
  async load (surveyId: string): Promise<SurveyResultModel> {
    return Promise.resolve(mockSurveyResultModel())
  }
}
