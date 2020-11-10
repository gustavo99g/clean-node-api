import { AddSurveyRepo } from '../../../../data/protocols/db/add-survey-repo'
import { AddSurveyModel } from '../../../../domain/useCases/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'
import { listSurveysRepo } from '../../../../data/protocols/db/list-survey-repo'
import { SurveyModel } from '../../../../domain/models/survey'
import { FindByIdSurveyRepo } from '../../../../data/protocols/db/find-by-id-survey'
import { ObjectID } from 'mongodb'

export class SurveyRepo implements AddSurveyRepo, listSurveysRepo, FindByIdSurveyRepo {
  async add (survey: AddSurveyModel): Promise<void> {
    const surveyCollections = await MongoHelper.getCollection('surveys')
    await surveyCollections.insertOne(survey)
  }

  async list (): Promise<SurveyModel[]> {
    const surveyCollections = await MongoHelper.getCollection('surveys')
    const results = await surveyCollections.find().toArray()

    const surveys = results.map(result => MongoHelper.map(result))
    return surveys
  }

  async findById (id: string): Promise<SurveyModel> {
    const surveyCollections = await MongoHelper.getCollection('surveys')

    const result = await surveyCollections.findOne({ _id: new ObjectID(id) })

    return result && MongoHelper.map(result)
  }
}
