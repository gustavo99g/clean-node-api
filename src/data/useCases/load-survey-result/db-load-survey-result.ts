import { LoadSurveyResult } from '../../../domain/useCases/load-survey-result'
import { SurveyResultModel } from '../../../domain/models/survey-result'
import { LoadSurveyResultRepo } from '../../protocols/db/load-survey-result-repo'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (private readonly loadSurveyResultRepo: LoadSurveyResultRepo) {}
  async load (surveyId: string): Promise<SurveyResultModel | null> {
    await this.loadSurveyResultRepo.load(surveyId)
    return null
  }
}
