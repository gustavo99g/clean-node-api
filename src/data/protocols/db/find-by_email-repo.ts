import { AccountModel } from '../../../domain/models/account'

export interface findByEmailRepo{
  findByEmail(email: string, token?: string): Promise<AccountModel | null>
}
