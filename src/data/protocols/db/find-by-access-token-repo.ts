import { AccountModel } from '../../../domain/models/account'

export interface findByAccessTokenRepo{
  findByAccessToken(token: string, role?: string): Promise<AccountModel | null>
}
