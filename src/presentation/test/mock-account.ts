import { Authentication, AuthenticateModel } from '../../domain/useCases/authentication'
import { AddAccount, AddAccountModel } from '../../domain/useCases/add-account'
import { AccountModel } from '../../domain/models/account'
import { MockAccountModel } from '../../domain/test/mock-account'

export class AuthSpy implements Authentication {
  async auth (authentication: AuthenticateModel): Promise<string> {
    return 'any_token'
  }
}

export class AddAccountSpy implements AddAccount {
  async add (account: AddAccountModel): Promise<AccountModel | null> {
    return new Promise(resolve => resolve(MockAccountModel()))
  }
}
