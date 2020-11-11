import { AddSurvey, AddSurveyModel } from '../../domain/useCases/add-survey'
import { mockSurveyModels } from '../../domain/test/mock-survey'
import { ListSurveys } from '../../domain/useCases/list-survey'
import { SurveyModel } from '../../domain/models/survey'

export class AddSurveySpy implements AddSurvey {
  async add (survey: AddSurveyModel): Promise<void> {
    return Promise.resolve()
  }
}

export class ListSurveysSpy implements ListSurveys {
  async list (): Promise<SurveyModel[]> {
    return Promise.resolve(mockSurveyModels())
  }
}
