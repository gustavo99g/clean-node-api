export interface TokenGenerate {
  generate(id: string): Promise<string>
}
