import { Authentication, AuthenticateModel } from '../../../domain/useCases/authentication'
import { findByEmailRepo } from '../../protocols/db/find-by_email-repo'
import { HashComparer } from '../../protocols/crypto/hash-comparer'
import { TokenGenerate } from '../../protocols/crypto/token-generator'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly findByEmailRepo: findByEmailRepo,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerate: TokenGenerate
  ) {}

  async auth (authModel: AuthenticateModel): Promise<any> {
    const { email, password } = authModel
    const user = await this.findByEmailRepo.find(email)
    if (user) {
      await this.hashComparer.compare(password, user.password)
      await this.tokenGenerate.generate(user.id)
    }
    return null
  }
}
