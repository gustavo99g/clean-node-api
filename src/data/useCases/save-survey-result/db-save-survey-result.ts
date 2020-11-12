import { SaveSurveyResult, SaveSurveyResultModel } from '../../../domain/useCases/save-survey-result'
import { SaveSurveyResultRepo } from '../../protocols/db/save-survey-result'
import { LoadSurveyResultRepo } from '../../protocols/db/load-survey-result-repo'
import { SurveyResultModel } from '../../../domain/models/survey-result'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepo: SaveSurveyResultRepo,
    private readonly loadSurveyResultRepo: LoadSurveyResultRepo
  ) {}

  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepo.save(data)
    const survey = await this.loadSurveyResultRepo.load(data.surveyId)
    return survey
  }
}
