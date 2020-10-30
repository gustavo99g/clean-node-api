import express from 'express'
import middlewares from '../config/middlewares'

const app = express()

middlewares(app)

export default app
