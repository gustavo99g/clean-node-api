import { AddAccountModel } from '../../domain/useCases/add-account'
import { AccountModel } from '../../domain/models/account'

export interface AddAccountRepo {
  add(accountData: AddAccountModel): Promise<AccountModel>
}
