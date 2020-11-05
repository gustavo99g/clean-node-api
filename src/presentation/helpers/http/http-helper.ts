import { HttpResponse } from '../../protocols/http'
import { ServerError } from '../../errors/server-error'
import { UnauthorizedError } from '../../errors/unauthorized-error'

export const badRequest = (error: Error): HttpResponse => {
  return {
    statusCode: 400,
    body: error.message
  }
}

export const forbidden = (error: Error): HttpResponse => {
  return {
    statusCode: 403,
    body: error.message
  }
}

export const unauthorized = (): HttpResponse => {
  return {
    statusCode: 401,
    body: new UnauthorizedError()
  }
}

export const serverError = (err: Error): HttpResponse => {
  return {
    statusCode: 500,
    body: new ServerError(err.stack as string)
  }
}

export const ok = (data: any): HttpResponse => {
  return {
    statusCode: 200,
    body: data
  }
}
