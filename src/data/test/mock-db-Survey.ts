import { AddSurveyRepo } from '../protocols/db/add-survey-repo'
import { AddSurveyModel } from '../../domain/useCases/add-survey'
import { FindByIdSurveyRepo } from '../protocols/db/find-by-id-survey'
import { SurveyModel } from '../../domain/models/survey'
import { mockSurveyModel, mockSurveyModels } from '../../domain/test/mock-survey'
import { listSurveysRepo } from '../protocols/db/list-survey-repo'

export class AddSurveyRepoSpy implements AddSurveyRepo {
  async add (survey: AddSurveyModel): Promise<void> {
    return Promise.resolve()
  }
}

export class FindByIdSurveyRepoSpy implements FindByIdSurveyRepo {
  async findById (id: string): Promise<SurveyModel> {
    return Promise.resolve(mockSurveyModel())
  }
}

export class ListSurveyRepoSpy implements listSurveysRepo {
  async list (): Promise<SurveyModel[]> {
    return Promise.resolve(mockSurveyModels())
  }
}
