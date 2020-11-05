import { AddSurveyRepo } from '../../../../data/protocols/db/add-survey-repo'
import { AddSurveyModel } from '../../../../domain/useCases/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyRepo implements AddSurveyRepo {
  async add (survey: AddSurveyModel): Promise<void> {
    const surveyCollections = await MongoHelper.getCollection('surveys')
    await surveyCollections.insertOne(survey)
  }
}
