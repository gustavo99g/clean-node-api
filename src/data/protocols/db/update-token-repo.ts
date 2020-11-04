export interface UpdateTokenRepo {
  update(id: string, token: string): Promise<void>
}
