import { Hasher } from '../../data/protocols/crypto/hasher'
import bcrypt from 'bcryptjs'

export class BcryptAdapter implements Hasher {
  async Hash (value: string): Promise<string> {
    return await bcrypt.hash(value, 8)
  }
}
