import { AccountModel } from '../../../domain/models/account'

export interface findByAccessTokenRepo{
  find(token: string, role?: string): Promise<AccountModel | null>
}
