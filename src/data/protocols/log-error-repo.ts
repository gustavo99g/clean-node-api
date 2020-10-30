export interface LogErrorRepo{
  log(stack: string): Promise<void>
}
