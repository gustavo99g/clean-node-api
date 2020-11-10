import { SaveSurveyResultRepo } from '../../../../data/protocols/db/save-survey-result'
import { SaveSurveyResultModel } from '../../../../domain/useCases/save-survey-result'
import { SurveyResultModel } from '../../../../domain/models/survey-result'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyResultRepo implements SaveSurveyResultRepo {
  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    const res = await surveyResultCollection.findOneAndUpdate({
      surveyId: data.surveyId,
      accountId: data.accountId
    }, {
      $set: {
        answer: data.answer,
        date: data.date
      }
    }, {
      upsert: true,
      returnOriginal: false
    })

    return MongoHelper.map(res.value)
  }
}
