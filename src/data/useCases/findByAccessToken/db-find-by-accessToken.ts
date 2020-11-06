import { FindByAccessToken } from '../../../domain/useCases/find-by-accessToken'
import { AccountModel } from '../../../domain/models/account'
import { Decrypter } from '../../protocols/crypto/token-decrypter'

export class DbFindByAccessToken implements FindByAccessToken {
  constructor (private readonly decrypter: Decrypter) {}
  async find (token: string, role?: string): Promise<AccountModel | null> {
    const id = await this.decrypter.decrypt(token)
    if (!id) {
      return null
    }
    return {
      id: 'any_id',
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    }
  }
}
