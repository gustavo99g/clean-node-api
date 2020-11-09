import { ListSurveys } from '../../../domain/useCases/list-survey'
import { SurveyModel } from '../../../domain/models/survey'
import { listSurveysRepo } from '../../protocols/db/list-survey-repo'

export class DbListSurvey implements ListSurveys {
  constructor (private readonly listSurveysRepo: listSurveysRepo) {}
  async list (): Promise<SurveyModel[]> {
    const surveys = await this.listSurveysRepo.list()
    return surveys
  }
}
