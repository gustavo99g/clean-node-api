import { AccountModel } from '../models/account'
import { AuthenticateModel } from '../useCases/authentication'
import { AddAccountModel } from '../useCases/add-account'

export const MockAccountModel = (): AccountModel => {
  return {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'hashed_password'
  }
}
export const mockAuthData = (): AuthenticateModel => {
  return {

    email: 'any_email@mail.com',
    password: 'any_password'
  }
}

export const mockAccountData = (): AddAccountModel => {
  return {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  }
}
