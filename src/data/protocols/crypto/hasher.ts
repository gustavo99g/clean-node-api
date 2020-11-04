export interface Hasher{
  Hash(value: string): Promise<string>
}
