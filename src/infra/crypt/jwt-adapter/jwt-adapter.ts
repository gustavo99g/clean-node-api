import { TokenGenerate } from '../../../data/protocols/crypto/token-generator'
import jwt from 'jsonwebtoken'
import { Decrypter } from '../../../data/protocols/crypto/token-decrypter'

export class JwtAdapter implements TokenGenerate, Decrypter {
  constructor (private readonly secret: string) {}
  async generate (id: string): Promise<string> {
    const token = await jwt.sign({ id }, this.secret)
    return token
  }

  async decrypt (token: string): Promise<string | object> {
    const res = await jwt.verify(token, this.secret)
    return res
  }
}
