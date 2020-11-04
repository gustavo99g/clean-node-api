import { AccountModel } from '../../../domain/models/account'

export interface findByEmailRepo{
  find(email: string): Promise<AccountModel>
}
