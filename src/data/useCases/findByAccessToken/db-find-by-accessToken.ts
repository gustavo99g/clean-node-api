import { FindByAccessToken } from '../../../domain/useCases/find-by-accessToken'
import { AccountModel } from '../../../domain/models/account'
import { Decrypter } from '../../protocols/crypto/token-decrypter'

export class DbFindByAccessToken implements FindByAccessToken {
  constructor (private readonly decrypter: Decrypter) {}
  async find (token: string, role?: string): Promise<AccountModel | null> {
    await this.decrypter.decrypt(token)
    return null
  }
}
