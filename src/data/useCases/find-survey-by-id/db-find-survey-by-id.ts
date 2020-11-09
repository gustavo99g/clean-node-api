import { FindSurveyByID } from '../../../domain/useCases/find-survey-by-id'
import { SurveyModel } from '../../../domain/models/survey'
import { FindByIdSurveyRepo } from '../../protocols/db/find-by-id-survey'

export class DbFindByIdSurvey implements FindSurveyByID {
  constructor (private readonly findByIdSurveyRepo: FindByIdSurveyRepo) {}
  async findById (id: string): Promise<SurveyModel> {
    const survey = await this.findByIdSurveyRepo.findById(id)
    return survey
  }
}
