
import app from './config/app'
import env from './config/env'
import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'

MongoHelper.connect(env.Mongo_URL).then(() => {
  app.listen(3333)
})
  .catch(console.error)
