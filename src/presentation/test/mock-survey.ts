import { AddSurvey, AddSurveyModel } from '../../domain/useCases/add-survey'

export class AddSurveyStub implements AddSurvey {
  async add (survey: AddSurveyModel): Promise<void> {
    return Promise.resolve()
  }
}
