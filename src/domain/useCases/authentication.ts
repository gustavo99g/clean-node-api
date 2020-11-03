export interface AuthenticateModel {
  email: string
  password: string
}

export interface Authentication{
  auth(authentication: AuthenticateModel): Promise<string>
}
