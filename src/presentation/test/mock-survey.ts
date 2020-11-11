import { AddSurvey, AddSurveyModel } from '../../domain/useCases/add-survey'
import { mockSurveyModels, mockSurveyModel } from '../../domain/test/mock-survey'
import { ListSurveys } from '../../domain/useCases/list-survey'
import { SurveyModel } from '../../domain/models/survey'
import { FindSurveyByID } from '../../domain/useCases/find-survey-by-id'

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

export class FindByIdSurveySpy implements FindSurveyByID {
  async findById (id: string): Promise<SurveyModel | null> {
    return Promise.resolve(mockSurveyModel())
  }
}
