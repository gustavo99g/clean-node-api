import { Encrypter } from '../../data/protocols/encrypter'
import bcrypt from 'bcryptjs'

export class BcryptAdapter implements Encrypter {
  async encrypt (value: string): Promise<string> {
    return await bcrypt.hash(value, 8)
  }
}
