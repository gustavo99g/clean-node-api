import { AddSurveyModel } from '../../../domain/useCases/add-survey'

export interface AddSurveyRepo {
  add(survey: AddSurveyModel): Promise<void>
}
