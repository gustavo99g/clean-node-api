import { HashComparer } from '../protocols/crypto/hash-comparer'
import { TokenGenerate } from '../protocols/crypto/token-generator'
import { Hasher } from '../protocols/crypto/hasher'
import { Decrypter } from '../protocols/crypto/token-decrypter'

export class HashComparerSpy implements HashComparer {
  async compare (value: string, hash: string): Promise<boolean> {
    return Promise.resolve(true)
  }
}

export class TokenGenerateSpy implements TokenGenerate {
  async generate (id: string): Promise<string> {
    return Promise.resolve('any_token')
  }
}

export class HasherSpy implements Hasher {
  async Hash (value: string): Promise<string> {
    return new Promise(resolve => resolve('hashed_password'))
  }
}

export class DecrypterSpy implements Decrypter {
  async decrypt (token: string): Promise<string | null> {
    return Promise.resolve('any_id')
  }
}
