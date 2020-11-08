import { Request, Response, NextFunction } from 'express'
import { HttpRequest } from '../../presentation/protocols/http'
import { Middleware } from '../../presentation/protocols/middleware'

export const adapterMiddleware = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      headers: req.headers
    }
    const httpResponse = await middleware.handle(httpRequest)
    if (httpResponse.statusCode === 200) {
      Object.assign(req, httpResponse.body)

      return next()
    }
    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
