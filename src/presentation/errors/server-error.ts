export class ServerError extends Error {
  constructor (err: string) {
    super('Internal server error')
    this.name = 'ServerError'
    this.stack = err
  }
}
