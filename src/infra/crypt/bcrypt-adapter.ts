import { Encrypter } from '../../data/protocols/crypto/encrypter'
import bcrypt from 'bcryptjs'

export class BcryptAdapter implements Encrypter {
  async encrypt (value: string): Promise<string> {
    return await bcrypt.hash(value, 8)
  }
}
