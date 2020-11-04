import { Authentication, AuthenticateModel } from '../../../domain/useCases/authentication'
import { findByEmailRepo } from '../../protocols/db/find-by_email-repo'
import { HashComparer } from '../../protocols/crypto/hash-comparer'

export class DbAuthentication implements Authentication {
  constructor (private readonly findByEmailRepo: findByEmailRepo, private readonly hashComparer: HashComparer) {}
  async auth (authModel: AuthenticateModel): Promise<any> {
    const { email, password } = authModel
    const user = await this.findByEmailRepo.find(email)
    if (user) {
      await this.hashComparer.compare(password, user.password)
    }
    return null
  }
}
