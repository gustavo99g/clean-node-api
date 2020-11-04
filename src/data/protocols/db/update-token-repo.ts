export interface UpdateTokenRepo {
  updateAccessToken(id: string, token: string): Promise<void>
}
