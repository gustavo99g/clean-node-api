import { AccountModel } from '../models/account'

export interface FindByAccessToken {
  find(token: string, role?: string): Promise<AccountModel | null>
}
