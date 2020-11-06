import { FindByAccessToken } from '../../../domain/useCases/find-by-accessToken'
import { AccountModel } from '../../../domain/models/account'
import { Decrypter } from '../../protocols/crypto/token-decrypter'
import { findByAccessTokenRepo } from '../../protocols/db/find-by-access-token-repo'

export class DbFindByAccessToken implements FindByAccessToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly findByAccessTokenRepo: findByAccessTokenRepo
  ) {}

  async find (token: string, role?: string): Promise<AccountModel | null> {
    const isValid = await this.decrypter.decrypt(token)
    if (!isValid) {
      return null
    }
    const account = await this.findByAccessTokenRepo.find(token)

    if (!account) {
      return null
    }
    return account
  }
}
