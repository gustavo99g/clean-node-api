import { AccountModel } from '../models/account'

export interface FindByAccessToken {
  findByAccessToken(token: string, role?: string): Promise<AccountModel | null>
}
