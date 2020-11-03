import { Authentication, AuthenticateModel } from '../../../domain/useCases/authentication'
import { findByEmailRepo } from '../../protocols/find-by_email-repo'

export class DbAuthentication implements Authentication {
  constructor (private readonly findByEmailRepo: findByEmailRepo) {}
  async auth (authModel: AuthenticateModel): Promise<any> {
    await this.findByEmailRepo.find(authModel.email)
  }
}
