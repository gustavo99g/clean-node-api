import { Express } from 'express'
import { serve, setup } from 'swagger-ui-express'
import configSwagger from './../docs'
import { noCache } from '../middlewares/no-cache'

export default (app: Express): void => {
  app.use('/api-docs', noCache, serve, setup(configSwagger))
}
