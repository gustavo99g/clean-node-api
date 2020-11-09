import { SaveSurveyResult, SaveSurveyResultModel } from '../../../domain/useCases/save-survey-result'
import { SurveyResultModel } from '../../../domain/models/survey-result'
import { SaveSurveyResultRepo } from '../../protocols/db/save-survey-result'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (private readonly saveSurveyResultRepo: SaveSurveyResultRepo) {}
  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const survey = await this.saveSurveyResultRepo.save(data)
    return survey
  }
}
