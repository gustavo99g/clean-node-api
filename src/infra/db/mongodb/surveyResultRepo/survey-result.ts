import { SaveSurveyResultRepo } from '../../../../data/protocols/db/save-survey-result'
import { SaveSurveyResultModel } from '../../../../domain/useCases/save-survey-result'
import { SurveyResultModel } from '../../../../domain/models/survey-result'
import { MongoHelper } from '../helpers/mongo-helper'
import { ObjectID } from 'mongodb'
import { QueryBuilder } from '../helpers/query-builder'

export class SurveyResultRepo implements SaveSurveyResultRepo {
  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.findOneAndUpdate({
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

    const surveyResult = await this.loadBySurveyId(data.surveyId)
    return surveyResult
  }

  private async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')

    const query = new QueryBuilder()
      .match({
        surveyId: new ObjectID(surveyId)
      })
      .group({
        _id: 0,
        data: {
          $push: '$$ROOT'
        },
        total: {
          $sum: 1
        }
      })
      .unwind({
        path: '$data'
      })
      .lookup({
        from: 'surveys',
        foreignField: '_id',
        localField: 'data.surveyId',
        as: 'survey'
      })
      .unwind({
        path: '$survey'
      })
      .group({
        _id: {
          surveyId: '$survey._id',
          question: '$survey.question',
          date: '$survey.date',
          total: '$total',
          answer: '$data.answer',
          answers: '$survey.answers'
        },
        count: {
          $sum: 1
        }
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: {
          $map: {
            input: '$_id.answers',
            as: 'item',
            in: {
              $mergeObjects: ['$$item', {
                count: {
                  $cond: {
                    if: {
                      $eq: ['$$item.answer', '$_id.answer']
                    },
                    then: '$count',
                    else: 0
                  }
                },
                percent: {
                  $cond: {
                    if: {
                      $eq: ['$$item.answer', '$_id.answer']
                    },
                    then: {
                      $multiply: [{
                        $divide: ['$count', '$_id.total']
                      }, 100]
                    },
                    else: 0
                  }
                }
              }]
            }
          }
        }
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date'
        },
        answers: {
          $push: '$answers'
        }
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: {
          $reduce: {
            input: '$answers',
            initialValue: [],
            in: {
              $concatArrays: ['$$value', '$$this']
            }
          }
        }
      })
      .unwind({
        path: '$answers'
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date',
          answer: '$answers.answer',
          image: '$answers.image'
        },
        count: {
          $sum: '$answers.count'
        },
        percent: {
          $sum: '$answers.percent'
        }
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answer: {
          answer: '$_id.answer',
          image: '$_id.image',
          count: '$count',
          percent: '$percent'
        }
      })
      .sort({
        'answer.count': -1
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date'
        },
        answers: {
          $push: '$answer'
        }
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: '$answers'
      })
      .build()
    const surveyResult = await surveyResultCollection.aggregate(query).toArray()
    return surveyResult?.length ? surveyResult[0] : null
  }
}
