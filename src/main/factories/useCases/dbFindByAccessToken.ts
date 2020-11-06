import { FindByAccessToken } from '../../../domain/useCases/find-by-accessToken'
import { JwtAdapter } from '../../../infra/crypt/jwt-adapter/jwt-adapter'
import { AccountRepo } from '../../../infra/db/mongodb/accountRepo/account'
import { DbFindByAccessToken } from '../../../data/useCases/findByAccessToken/db-find-by-accessToken'

export const makeDbFindByAccessToken = (): FindByAccessToken => {
  const jwtAdapter = new JwtAdapter('secret')
  const accountRepo = new AccountRepo()
  return new DbFindByAccessToken(jwtAdapter, accountRepo)
}
