import { SaveSurveyResult, SaveSurveyResultModel } from '../../domain/useCases/save-survey-result'
import { SurveyResultModel } from '../../domain/models/survey-result'
import { mockSurveyResultModel } from '../../domain/test/mock-survey-result'
import { LoadSurveyResult } from '../../domain/useCases/load-survey-result'

export class SaveSurveyResultSpy implements SaveSurveyResult {
  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    return Promise.resolve(mockSurveyResultModel())
  }
}

export class LoadSurveyResultSpy implements LoadSurveyResult {
  async load (surveyId: string): Promise<SurveyResultModel> {
    return Promise.resolve(mockSurveyResultModel())
  }
}
