import { DbAuthentication } from '../../../data/useCases/authentication/db-authentication'
import { JwtAdapter } from '../../../infra/crypt/jwt-adapter/jwt-adapter'
import { BcryptAdapter } from '../../../infra/crypt/bcrypt-adapter/bcrypt-adapter'
import { AccountRepo } from '../../../infra/db/mongodb/accountRepo/account'
import { Authentication } from '../../../domain/useCases/authentication'

export const makeDdAuthentication = (): Authentication => {
  const jwtAdapter = new JwtAdapter('secret')
  const bcryptAdapter = new BcryptAdapter()
  const accountRepo = new AccountRepo()

  const authentication = new DbAuthentication(accountRepo, bcryptAdapter, jwtAdapter, accountRepo)
  return authentication
}
