import { LogErrorRepo } from '../../../../data/protocols/db/log-error-repo'
import { MongoHelper } from '../helpers/mongo-helper'

export class LogMongoRepo implements LogErrorRepo {
  async logError (stack: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.insertOne({
      stack,
      date: new Date()
    })
  }
}
