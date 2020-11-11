import express from 'express'
import middlewares from '../config/middlewares'
import routes from './routes'
import setuSwagger from './config-swagger'

const app = express()
setuSwagger(app)
middlewares(app)
routes(app)

export default app
