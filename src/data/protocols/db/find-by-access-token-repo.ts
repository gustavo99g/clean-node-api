import { AccountModel } from '../../../domain/models/account'

export interface findByAccessTokenRepo{
  find(token: string): Promise<AccountModel | null>
}
