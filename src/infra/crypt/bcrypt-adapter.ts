import { Hasher } from '../../data/protocols/crypto/hasher'
import bcrypt from 'bcryptjs'
import { HashComparer } from '../../data/protocols/crypto/hash-comparer'

export class BcryptAdapter implements Hasher, HashComparer {
  async Hash (value: string): Promise<string> {
    return await bcrypt.hash(value, 8)
  }

  async compare (value: string, hash: string): Promise<boolean> {
    const isValid = await bcrypt.compare(value, hash)
    return isValid
  }
}
