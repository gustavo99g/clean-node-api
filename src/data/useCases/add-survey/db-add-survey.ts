import { AddSurvey, AddSurveyModel } from '../../../domain/useCases/add-survey'
import { AddSurveyRepo } from '../../protocols/db/add-survey-repo'

export class DbAddSurvey implements AddSurvey {
  constructor (private readonly addSurverRepo: AddSurveyRepo) {}
  async add (survey: AddSurveyModel): Promise<void> {
    await this.addSurverRepo.add(survey)
  }
}
