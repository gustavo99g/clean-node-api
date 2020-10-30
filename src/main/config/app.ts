import express from 'express'
import middlewares from '../config/middlewares'
import routes from './routes'

const app = express()

middlewares(app)
routes(app)

export default app
