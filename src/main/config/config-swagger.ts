import { Express } from 'express'
import { serve, setup } from 'swagger-ui-express'
import configSwagger from './../docs'

export default (app: Express): void => {
  app.use('/api-docs', serve, setup(configSwagger))
}
