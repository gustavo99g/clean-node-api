import { Authentication, AuthenticateModel } from '../../../domain/useCases/authentication'
import { findByEmailRepo } from '../../protocols/db/find-by_email-repo'
import { HashComparer } from '../../protocols/crypto/hash-comparer'
import { TokenGenerate } from '../../protocols/crypto/token-generator'
import { UpdateTokenRepo } from '../../protocols/db/update-token-repo'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly findByEmailRepo: findByEmailRepo,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerate: TokenGenerate,
    private readonly updateTokenRepo: UpdateTokenRepo
  ) {}

  async auth (authModel: AuthenticateModel): Promise<any> {
    const { email, password } = authModel
    const user = await this.findByEmailRepo.find(email)
    if (user) {
      const passMatch = await this.hashComparer.compare(password, user.password)
      if (passMatch) {
        const token = await this.tokenGenerate.generate(user.id)
        await this.updateTokenRepo.update(user.id, token)
        return token
      }
    }
    return null
  }
}
